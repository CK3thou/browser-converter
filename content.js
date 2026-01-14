// Content script - runs on every webpage
const TIMEZONE_REGEX = /(\d{1,2}):(\d{2})\s*(?:AM|PM|am|pm)?\s*(?:UTC|GMT|EST|CST|MST|PST|EDT|CDT|MDT|PDT|IST|JST|AEST|AWST|ACST|UTC[+-]\d{1,2}|[A-Z]{3,4})?/gi;
const CURRENCY_REGEX = /[$£€¥₹₽₩₪₨₱₡₦₲₴₵₸₺₼₾￠￡￥￦][\s]?\d+(?:,\d{3})*(?:\.\d{2})?|(?:USD|EUR|GBP|JPY|INR|CAD|AUD|CHF|CNY|SEK|NZD|MXN|SGD|HKD|NOK|KRW|TRY|RUB|INR|BRL|ZAR)\s*[\s]?\d+(?:,\d{3})*(?:\.\d{2})?/gi;
const CACHE_KEY = 'exchange_rates_cache';

let selectedText = '';
let selectionRange = null;
let cachedOffsets = {}; // Cache timezone offsets to avoid recalculation
let cachedPreferredTz = null; // Cache preferred timezone from storage
let cachedExchangeRates = null; // Cache exchange rates for instant conversion
let cachedPreferredCurrency = null; // Cache preferred currency

// Fallback rates (if API is unavailable)
const FALLBACK_RATES = {
  'USD': 1.0, 'AED': 3.67, 'AFN': 65.0, 'ALL': 92.0, 'AMD': 390.0, 'ANG': 1.79,
  'AOA': 835.0, 'ARS': 830.0, 'AUD': 1.53, 'AWG': 1.79, 'AZN': 1.70, 'BAM': 1.80,
  'BBD': 2.0, 'BDT': 106.0, 'BGN': 1.80, 'BHD': 0.38, 'BIF': 2870.0, 'BMD': 1.0,
  'BND': 1.36, 'BOB': 6.95, 'BRL': 5.21, 'BSD': 1.0, 'BTN': 82.0, 'BWP': 13.5,
  'BYN': 3.30, 'BZD': 2.0, 'CAD': 1.36, 'CDF': 2620.0, 'CHF': 0.88, 'CLP': 920.0,
  'CNY': 7.24, 'COP': 4100.0, 'CRC': 515.0, 'CUC': 1.0, 'CUP': 25.0, 'CVE': 103.0,
  'CZK': 23.5, 'DJF': 177.0, 'DKK': 6.95, 'DOP': 58.0, 'DZD': 135.0, 'EGP': 49.0,
  'ERN': 15.0, 'ETB': 127.0, 'EUR': 0.92, 'FJD': 2.25, 'FKP': 0.79, 'GBP': 0.79,
  'GEL': 2.70, 'GHS': 15.0, 'GIP': 0.79, 'GMD': 67.0, 'GNF': 8620.0, 'GTQ': 7.85,
  'GYD': 209.0, 'HKD': 7.81, 'HNL': 24.5, 'HRK': 6.90, 'HTG': 132.0, 'HUF': 370.0,
  'IDR': 15650.0, 'ILS': 3.70, 'INR': 83.12, 'IQD': 1310.0, 'IRR': 42300.0, 'ISK': 138.0,
  'JMD': 154.0, 'JOD': 0.71, 'JPY': 149.5, 'KES': 130.0, 'KGS': 85.0, 'KHR': 4100.0,
  'KMF': 459.0, 'KPW': 900.0, 'KRW': 1319.0, 'KWD': 0.31, 'KYD': 0.83, 'KZT': 430.0,
  'LAK': 21000.0, 'LBP': 89500.0, 'LKR': 300.0, 'LRD': 186.0, 'LSL': 18.5, 'LYD': 4.88,
  'MAD': 9.90, 'MDL': 17.8, 'MGA': 4380.0, 'MKD': 57.5, 'MMK': 2100.0, 'MNT': 3400.0,
  'MOP': 8.05, 'MRU': 39.0, 'MUR': 46.0, 'MVR': 15.4, 'MWK': 1060.0, 'MXN': 17.05,
  'MYR': 4.68, 'MZN': 64.0, 'NAD': 18.5, 'NGN': 1550.0, 'NIO': 36.5, 'NOK': 10.48,
  'NPR': 132.0, 'NZD': 1.67, 'OMR': 0.385, 'PAB': 1.0, 'PEN': 3.75, 'PGK': 3.55,
  'PHP': 56.0, 'PKR': 278.0, 'PLN': 4.00, 'PYG': 7400.0, 'QAR': 3.64, 'RON': 4.97,
  'RSD': 110.0, 'RUB': 99.99, 'RWF': 1310.0, 'SAR': 3.75, 'SBD': 8.30, 'SCR': 12.7,
  'SDG': 503.0, 'SEK': 10.79, 'SGD': 1.34, 'SHP': 0.79, 'SLL': 21800.0, 'SOS': 571.0,
  'SRD': 32.5, 'SSP': 130.0, 'STN': 22.8, 'SVC': 8.75, 'SYP': 12900.0, 'SZL': 18.5,
  'THB': 35.5, 'TJS': 10.7, 'TMT': 3.50, 'TND': 3.15, 'TOP': 2.35, 'TRY': 33.45,
  'TTD': 6.80, 'TWD': 32.0, 'TZS': 2530.0, 'UAH': 41.0, 'UGX': 3750.0, 'UYU': 43.0,
  'UZS': 12800.0, 'VES': 36.0, 'VND': 25200.0, 'VUV': 120.0, 'WST': 2.85, 'XAF': 613.0,
  'XCD': 2.70, 'XOF': 613.0, 'XPF': 110.0, 'YER': 250.0, 'ZAR': 18.75, 'ZMW': 26.5, 'ZWL': 50.0
};

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('touchend', handleTextSelection);

// Load preferred timezone once on script load
chrome.storage.sync.get(['preferredTimezone'], (result) => {
  cachedPreferredTz = result.preferredTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
});

// Pre-load exchange rates and preferred currency on script load
chrome.storage.local.get([CACHE_KEY], (result) => {
  const cached = result[CACHE_KEY];
  cachedExchangeRates = (cached && cached.rates) ? cached.rates : FALLBACK_RATES;
});

// Use user's selected currency, or fall back to system if not set
chrome.storage.sync.get(['preferredCurrency'], (result) => {
  cachedPreferredCurrency = result.preferredCurrency || getSystemCurrency();
});

// Update cached timezone when storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.preferredTimezone) {
    cachedPreferredTz = changes.preferredTimezone.newValue || Intl.DateTimeFormat().resolvedOptions().timeZone;
    cachedOffsets = {}; // Clear cache when timezone changes
  }
  // Update exchange rates if background service updated them
  if (changes[CACHE_KEY]) {
    const cached = changes[CACHE_KEY].newValue;
    cachedExchangeRates = (cached && cached.rates) ? cached.rates : FALLBACK_RATES;
  }
  // Update preferred currency if changed
  if (changes.preferredCurrency) {
    cachedPreferredCurrency = changes.preferredCurrency.newValue || getSystemCurrency();
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
  // Remove any existing popup or selector
  const existingPopup = document.getElementById('text-converter-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  const existingSelector = document.getElementById('currency-selector-modal');
  if (existingSelector) {
    existingSelector.remove();
  }

  // Determine conversion type instantly
  let conversionType = 'unknown';

  if (isTimeWithTimezone(selectedText)) {
    conversionType = 'time';
  } else if (isCurrency(selectedText)) {
    conversionType = 'currency';
    // If currency is highlighted and no preference set, show currency selector first
    if (!cachedPreferredCurrency) {
      showCurrencySelector();
      return;
    }
  } else {
    return; // Not a recognized format
  }

  // Calculate the conversion result BEFORE showing popup (no loading state needed!)
  let conversionResult = null;
  
  if (conversionType === 'time') {
    conversionResult = convertTime(selectedText);
  } else if (conversionType === 'currency') {
    conversionResult = convertCurrency(selectedText);
  }

  // Don't show popup if conversion failed
  if (!conversionResult) {
    return;
  }

  // Get popup position
  const rect = selectionRange.getBoundingClientRect();
  const popupX = rect.left + window.scrollX;
  const popupY = rect.top + window.scrollY - 60;

  // Create popup element with result already calculated
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
        <div class="converted-text">${escapeHtml(conversionResult)}</div>
      </div>
      <div class="popup-footer">
        <button class="copy-btn">Copy Result</button>
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

  // Setup copy button with the already-calculated result
  updateCopyButton(popup, conversionResult);

  // Remove popup on next selection
  document.addEventListener('mousedown', function removePopupOnClick() {
    popup.remove();
    document.removeEventListener('mousedown', removePopupOnClick);
  }, { once: true });
}

// List of popular currencies to show in selector
const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN',
  'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'BRL', 'ZAR', 'NZD', 'SEK'
];

function showCurrencySelector() {
  // Get popup position near the selected text
  const rect = selectionRange.getBoundingClientRect();
  const selectorX = rect.left + window.scrollX;
  const selectorY = rect.top + window.scrollY - 60;

  // Create currency selector modal
  const modal = document.createElement('div');
  modal.id = 'currency-selector-modal';
  modal.style.cssText = `
    position: fixed;
    left: ${selectorX}px;
    top: ${selectorY}px;
    z-index: 10001;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(200, 200, 200, 0.5);
    padding: 12px;
    min-width: 220px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-height: 400px;
    overflow-y: auto;
  `;

  // Add title
  const title = document.createElement('div');
  title.style.cssText = `
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 10px;
    color: #333;
  `;
  title.textContent = 'Convert to:';
  modal.appendChild(title);

  // Create currency buttons
  POPULAR_CURRENCIES.forEach(currency => {
    const btn = document.createElement('button');
    btn.textContent = currency;
    btn.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px 12px;
      margin-bottom: 6px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
      transition: all 0.2s ease;
    `;

    btn.onmouseover = () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
    };

    btn.onmouseout = () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = 'none';
    };

    btn.onclick = () => {
      // Save selected currency
      chrome.storage.sync.set({ preferredCurrency: currency }, () => {
        cachedPreferredCurrency = currency;
        modal.remove();
        // Show conversion popup with selected currency
        showConversionPopup();
      });
    };

    modal.appendChild(btn);
  });

  document.body.appendChild(modal);

  // Close selector when clicking elsewhere
  document.addEventListener('mousedown', function closeSelectorOnClick(e) {
    if (!modal.contains(e.target) && e.target !== selectionRange.commonAncestorContainer) {
      modal.remove();
      document.removeEventListener('mousedown', closeSelectorOnClick);
    }
  });
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

// Map currency symbols to codes
const CURRENCY_SYMBOL_MAP = {
  '$': 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  '₹': 'INR',
  '₽': 'RUB',
  '₩': 'KRW',
  '₪': 'ILS',
  '₨': 'PKR',
  '₱': 'PHP',
  '₡': 'CRC',
  '₦': 'NGN',
  '₲': 'PYG',
  '₴': 'UAH',
  '₵': 'GHS',
  '₸': 'UAH',
  '₺': 'TRY',
  '₼': 'AZN',
  '₾': 'GEL',
  '￠': 'USD',
  '￡': 'GBP',
  '￥': 'CNY',
  '￦': 'KRW'
};

// Helper function to detect system currency from locale
function getSystemCurrency() {
  try {
    const formatter = new Intl.NumberFormat(undefined, { style: 'currency' });
    return formatter.resolvedOptions().currency || 'USD';
  } catch (e) {
    console.error('Failed to detect system currency:', e);
    return 'USD';
  }
}

// Extract source currency code from text
function extractSourceCurrency(currencyText) {
  // Try to match 3-letter currency code first (e.g., USD, EUR, GBP)
  const codeMatch = currencyText.match(/\b([A-Z]{3})\b/i);
  if (codeMatch) {
    return codeMatch[1].toUpperCase();
  }
  
  // Try to match currency symbol
  const symbolMatch = currencyText.match(/[$£€¥₹₽₩₪₨₱₡₦₲₴₵₸₺₼₾￠￡￥￦]/);
  if (symbolMatch) {
    return CURRENCY_SYMBOL_MAP[symbolMatch[0]] || 'USD';
  }
  
  // Default to USD if no currency detected
  return 'USD';
}

// Perform currency conversion using locally cached rates (instant, no latency!)
function convertCurrencyLocally(amount, sourceCurrency, targetCurrency) {
  const rates = cachedExchangeRates || FALLBACK_RATES;
  
  if (!rates[sourceCurrency] || !rates[targetCurrency]) {
    return null;
  }
  
  // Convert from source currency to USD first, then to target currency
  // Formula: amount_in_target = (amount / source_rate) * target_rate
  // Simplified: amount * (target_rate / source_rate)
  const convertedAmount = (amount * rates[targetCurrency] / rates[sourceCurrency]).toFixed(2);
  return convertedAmount;
}

function convertCurrency(currencyText) {
  // Use cached preference or auto-detect system currency
  const targetCurrency = cachedPreferredCurrency || getSystemCurrency();
  
  try {
    // Extract source currency from text
    const sourceCurrency = extractSourceCurrency(currencyText);
    
    // Extract amount
    const amountMatch = currencyText.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    
    // Convert using locally cached rates with proper source/target currency
    const result = convertCurrencyLocally(amount, sourceCurrency, targetCurrency);
    
    if (result) {
      return `${result} ${targetCurrency}`;
    }
    return null;
  } catch (e) {
    console.error('Currency conversion error:', e);
    return null;
  }
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
