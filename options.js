// Options page script

const TIMEZONES = [
  // Americas
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Anchorage', 'Pacific/Honolulu', 'America/Toronto', 'America/Mexico_City',
  'America/Buenos_Aires', 'America/Sao_Paulo',
  
  // Europe
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Amsterdam',
  'Europe/Madrid', 'Europe/Rome', 'Europe/Vienna', 'Europe/Prague',
  'Europe/Warsaw', 'Europe/Athens', 'Europe/Istanbul', 'Europe/Moscow',
  'Europe/Dublin', 'Europe/Lisbon',
  
  // Africa
  'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi',
  'Africa/Casablanca', 'Africa/Accra',
  
  // Asia
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok', 'Asia/Hong_Kong',
  'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Singapore',
  'Asia/Jakarta', 'Asia/Manila', 'Asia/Bangkok', 'Asia/Karachi',
  'Asia/Tehran', 'Asia/Baghdad', 'Asia/Jerusalem',
  
  // Oceania
  'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane',
  'Australia/Perth', 'Pacific/Auckland', 'Pacific/Fiji'
];

const CURRENCIES = [
  // Major currencies
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN',
  'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB', 'BRL', 'ZAR', 'NZD', 'SEK',
  // Additional popular currencies
  'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AWG', 'AZN', 'BAM',
  'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BSD', 'BTN',
  'BWP', 'BYN', 'BZD', 'CDF', 'CLP', 'COP', 'CRC', 'CUC', 'CUP', 'CVE',
  'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'FJD', 'FKP',
  'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HNL', 'HRK', 'HTG',
  'HUF', 'IDR', 'ILS', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'KES', 'KGS',
  'KHR', 'KMF', 'KPW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD',
  'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU',
  'MUR', 'MVR', 'MWK', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NPR', 'OMR',
  'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD',
  'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP',
  'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TTD',
  'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST',
  'XAF', 'XCD', 'XOF', 'XPF', 'YER', 'ZMW', 'ZWL'
];

const timezoneSelect = document.getElementById('timezone-select');
const currencySelect = document.getElementById('currency-select');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const updateRatesBtn = document.getElementById('update-rates-btn');
const statusMessage = document.getElementById('status-message');
const currentTimezoneDisplay = document.getElementById('current-timezone');
const apiKeyInput = document.getElementById('api-key-input');
const showApiKeyCheckbox = document.getElementById('show-api-key');

// Calculate GMT offset for a timezone
function getGMTOffset(timezone) {
  try {
    // Create a date in the specified timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    const hour = parts.find(p => p.type === 'hour').value;
    const minute = parts.find(p => p.type === 'minute').value;
    const second = parts.find(p => p.type === 'second').value;

    // Create date in target timezone
    const tzDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
    
    // Get current UTC time
    const now = new Date();
    
    // Calculate offset in hours
    const diffMs = tzDate - now;
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    
    // Format the offset
    const sign = diffHours >= 0 ? '+' : '';
    return `${sign}${diffHours}`;
  } catch (e) {
    return '±0';
  }
}

// Populate selects
function initializeSelects() {
  // Populate timezones
  timezoneSelect.innerHTML = '';
  TIMEZONES.forEach(tz => {
    const option = document.createElement('option');
    option.value = tz;
    const displayName = tz.replace(/_/g, ' ');
    const gmtOffset = getGMTOffset(tz);
    option.textContent = `${displayName} (GMT${gmtOffset})`;
    timezoneSelect.appendChild(option);
  });

  // Populate currencies
  currencySelect.innerHTML = '';
  CURRENCIES.forEach(curr => {
    const option = document.createElement('option');
    option.value = curr;
    option.textContent = curr;
    currencySelect.appendChild(option);
  });

  // Load saved settings
  loadSettings();
}

function loadSettings() {
  chrome.storage.sync.get(['preferredTimezone', 'preferredCurrency', 'forexApiKey'], (result) => {
    const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezone = result.preferredTimezone || systemTimezone;
    const currency = result.preferredCurrency || '';
    const apiKey = result.forexApiKey || '';

    timezoneSelect.value = timezone;
    currencySelect.value = currency;
    apiKeyInput.value = apiKey;
    currentTimezoneDisplay.textContent = systemTimezone;
    
    // Check if this is first-time setup (no preferred currency set)
    if (!currency) {
      showOnboardingPrompt();
    }
  });
}

function showOnboardingPrompt() {
  // Show a special message for first-time users
  const onboardingDiv = document.createElement('div');
  onboardingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  onboardingDiv.innerHTML = `
    <div style="
      background: white;
      padding: 40px;
      border-radius: 12px;
      max-width: 500px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    ">
      <h2 style="margin-bottom: 10px; color: #333;">Welcome to Text Converter Pro! 👋</h2>
      <p style="margin-bottom: 30px; color: #666; font-size: 16px;">
        Which currency would you like conversions to be in?
      </p>
      <p style="margin-bottom: 20px; color: #999; font-size: 14px;">
        (You can change this anytime in settings)
      </p>
      <button id="onboarding-close" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
      ">Got it! Let me select below</button>
    </div>
  `;
  
  document.body.appendChild(onboardingDiv);
  
  document.getElementById('onboarding-close').addEventListener('click', () => {
    onboardingDiv.remove();
    currencySelect.focus();
  });
}

function saveSettings() {
  const timezone = timezoneSelect.value;
  const currency = currencySelect.value;
  const apiKey = apiKeyInput.value.trim();

  if (!currency) {
    showStatus('✗ Please select a currency', 'error');
    return;
  }

  if (!apiKey) {
    showStatus('✗ API key cannot be empty', 'error');
    return;
  }

  chrome.storage.sync.set({
    preferredTimezone: timezone,
    preferredCurrency: currency,
    forexApiKey: apiKey
  }, () => {
    showStatus('✓ Settings saved securely!', 'success');
    setTimeout(() => {
      statusMessage.textContent = '';
    }, 3000);
  });
}

function resetSettings() {
  if (confirm('Reset all settings to defaults?')) {
    const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    chrome.storage.sync.set({
      preferredTimezone: systemTimezone,
      preferredCurrency: 'USD'
    }, () => {
      loadSettings();
      showStatus('✓ Settings reset to defaults!', 'success');
      setTimeout(() => {
        statusMessage.textContent = '';
      }, 3000);
    });
  }
}

function updateRates() {
  updateRatesBtn.textContent = 'Updating...';
  updateRatesBtn.disabled = true;

  // Clear cache to force update
  chrome.storage.local.set({ exchange_rates_cache: null }, () => {
    // Send message to background script to fetch new rates
    chrome.runtime.sendMessage(
      { action: 'convertCurrency', amount: 1, preferredCurrency: 'USD' },
      (response) => {
        updateRatesBtn.textContent = 'Update Now';
        updateRatesBtn.disabled = false;
        
        if (response.success) {
          showStatus('✓ Exchange rates updated!', 'success');
        } else {
          showStatus('✗ Failed to update rates', 'error');
        }
        
        setTimeout(() => {
          statusMessage.textContent = '';
        }, 3000);
      }
    );
  });
}

function showStatus(message, type) {
  statusMessage.textContent = message;

// Toggle API key visibility
showApiKeyCheckbox.addEventListener('change', () => {
  if (showApiKeyCheckbox.checked) {
    apiKeyInput.type = 'text';
  } else {
    apiKeyInput.type = 'password';
  }
});
  statusMessage.className = `status-message ${type}`;
}

// Event listeners
saveBtn.addEventListener('click', saveSettings);
resetBtn.addEventListener('click', resetSettings);
updateRatesBtn.addEventListener('click', updateRates);

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeSelects);
