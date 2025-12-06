# Installation & Setup Guide

## Quick Start (5 minutes)

### Step 1: Verify Files
Ensure you have these files in your `browser converter` folder:
```
✓ manifest.json
✓ content.js
✓ content.css
✓ background.js
✓ popup.html
✓ popup.js
✓ popup.css
✓ options.html
✓ options.js
✓ options.css
✓ README.md
✓ icons/ (folder)
```

### Step 2: Open Extensions Page
1. Open Chrome or Chromium-based browser
2. Click the menu button (⋮) → "More tools" → "Extensions"
   - **Keyboard shortcut:** Press `Ctrl+Shift+M`
   - **Or type in address bar:** `chrome://extensions`

### Step 3: Enable Developer Mode
- In the top-right corner, toggle the "Developer mode" switch to ON
- You should see a blue toggle when it's enabled

### Step 4: Load the Extension
1. Click "Load unpacked" button (top-left)
2. Navigate to: `C:\Users\[YourUsername]\Documents\GitHub\browser converter`
3. Click "Select Folder" or "Open"

### Step 5: Verify Installation
- You should see "Text Converter Pro" in your extensions list
- The extension icon should appear in your toolbar
- No errors should appear in the extension details

**That's it! The extension is ready to use!** 🎉

---

## Detailed Installation Steps

### For Chrome

1. **Access Extension Management**
   - Click ⋮ menu → More tools → Extensions
   - Or visit: `chrome://extensions`

2. **Enable Developer Mode**
   - Look for "Developer mode" toggle in top-right
   - Click to enable (toggle turns blue)

3. **Load Unpacked**
   - Click "Load unpacked" button
   - Browser opens file picker
   - Navigate to extension folder
   - Click "Select Folder"

4. **Check for Errors**
   - If you see errors, check the "Details" link
   - Review console for JavaScript errors
   - Verify all files are present

5. **Test the Extension**
   - Open any webpage
   - Try highlighting some text
   - The popup should appear if text matches patterns

### For Microsoft Edge

1. **Access Extension Management**
   - Click ⋯ menu → Extensions → Manage extensions
   - Or visit: `edge://extensions`

2. **Enable Developer Mode**
   - Toggle "Developer mode" in bottom-left

3. **Load Unpacked**
   - Click "Load unpacked"
   - Select the extension folder
   - Click "Select Folder"

4. **Verify It Works**
   - Reload a webpage
   - Try highlighting currency or time text

### For Brave Browser

1. **Access Extension Management**
   - Click menu ≡ → More tools → Extensions
   - Or visit: `brave://extensions`

2. **Enable Developer Mode**
   - Toggle "Developer mode" (top-right)

3. **Load Unpacked**
   - Click "Load unpacked"
   - Select extension folder

---

## First Time Setup

### 1. Configure Your Preferences

1. **Open Settings**
   - Click the extension icon in toolbar
   - Click "Open Settings" button
   - Or right-click extension → "Options"

2. **Set Your Timezone**
   - Select your timezone from dropdown
   - Current system timezone shows automatically
   - Click "Save Settings"

3. **Set Your Currency**
   - Select your preferred currency from dropdown
   - All conversions will target this currency
   - Click "Update Now" to ensure latest rates
   - Click "Save Settings"

### 2. Test a Conversion

**Test Timezone Conversion:**
1. Go to any website with text
2. Highlight text like: `3:30 PM EST`
3. A popup should appear with conversion to your timezone

**Test Currency Conversion:**
1. Highlight text like: `$100 USD`
2. A popup should appear with conversion to your currency

---

## Creating Extension Icons

The manifest references icons, but they need to be created:

### Simple Solution: Use Placeholder Icons

For testing, you can create simple PNG files:

**Option A: Use Online Generator**
1. Visit: https://www.favicon-generator.org/
2. Design a simple icon
3. Download as 128x128, 48x48, 16x16
4. Save to `icons/` folder:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

**Option B: Create in Paint/Photoshop**
1. Create new image: 128x128 pixels
2. Draw simple design (arrows, currency, clock, text)
3. Add text: "TC" (Text Converter)
4. Use purple gradient background
5. Save as PNG with transparency
6. Resize and save as icon16.png and icon48.png

**Option C: Skip Icons (For Testing)**
The extension will work without icons during testing.

---

## Troubleshooting Installation

### Issue: "Could not load the extension" error

**Solution:**
1. Verify all files are in the correct folder
2. Check manifest.json syntax (no trailing commas)
3. Look at error message for specific issues
4. Remove and reload the extension

### Issue: Extension appears but nothing happens

**Solution:**
1. Refresh the webpage (Ctrl+R)
2. Click extension icon to verify it's enabled
3. Open DevTools: F12 → Console tab
4. Try highlighting text on the page
5. Look for error messages in console

### Issue: "Manifest is invalid" error

**Solution:**
1. Check manifest.json for JSON syntax errors
2. Use JSON validator: https://jsonlint.com/
3. Ensure no trailing commas after last properties
4. Verify all file paths are correct

### Issue: Popup doesn't appear when highlighting text

**Solution:**
1. **Verify the text format:**
   - For time: needs format like "3:30 PM EST" or "14:45 UTC"
   - For currency: needs format like "$100" or "100 USD"
   
2. **Check content script injection:**
   - Right-click page → "Inspect"
   - Look in Console for messages
   - Some websites block content scripts (security policy)

3. **Reload the extension:**
   - Go to chrome://extensions
   - Click refresh icon next to extension
   - Reload the webpage

### Issue: Currency conversion shows wrong rate

**Solution:**
1. Click "Open Settings" → "Update Now"
2. Check internet connection
3. Wait a moment (API rate limiting)
4. Reload webpage and try again

---

## Advanced Setup

### Developing/Modifying the Extension

1. **Edit files in a text editor:**
   - VS Code recommended
   - Sublime Text
   - Notepad++
   - Or any text editor

2. **Reload after changes:**
   - Go to chrome://extensions
   - Click refresh icon next to extension
   - Changes take effect immediately

3. **Debug content script:**
   - Open webpage where extension runs
   - Press F12 to open DevTools
   - Look in Console tab for messages
   - Check Sources tab to set breakpoints

4. **Debug background service worker:**
   - Go to chrome://extensions
   - Find "Text Converter Pro"
   - Under "Service Worker" section
   - Click on the link to debug

### Testing Different Scenarios

```
Test Case 1: Basic Time Conversion
Text: "The meeting is at 3:30 PM EST"
Expected: Popup shows conversion to your timezone

Test Case 2: Currency with Symbol
Text: "The item costs $100 USD"
Expected: Popup shows conversion to your currency

Test Case 3: Currency with Code
Text: "Price is 100 EUR"
Expected: Popup shows conversion

Test Case 4: Multiple Conversions
Text: "Meet at 2:00 PM EST, budget is $50"
Result: Only one converts at a time (highlight separately)

Test Case 5: Settings Persistence
Steps:
1. Set timezone to "Europe/London"
2. Reload page
3. Highlight time
Expected: Uses Europe/London for conversion
```

---

## Uninstalling the Extension

1. Go to `chrome://extensions`
2. Find "Text Converter Pro"
3. Click "Remove" button
4. Confirm removal

Files remain on disk (in your Documents folder), so you can reinstall anytime by clicking "Load unpacked" again.

---

## Next Steps

1. ✅ Install the extension
2. ✅ Configure your timezone and currency
3. ✅ Test on various websites
4. 📖 Read README.md for full feature list
5. 🎨 Customize icons (optional)
6. 📤 Consider submitting to Chrome Web Store (requires account)

---

## Getting Help

**Extension Not Working?**
1. Check browser console (F12)
2. Review troubleshooting section above
3. Verify manifest.json syntax
4. Check extension is enabled

**Need to Modify?**
- Edit any .js, .css, .html file
- Reload extension from chrome://extensions
- Changes apply immediately

**Want to Share?**
- Package as .crx file
- Submit to Chrome Web Store
- Share the folder with others (they follow same setup steps)

---

Happy converting! 🚀

For full feature documentation, see **README.md**
