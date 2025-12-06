# Forex Rate API Configuration

## Overview
This extension now uses **forexrateapi.com** for real-time currency exchange rates with comprehensive global currency support.

## API Details

### Service Provider
- **API Name:** Forex Rate API
- **Website:** https://forexrateapi.com
- **Base URL:** https://api.forexrateapi.com/v1/latest

### Authentication
- **Email/Username:** chishimba.kabwe@gmail.com
- **API Key:** `1e5ce0b6f7f9b60ffeb7b5f60dcf095d`

### API Endpoint
```
https://api.forexrateapi.com/v1/latest?api_key=YOUR_KEY&base=USD&currencies=CURRENCY_LIST
```

### Example Request
```
https://api.forexrateapi.com/v1/latest
?api_key=1e5ce0b6f7f9b60ffeb7b5f60dcf095d
&base=USD
&currencies=EUR,GBP,JPY,AUD,CAD,CHF,CNY,INR,MXN
```

### Response Format
```json
{
  "success": true,
  "base": "USD",
  "date": "2024-12-06",
  "rates": {
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 149.5,
    "AUD": 1.53,
    ...
  }
}
```

## Supported Currencies

The extension now supports **160+ currencies** from the forexrateapi.com API:

### Major Currencies (20)
USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR, MXN, SGD, HKD, NOK, KRW, TRY, RUB, BRL, ZAR, NZD, SEK

### Additional Currencies (140+)
AED, AFN, ALL, AMD, ANG, AOA, ARS, AWG, AZN, BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND, BOB, BSD, BTN, BWP, BYN, BZD, CDF, CLP, COP, CRC, CUC, CUP, CVE, CZK, DJF, DKK, DOP, DZD, EGP, ERN, ETB, FJD, FKP, GEL, GHS, GIP, GMD, GNF, GTQ, GYD, HNL, HRK, HTG, HUF, IDR, ILS, IQD, IRR, ISK, JMD, JOD, KES, KGS, KHR, KMF, KPW, KWD, KYD, KZT, LAK, LBP, LKR, LRD, LSL, LYD, MAD, MDL, MGA, MKD, MMK, MNT, MOP, MRU, MUR, MVR, MWK, MYR, MZN, NAD, NGN, NIO, NPR, OMR, PAB, PEN, PGK, PHP, PKR, PLN, PYG, QAR, RON, RSD, RWF, SAR, SBD, SCR, SDG, SHP, SLL, SOS, SRD, SSP, STN, SVC, SYP, SZL, THB, TJS, TMT, TND, TOP, TTD, TWD, TZS, UAH, UGX, UYU, UZS, VES, VND, VUV, WST, XAF, XCD, XOF, XPF, YER, ZMW, ZWL

## Features

### Caching
- Exchange rates are cached locally for **1 hour** (3600000 milliseconds)
- Reduces API calls and improves performance
- Automatically updates after cache expires

### Fallback Rates
- If API is unavailable, the extension uses pre-configured fallback rates
- Ensures conversions work offline
- Fallback rates are approximate 2024 rates

### Error Handling
- Gracefully handles API errors
- Falls back to cached rates if available
- Continues functioning with fallback rates if API is down
- Console logging for debugging

## Implementation

### File: background.js
- **Function:** `getExchangeRates()`
  - Checks local cache first
  - Fetches from forexrateapi.com if cache expired
  - Stores results in Chrome local storage
  - Returns fallback rates on error

- **Function:** `convertCurrencyAmount(amount, targetCurrency)`
  - Gets exchange rates
  - Converts USD amount to target currency
  - Returns result with 2 decimal places

### File: options.js
- **Array:** `CURRENCIES`
  - Contains all 160+ supported currency codes
  - Used for currency dropdown in settings page
  - Sorted with major currencies first

## Usage in Extension

### When User Highlights Currency Text

```javascript
// Content script detects: "$100 USD"
chrome.runtime.sendMessage(
  { 
    action: 'convertCurrency', 
    amount: 100, 
    preferredCurrency: 'EUR'
  },
  (response) => {
    if (response.success) {
      // Display: "92.00 EUR"
    }
  }
);
```

### API Call Flow

```
User highlights currency
        ↓
Content script sends message
        ↓
Background worker receives message
        ↓
Gets exchange rates (cached or from API)
        ↓
Converts amount to target currency
        ↓
Returns result to content script
        ↓
Popup displays conversion
```

## Rate Update

### Manual Update
Users can manually update exchange rates in settings:
1. Open Settings
2. Currency Settings section
3. Click "Update Now"
4. Cache clears and new rates are fetched
5. Confirmation message appears

### Automatic Update
- Rates auto-update after 1 hour
- No user action required
- Background worker handles update silently

## Security

### API Key Protection
- API key is stored in background.js
- Only accessible from extension code
- Not exposed in content scripts
- Cannot be accessed from webpage JavaScript

### HTTPS Only
- All API calls use HTTPS
- Encrypted transmission
- Secure connection guaranteed

### Rate Limiting
- Forexrateapi.com has rate limits
- Extension caches for 1 hour to minimize calls
- Respects API service limits

## Troubleshooting

### Issue: Currency conversion not working

**Check:**
1. Internet connection is active
2. API key is valid
3. Forexrateapi.com service is operational
4. Try clicking "Update Now" in settings

**Solution:**
- Extension will use fallback rates
- Manual update after service is back

### Issue: Exchange rates seem outdated

**Check:**
1. Cache may still be valid (1 hour)
2. Click "Update Now" to refresh immediately

**Solution:**
- Fallback rates are built-in
- Service continues working offline

### Issue: Some currencies not showing in dropdown

**Check:**
1. Currency may not be in supported list
2. Check CURRENCIES array in options.js

**Solution:**
- All forexrateapi.com supported currencies are included
- Add additional currencies to CURRENCIES array if needed

## Maintenance

### How to Update API Key

If you need to change the API key:

1. **Edit:** `background.js`
2. **Find:** `const FOREX_API_KEY = '...';`
3. **Replace:** With new API key
4. **Reload:** Extension from `chrome://extensions`

### How to Add More Currencies

1. **Add to:** `SUPPORTED_CURRENCIES` array in `background.js`
2. **Add to:** `CURRENCIES` array in `options.js`
3. **Add to:** `FALLBACK_RATES` object (optional fallback)
4. **Reload:** Extension

### How to Change Cache Duration

1. **Edit:** `background.js`
2. **Find:** `const CACHE_DURATION = 3600000;`
3. **Change:** Value (in milliseconds)
   - 1800000 = 30 minutes
   - 3600000 = 1 hour (default)
   - 7200000 = 2 hours

## API Rate Limits

- **Free Plan:** Check forexrateapi.com pricing
- **Cache Strategy:** Extension caches for 1 hour to reduce calls
- **Best Practice:** Only fetch when cache expires

## References

- **API Documentation:** https://forexrateapi.com/docs
- **Supported Currencies:** https://forexrateapi.com/docs/supported-currencies
- **Rate Limits:** Check your plan on forexrateapi.com

---

**Last Updated:** December 6, 2025  
**API Version:** v1  
**Extension Version:** 1.0.0  
**Status:** ✅ Active and Operational
