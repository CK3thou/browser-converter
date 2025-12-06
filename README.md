# Text Converter Pro - Browser Extension

A powerful Chromium-based browser extension that enables instant conversion of highlighted text on webpages. Convert timezones and currencies with a simple highlight!

## Features

✨ **Instant Conversions** - Highlight text and see results immediately in a beautiful popup
⏰ **Timezone Conversion** - Automatically detects and converts times between different timezones
💱 **Currency Exchange** - Real-time currency conversion using live exchange rates
⚙️ **Customizable** - Set your preferred timezone and currency in settings
🚀 **Fast & Lightweight** - No page slowdown, works on any website

## Supported Conversions

### Timezone Format
- Times with timezone indicators: `3:30 PM EST`, `14:45 GMT`, `10:15 AM IST`
- Automatic conversion to your selected timezone
- Shows original and converted times with timezone info

### Currency Format
- Currency symbols: `$100`, `€50`, `£25`, `¥1000`
- Currency codes: `100 USD`, `50 EUR`, `25 GBP`
- Real-time exchange rates updated hourly
- Converts to your selected currency

## Installation

### Option 1: Developer Mode (Recommended for Testing)

1. **Clone or Extract Files**
   - Clone this repository or extract the files to a folder
   - Location: `c:\Users\[YourUsername]\Documents\GitHub\browser converter`

2. **Open Chrome/Chromium**
   - Open your Chromium-based browser (Chrome, Edge, Brave, etc.)
   - Go to: `chrome://extensions/` (or `edge://extensions/` for Edge)

3. **Enable Developer Mode**
   - Toggle "Developer mode" switch in the top-right corner

4. **Load Unpacked Extension**
   - Click "Load unpacked"
   - Navigate to the folder with the extension files
   - Select the folder and click "Open"

5. **Verify Installation**
   - The extension should appear in your extensions list
   - You should see the extension icon in your toolbar

### Option 2: Package as .crx (For Distribution)

```bash
# Use Chrome's extension packaging
# In Chrome: Extensions > Details > Pack Extension
# Select the extension folder
```

## Usage

### Basic Workflow

1. **Navigate to any webpage**
   - Works on virtually all websites

2. **Highlight text** containing:
   - **Time with timezone**: `3:30 PM EST`, `14:45 UTC`, `10:15 AM IST`
   - **Currency amount**: `$100 USD`, `€50`, `£25`, `100 JPY`

3. **View conversion popup**
   - A beautiful popup appears above the selected text
   - Shows original → converted values
   - Click "Copy Result" to copy the conversion
   - Click × to close the popup

### Examples

**Timezone Conversion:**
```
Original: 3:30 PM EST
↓
Converted: 12:30 PM PST (America/Los_Angeles)
```

**Currency Conversion:**
```
Original: $100 USD
↓
Converted: 92.50 EUR (Euro)
```

## Settings

### Opening Settings

1. Click the extension icon in your toolbar
2. Click "Open Settings" button
3. Or right-click the extension icon and select "Options"

### Configure Timezone

1. Go to Settings → Timezone Settings
2. Select your preferred timezone from the dropdown
3. Current system timezone is displayed for reference
4. Click "Save Settings"

### Configure Currency

1. Go to Settings → Currency Settings
2. Select your preferred currency from the dropdown
3. All currency conversions will use this as the target
4. Click "Update Now" to refresh exchange rates
5. Click "Save Settings"

## File Structure

```
browser converter/
├── manifest.json          # Extension configuration
├── content.js            # Content script for webpage interaction
├── content.css           # Styles for popup overlay
├── background.js         # Background service worker
├── popup.html            # Extension popup UI
├── popup.js              # Popup script
├── popup.css             # Popup styles
├── options.html          # Settings page
├── options.js            # Settings script
├── options.css           # Settings styles
└── README.md             # This file
```

## Technical Details

### Content Script (content.js)
- Detects text selection on webpages
- Analyzes selected text for time and currency patterns
- Displays conversion popup at cursor position
- Handles copy-to-clipboard functionality

### Background Service Worker (background.js)
- Manages exchange rate API calls
- Caches currency rates for 1 hour
- Provides conversion calculations
- Stores user preferences

### Exchange Rate API
- Uses: `forexrateapi.com` (with provided credentials)
- API Key: `1e5ce0b6f7f9b60ffeb7b5f60dcf095d`
- User: `chishimba.kabwe@gmail.com`
- Supports 160+ currencies globally
- Updates hourly with automatic caching
- Fallback rates included if API is unavailable

### Storage
- Uses Chrome's `storage.sync` API
- Settings sync across devices if user is logged in
- Caches exchange rates locally

## Supported Currencies

**Total: 160+ Global Currencies** via forexrateapi.com

**Major Currencies (20):** USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, INR, MXN, SGD, HKD, NOK, KRW, TRY, RUB, BRL, ZAR, NZD, SEK

**Additional Currencies (140+):** AED, AFN, ALL, AMD, ANG, AOA, ARS, AWG, AZN, BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND, BOB, BSD, BTN, BWP, BYN, BZD, CDF, CLP, COP, CRC, CUC, CUP, CVE, CZK, DJF, DKK, DOP, DZD, EGP, ERN, ETB, FJD, FKP, GEL, GHS, GIP, GMD, GNF, GTQ, GYD, HNL, HRK, HTG, HUF, IDR, ILS, IQD, IRR, ISK, JMD, JOD, KES, KGS, KHR, KMF, KPW, KWD, KYD, KZT, LAK, LBP, LKR, LRD, LSL, LYD, MAD, MDL, MGA, MKD, MMK, MNT, MOP, MRU, MUR, MVR, MWK, MYR, MZN, NAD, NGN, NIO, NPR, OMR, PAB, PEN, PGK, PHP, PKR, PLN, PYG, QAR, RON, RSD, RWF, SAR, SBD, SCR, SDG, SHP, SLL, SOS, SRD, SSP, STN, SVC, SYP, SZL, THB, TJS, TMT, TND, TOP, TTD, TWD, TZS, UAH, UGX, UYU, UZS, VES, VND, VUV, WST, XAF, XCD, XOF, XPF, YER, ZMW, ZWL

## Supported Timezones

**Americas:** New York, Chicago, Denver, Los Angeles, Toronto, Mexico City, Buenos Aires, São Paulo, Anchorage, Honolulu
**Europe:** London, Paris, Berlin, Madrid, Rome, Istanbul, Moscow, Dublin, Lisbon, and more
**Asia:** Dubai, Kolkata, Bangkok, Hong Kong, Shanghai, Tokyo, Seoul, Singapore, Jakarta, Manila, and more
**Africa:** Cairo, Johannesburg, Lagos, Nairobi, Casablanca, Accra
**Oceania:** Sydney, Melbourne, Brisbane, Perth, Auckland, Fiji

## Permissions Explained

- `activeTab`: Access the current tab to inject scripts
- `scripting`: Inject content scripts into webpages
- `storage`: Save user preferences
- `clipboardRead/Write`: Handle copy-to-clipboard
- `<all_urls>`: Work on any website

## Troubleshooting

### Popup not appearing
- Ensure the text format matches supported patterns
- Check browser console (F12) for errors
- Verify extension is enabled in `chrome://extensions`

### Currency conversions not working
- Check your internet connection
- Click "Update Now" in settings to refresh rates
- Check if currency is in the supported list

### Settings not saving
- Clear browser cache
- Ensure you're logged into Chrome/Chromium
- Disable conflicting extensions

### Extension not loading
- Check manifest.json for syntax errors
- Ensure all referenced files exist
- Try removing and re-adding the extension

## Privacy & Security

✅ **No tracking** - We don't track your usage
✅ **No ads** - Clean, ad-free experience
✅ **No personal data** - Only stores your preferences locally
✅ **Open source** - Code is transparent and auditable
⚠️ **API calls** - Exchange rate API calls are made to exchangerate-api.com

## Future Enhancements

- [ ] Support for more conversion types (units, temperatures)
- [ ] Multiple timezone conversions in one popup
- [ ] Custom regex patterns for detection
- [ ] Offline mode with cached rates
- [ ] Dark mode for popup
- [ ] More languages support
- [ ] Historical exchange rates

## Known Limitations

- Timezone conversions use today's date (historical times not supported)
- Requires active internet for exchange rates (fallback rates available)
- Works only with highlighted text (not automatic scanning)
- Some websites may have content security policies that prevent injection

## Browser Support

- ✅ Chrome (100+)
- ✅ Edge (100+)
- ✅ Brave
- ✅ Opera
- ⚠️ Firefox (requires manifest v2 version)

## Development

### Testing the Extension

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the extension folder
4. Make changes to files
5. Click refresh icon to reload the extension

### Debugging

1. Right-click extension icon → "Inspect popup" for popup debugging
2. Right-click page → "Inspect" → "Console" tab for content script debugging
3. Go to `chrome://extensions` → "Service Worker" link to debug background script

## Credits

- Exchange rates provided by [exchangerate-api.com](https://exchangerate-api.com)
- Timezone data from [IANA Time Zone Database](https://www.iana.org/time-zones)
- Built with Chromium Extensions API

## License

MIT License - Feel free to use, modify, and distribute

## Support

Found a bug or have a suggestion? 
- Open an issue on GitHub
- Leave feedback in Chrome Web Store
- Check the troubleshooting section above

## Changelog

### v1.0.0 (Initial Release)
- ✨ Text highlighting and detection
- 🕐 Timezone conversion support
- 💱 Currency conversion with live rates
- ⚙️ Customizable settings page
- 📋 Beautiful popup UI
- 💾 Preference persistence

---

**Happy Converting!** 🚀

Enjoy instant conversions right in your browser. Highlight, convert, and copy—it's that easy!
