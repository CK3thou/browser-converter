// Content script - runs on every webpage
const TIMEZONE_REGEX = /(\d{1,2}):(\d{2})\s*(?:AM|PM|am|pm)?\s*(?:UTC|GMT|EST|CST|MST|PST|EDT|CDT|MDT|PDT|IST|JST|AEST|AWST|ACST|UTC[+-]\d{1,2}|[A-Z]{3,4})?/gi;
const CURRENCY_REGEX = /[$£€¥₹₽₩₪₨₱₡₦₲₴₵₸₺₼₾￠￡￥￦][\s]?\d+(?:,\d{3})*(?:\.\d{2})?|(?:USD|EUR|GBP|JPY|INR|CAD|AUD|CHF|CNY|SEK|NZD|MXN|SGD|HKD|NOK|KRW|TRY|RUB|INR|BRL|ZAR)\s*[\s]?\d+(?:,\d{3})*(?:\.\d{2})?/gi;

let selectedText = '';
let selectionRange = null;

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('touchend', handleTextSelection);

function handleTextSelection() {
  const selection = window.getSelection();
  
  if (selection.toString().length > 0) {
    selectedText = selection.toString().trim();
    
    // Get the range of the selection
    if (selection.rangeCount > 0) {
      selectionRange = selection.getRangeAt(0);
      showConversionPopup();
    }
  }
}

function showConversionPopup() {
  // Remove any existing popup
  const existingPopup = document.getElementById('text-converter-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Determine conversion type instantly
  let conversionType = 'unknown';

  if (isTimeWithTimezone(selectedText)) {
    conversionType = 'time';
  } else if (isCurrency(selectedText)) {
    conversionType = 'currency';
  } else {
    return; // Not a recognized format
  }

  // Get popup position
  const rect = selectionRange.getBoundingClientRect();
  const popupX = rect.left + window.scrollX;
  const popupY = rect.top + window.scrollY - 60;

  // Create popup element with loading state
  const popup = document.createElement('div');
  popup.id = 'text-converter-popup';
  popup.className = `converter-popup converter-${conversionType}`;
  popup.innerHTML = `
    <div class="popup-content">
      <div class="popup-header">
        <span class="conversion-type">${conversionType.toUpperCase()}</span>
        <button class="popup-close">×</button>
      </div>
      <div class="popup-body">
        <div class="original-text">${escapeHtml(selectedText)}</div>
        <div class="conversion-arrow">→</div>
        <div class="converted-text loading">Converting...</div>
      </div>
      <div class="popup-footer">
        <button class="copy-btn" disabled>Copy Result</button>
      </div>
    </div>
  `;

  popup.style.position = 'fixed';
  popup.style.left = popupX + 'px';
  popup.style.top = popupY + 'px';
  popup.style.zIndex = '10000';

  document.body.appendChild(popup);

  // Close button handler
  popup.querySelector('.popup-close').addEventListener('click', () => {
    popup.remove();
  });

  // Remove popup on next selection
  document.addEventListener('mousedown', function removePopupOnClick() {
    popup.remove();
    document.removeEventListener('mousedown', removePopupOnClick);
  }, { once: true });

  // Fetch conversion result asynchronously
  if (conversionType === 'time') {
    convertTime(selectedText).then(result => {
      const convertedText = popup.querySelector('.converted-text');
      if (convertedText && popup.parentNode) {
        convertedText.textContent = escapeHtml(result);
        convertedText.classList.remove('loading');
        updateCopyButton(popup, result);
      }
    });
  } else if (conversionType === 'currency') {
    convertCurrency(selectedText).then(result => {
      const convertedText = popup.querySelector('.converted-text');
      if (convertedText && popup.parentNode) {
        convertedText.textContent = escapeHtml(result);
        convertedText.classList.remove('loading');
        updateCopyButton(popup, result);
      }
    });
  }
}

function updateCopyButton(popup, conversionResult) {
  const copyBtn = popup.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.disabled = false;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(conversionResult).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy Result';
        }, 2000);
      });
    });
  }
}

function isTimeWithTimezone(text) {
  return TIMEZONE_REGEX.test(text);
}

function isCurrency(text) {
  return CURRENCY_REGEX.test(text);
}

function parseUtcOffset(offsetStr) {
  // Parse offset like "-05:00" or "+01:00" into milliseconds
  const match = offsetStr.match(/([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  return sign * (hours * 3600 + minutes * 60) * 1000; // Convert to milliseconds
}

function convertTime(timeText) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['preferredTimezone'], async (result) => {
      const preferredTz = result.preferredTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

      try {
        // Parse time (supports H:MM, HH:MM, optional AM/PM)
        const timeMatch = timeText.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/);
        if (!timeMatch) return resolve(null);

        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2] || '0', 10);
        const ampm = timeMatch[3];

        if (ampm) {
          const lower = ampm.toLowerCase();
          if (lower === 'pm' && hours !== 12) hours += 12;
          if (lower === 'am' && hours === 12) hours = 0;
        }

        // Try to detect source timezone token from the text (e.g., 'EST', 'UTC', or IANA like 'America/New_York')
        const tzTokenMatch = timeText.match(/([A-Za-z_\\/]+|UTC[+-]?\d{1,2}|GMT[+-]?\d{1,2}|[A-Z]{2,4})$/i);
        const sourceTzToken = tzTokenMatch ? tzTokenMatch[1] : null;

        // Use worldtimeapi.org via the helper if available
        if (window.worldTimeApiConvert) {
          try {
            const apiResp = await window.worldTimeApiConvert({
              fromTimeZone: sourceTzToken || 'UTC',
              toTimeZone: preferredTz,
              dateTime: null
            });

            if (apiResp && apiResp.fromTimezone && apiResp.toTimezone) {
              // Extract UTC offsets from both timezones
              const fromOffset = parseUtcOffset(apiResp.fromTimezone.utc_offset);
              const toOffset = parseUtcOffset(apiResp.toTimezone.utc_offset);
              const timeDiff = toOffset - fromOffset; // Difference in milliseconds

              // Create a date for the parsed time and adjust by the timezone difference
              const adjustedDate = new Date();
              adjustedDate.setHours(hours, minutes, 0, 0);
              adjustedDate.setTime(adjustedDate.getTime() + timeDiff);

              // Format in the target timezone
              const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: preferredTz,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              const formatted = formatter.format(adjustedDate);
              return resolve(`${formatted} (${preferredTz})`);
            }
          } catch (apiErr) {
            console.warn('worldtimeapi helper error, falling back:', apiErr);
            // continue to fallback
          }
        }

        // Fallback: format using browser's Intl
        const fallbackDate = new Date();
        fallbackDate.setHours(hours, minutes, 0, 0);

        const fallbackFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: preferredTz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });

        resolve(`${fallbackFormatter.format(fallbackDate)} (${preferredTz})`);
      } catch (e) {
        console.error('Time conversion error:', e);
        resolve(null);
      }
    });
  });
}

function convertCurrency(currencyText) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['preferredCurrency'], (result) => {
      const preferredCurrency = result.preferredCurrency || 'USD';
      
      try {
        // Extract currency code and amount
        const currencyMatch = currencyText.match(/([A-Z]{3}|\$|£|€|¥|₹|₽|₩|₪|₨|₱|₡|₦|₲|₴|₵|₸|₺|₼|₾)/i);
        const amountMatch = currencyText.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);

        if (!currencyMatch || !amountMatch) return resolve(null);

        const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        
        // Request conversion from background script
        chrome.runtime.sendMessage(
          { action: 'convertCurrency', amount, preferredCurrency },
          (response) => {
            if (response && response.success) {
              resolve(`${response.result} ${preferredCurrency}`);
            } else {
              resolve(null);
            }
          }
        );
      } catch (e) {
        console.error('Currency conversion error:', e);
        resolve(null);
      }
    });
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Handle async conversion results
document.addEventListener('conversionReady', (event) => {
  const popup = document.getElementById('text-converter-popup');
  if (popup) {
    const convertedText = popup.querySelector('.converted-text');
    convertedText.textContent = event.detail.result;
  }
});
