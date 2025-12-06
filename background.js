// Background Service Worker

const FOREX_API_KEY = '1e5ce0b6f7f9b60ffeb7b5f60dcf095d';
const FOREX_API_URL = 'https://api.forexrateapi.com/v1/latest';
const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// All supported currencies from the API
const SUPPORTED_CURRENCIES = [
  'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
  'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL',
  'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY',
  'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD',
  'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP',
  'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR',
  'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS',
  'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR',
  'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP',
  'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO',
  'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN',
  'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG',
  'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP',
  'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS',
  'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF',
  'XCD', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL'
];

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'convertCurrency') {
    convertCurrencyAmount(request.amount, request.preferredCurrency)
      .then(result => {
        sendResponse({ success: true, result });
      })
      .catch(error => {
        console.error('Currency conversion error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }
});

async function convertCurrencyAmount(amount, targetCurrency) {
  try {
    // Get current rates from cache or API
    const rates = await getExchangeRates();
    
    if (!rates[targetCurrency]) {
      throw new Error(`Currency ${targetCurrency} not supported`);
    }

    // Convert from USD to target currency
    const convertedAmount = (amount * rates[targetCurrency]).toFixed(2);
    return convertedAmount;
  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  }
}

async function getExchangeRates() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([CACHE_KEY], (result) => {
      const cached = result[CACHE_KEY];
      
      // Check if cache exists and is still valid
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        resolve(cached.rates);
        return;
      }

      // Build currency list parameter
      const currencyParam = SUPPORTED_CURRENCIES.join(',');

      // Fetch fresh rates from Forex Rate API
      const apiUrl = `${FOREX_API_URL}?api_key=${FOREX_API_KEY}&base=USD&currencies=${encodeURIComponent(currencyParam)}`;
      
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data.success === false) {
            throw new Error(data.error || 'API Error');
          }
          
          const rates = data.rates || {};
          const cacheData = {
            rates,
            timestamp: Date.now()
          };

          // Save to cache
          chrome.storage.local.set({ [CACHE_KEY]: cacheData });
          resolve(rates);
        })
        .catch(error => {
          console.error('Failed to fetch rates from forexrateapi.com:', error);
          // Return fallback rates if API fails
          resolve(FALLBACK_RATES);
        });
    });
  });
}

// Fallback rates (if API is unavailable) - Based on approximate 2024 rates
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


// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    preferredTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredCurrency: 'USD'
  });
});
