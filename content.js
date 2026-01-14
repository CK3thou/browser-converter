// Content script - runs on every webpage
const TIMEZONE_REGEX = /(\d{1,2}):(\d{2})\s*(?:AM|PM|am|pm)?\s*(?:UTC|GMT|EST|CST|MST|PST|EDT|CDT|MDT|PDT|IST|JST|AEST|AWST|ACST|UTC[+-]\d{1,2}|[A-Z]{3,4})?/gi;
const CURRENCY_REGEX = /[$£€¥₹₽₩₪₨₱₡₦₲₴₵₸₺₼₾￠￡￥￦][\s]?\d+(?:,\d{3})*(?:\.\d{2})?|(?:USD|EUR|GBP|JPY|INR|CAD|AUD|CHF|CNY|SEK|NZD|MXN|SGD|HKD|NOK|KRW|TRY|RUB|INR|BRL|ZAR)\s*[\s]?\d+(?:,\d{3})*(?:\.\d{2})?/gi;

let selectedText = '';
let selectionRange = null;
let cachedOffsets = {}; // Cache timezone offsets to avoid recalculation
let cachedPreferredTz = null; // Cache preferred timezone from storage

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('touchend', handleTextSelection);

// Load preferred timezone once on script load
chrome.storage.sync.get(['preferredTimezone'], (result) => {
  cachedPreferredTz = result.preferredTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
});

// Update cached timezone when storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.preferredTimezone) {
    cachedPreferredTz = changes.preferredTimezone.newValue || Intl.DateTimeFormat().resolvedOptions().timeZone;
    cachedOffsets = {}; // Clear cache when timezone changes
  }
});

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

  // Process conversion immediately (synchronous)
  if (conversionType === 'time') {
    const result = convertTime(selectedText);
    const convertedText = popup.querySelector('.converted-text');
    if (convertedText && popup.parentNode) {
      convertedText.textContent = result ? escapeHtml(result) : 'Could not convert';
      convertedText.classList.remove('loading');
      if (result) {
        updateCopyButton(popup, result);
      }
    }
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

function getTimezoneOffset(timezone) {
  // Return cached offset if available
  if (cachedOffsets[timezone] !== undefined) {
    return cachedOffsets[timezone];
  }
  
  // Get the UTC offset for a timezone by comparing local and timezone-specific times
  const now = new Date();
  
  // Format the current date in UTC and in the target timezone
  const utcFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });
  
  const tzFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone
  });
  
  // Parse formatted strings: "MM/DD/YYYY, HH:MM:SS"
  const utcParts = utcFormatter.formatToParts(now);
  const tzParts = tzFormatter.formatToParts(now);
  
  // Extract hour and minute from parts
  const utcHour = parseInt(utcParts.find(p => p.type === 'hour').value, 10);
  const utcMinute = parseInt(utcParts.find(p => p.type === 'minute').value, 10);
  
  const tzHour = parseInt(tzParts.find(p => p.type === 'hour').value, 10);
  const tzMinute = parseInt(tzParts.find(p => p.type === 'minute').value, 10);
  
  // Calculate the difference in minutes, then convert to milliseconds
  const utcTotalMinutes = utcHour * 60 + utcMinute;
  const tzTotalMinutes = tzHour * 60 + tzMinute;
  const diffMinutes = tzTotalMinutes - utcTotalMinutes;
  
  const offset = diffMinutes * 60 * 1000; // Convert to milliseconds
  
  // Cache the result
  cachedOffsets[timezone] = offset;
  return offset;
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
  // Use cached timezone, or fall back to system timezone if cache hasn't loaded yet
  const preferredTz = cachedPreferredTz || Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    // Parse time (supports H:MM, HH:MM, optional AM/PM)
    const timeMatch = timeText.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/);
    if (!timeMatch) return null;

    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2] || '0', 10);
    const ampm = timeMatch[3];

    if (ampm) {
      const lower = ampm.toLowerCase();
      if (lower === 'pm' && hours !== 12) hours += 12;
      if (lower === 'am' && hours === 12) hours = 0;
    }

    // Try to detect source timezone abbreviation/IANA from the text
    const tzTokenMatch = timeText.match(/([A-Za-z_\\/]+|UTC[+-]?\d{1,2}|GMT[+-]?\d{1,2}|[A-Z]{2,4})$/i);
    let sourceTz = tzTokenMatch ? tzTokenMatch[1] : null;

    // Map common timezone abbreviations to IANA timezones
    const tzMap = {
      'EST': 'America/New_York',
      'EDT': 'America/New_York',
      'CST': 'America/Chicago',
      'CDT': 'America/Chicago',
      'MST': 'America/Denver',
      'MDT': 'America/Denver',
      'PST': 'America/Los_Angeles',
      'PDT': 'America/Los_Angeles',
      'GMT': 'UTC',
      'UTC': 'UTC',
      'IST': 'Asia/Kolkata',
      'JST': 'Asia/Tokyo',
      'AEST': 'Australia/Sydney',
      'AWST': 'Australia/Perth',
      'ACST': 'Australia/Adelaide'
    };

    // Resolve timezone: use mapped abbreviation or assume it's a valid IANA timezone
    if (sourceTz && tzMap[sourceTz.toUpperCase()]) {
      sourceTz = tzMap[sourceTz.toUpperCase()];
    } else if (!sourceTz) {
      sourceTz = preferredTz; // If no source timezone, assume it's in preferred timezone
    }

    // Get offsets from cache (instant lookup after first call)
    const sourceOffset = getTimezoneOffset(sourceTz);
    const targetOffset = getTimezoneOffset(preferredTz);
    const offsetDiff = sourceOffset - targetOffset; // Difference in milliseconds

    // Create the time in the source timezone
    const sourceDate = new Date();
    sourceDate.setHours(hours, minutes, 0, 0);

    // Adjust by the timezone difference to get the target timezone time
    const convertedDate = new Date(sourceDate.getTime() + offsetDiff);

    // Format in the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: preferredTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const formatted = formatter.format(convertedDate);
    return `${formatted} (${preferredTz})`;
  } catch (e) {
    console.error('Time conversion error:', e);
    return null;
  }
}

// Helper function to detect system currency from locale
function getSystemCurrency() {
  try {
    // Get currency code from system locale
    const formatter = new Intl.NumberFormat(undefined, { style: 'currency' });
    const currencyCode = formatter.resolvedOptions().currency;
    return currencyCode || 'USD';
  } catch (e) {
    console.error('Failed to detect system currency:', e);
    return 'USD';
  }
}

function convertCurrency(currencyText) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['preferredCurrency'], (result) => {
      // Use stored preference if set, otherwise use system currency
      let preferredCurrency = result.preferredCurrency;
      
      if (!preferredCurrency || preferredCurrency === 'auto') {
        // Auto-detect from system locale
        preferredCurrency = getSystemCurrency();
      }
      
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
