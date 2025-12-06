# Getting Started - Visual Guide

## 🎯 5-Minute Installation

### Step 1: Open Extensions Page
```
Chrome Address Bar:  chrome://extensions
                     ↓
                  Press Enter
```

**What you'll see:**
- Extension management page
- List of installed extensions
- "Developer mode" toggle (top-right)

---

### Step 2: Enable Developer Mode
```
Top-Right Corner:  [Developer mode] ← Toggle this
                         ↓
                    Should turn BLUE
```

**What happens:**
- New button appears: "Load unpacked"
- You can now install custom extensions

---

### Step 3: Load the Extension
```
Click:    "Load unpacked" button
         ↓
File picker opens
         ↓
Navigate to: C:\Users\[YourUsername]\Documents\GitHub\browser converter
         ↓
Click: "Open" or "Select Folder"
```

**What to look for:**
```
browser converter/
├── manifest.json        ← Main file
├── content.js
├── background.js
├── popup.html
├── options.html
└── ... (other files)
```

---

### Step 4: Verify Installation
```
Looking for:

✅ Extension appears in list
✅ Icon appears in toolbar
✅ No red error messages
✅ Status shows "Enabled"
```

**What the icon looks like:**
- Small purple/gradient square
- Should be in top-right toolbar area
- Click to see popup menu

---

### Step 5: Configure Settings
```
Click Extension Icon → "Open Settings"
         ↓
    Settings Page Opens
         ↓
Select Timezone: [Dropdown ▼]
Select Currency:  [Dropdown ▼]
         ↓
Click: "Save Settings"
         ↓
✅ Done!
```

---

## 🧪 Test It Out

### Test 1: Timezone Conversion
```
1. Go to: Any website (Google, Wikipedia, News site, etc.)

2. Find or select this text: 3:30 PM EST

3. Expected Result:
   ┌─────────────────────────────┐
   │ ⏰ TIMEZONE                 │
   │ 3:30 PM EST    →    [Your TZ] │
   │ [Copy Result] [×]          │
   └─────────────────────────────┘

4. Click "Copy Result" to copy the conversion
```

### Test 2: Currency Conversion
```
1. Go to: Any website with prices

2. Find or select: $100 USD

3. Expected Result:
   ┌──────────────────────────────┐
   │ 💱 CURRENCY                  │
   │ $100 USD    →    92.50 EUR   │
   │ [Copy Result] [×]           │
   └──────────────────────────────┘

4. Click "Copy Result" to copy: 92.50 EUR
```

---

## 📍 Key Features Overview

### Popup Interface
```
When you highlight text:

┌──────────────────────────────────┐
│ 🎯 TIMEZONE    ┌─────┐           │
│ 3:30 PM EST    │ ✕   │  Close    │
│      ↓                           │
│ 12:30 PM (America/Los_Angeles)   │
│                                  │
│ ┌─────────────────────────────┐  │
│ │   Copy Result               │  │
│ └─────────────────────────────┘  │
└──────────────────────────────────┘

Features:
✓ Shows original text
✓ Shows converted result
✓ Copy button (one-click)
✓ Close button (X)
✓ Auto-closes on next selection
```

### Settings Page
```
Settings → Open Settings

┌──────────────────────────────────────┐
│  📝 Text Converter Pro               │
│  Configure your conversion settings  │
├──────────────────────────────────────┤
│                                      │
│  ⏰ TIMEZONE SETTINGS                │
│  ┌────────────────────────────────┐  │
│  │ Select Timezone:  [America/...▼│  │
│  │ Current System TZ: [Your TZ]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  💱 CURRENCY SETTINGS                │
│  ┌────────────────────────────────┐  │
│  │ Select Currency:  [USD        ▼│  │
│  │ [Update Now] [Save Settings]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  📝 HOW IT WORKS                    │
│  • Highlight "3:30 PM EST"         │
│  • Popup shows conversion          │
│  • Click Copy to save              │
│                                      │
├──────────────────────────────────────┤
│  [Save Settings]  [Reset]            │
└──────────────────────────────────────┘
```

---

## 🗂️ File Structure Reference

```
Your folder location:
C:\Users\[YourUsername]\Documents\GitHub\browser converter

Files you should see:

📁 browser converter/
├── 📄 manifest.json          ← Extension config (don't edit)
├── 📜 content.js            ← Highlights detection
├── 🎨 content.css           ← Popup styling
├── ⚙️  background.js         ← API handling
├── 🖼️  popup.html           ← Popup menu
├── 📝 popup.js              ← Popup functionality
├── 🎨 popup.css             ← Popup styling
├── ⚙️  options.html         ← Settings page
├── 📝 options.js            ← Settings logic
├── 🎨 options.css           ← Settings styling
├── 📖 README.md             ← Full documentation
├── 📖 SETUP_GUIDE.md        ← Setup help
├── 📖 QUICK_REFERENCE.md    ← Quick help
├── 📖 PROJECT_SUMMARY.md    ← Technical info
├── 📖 COMPLETION_REPORT.md  ← What was built
└── 📁 icons/               ← Extension icons
    └── 📄 ICON_GUIDE.md    ← How to create icons
```

---

## 🔧 Common Actions

### Change Your Timezone
```
1. Click extension icon
2. Click "Open Settings"
3. Dropdown: "Preferred Timezone"
4. Select from list (50+ options)
5. Click "Save Settings"
6. ✅ Future conversions use new timezone
```

### Change Your Currency
```
1. Click extension icon
2. Click "Open Settings"
3. Dropdown: "Preferred Currency"
4. Select from list (30+ options)
5. Click "Update Now" (for latest rates)
6. Click "Save Settings"
7. ✅ Future conversions use new currency
```

### Update Exchange Rates
```
1. Open Settings
2. Currency section
3. Click "Update Now"
4. Wait 1-2 seconds
5. ✅ Latest rates loaded
```

### Reset to Defaults
```
1. Open Settings
2. Scroll to bottom
3. Click "Reset to Defaults"
4. Confirm in dialog
5. ✅ Reset complete
```

---

## ❓ Troubleshooting Visual

### Problem: No popup appears when highlighting text

```
Checklist:

1. Verify text format
   ❌ "The time is 3pm"           (too vague)
   ✅ "The time is 3:30 PM EST"   (correct)
   
   ❌ "It costs a lot"             (too vague)
   ✅ "It costs $100 USD"          (correct)

2. Check extension is enabled
   Go to: chrome://extensions
   Look for: "Text Converter Pro"
   Make sure: Blue toggle ON

3. Reload the page
   Press: Ctrl+R
   Try: Highlighting again

4. Check browser console
   Press: F12
   Tab: "Console"
   Look for: Red error messages
```

### Problem: Settings won't save

```
Solution steps:

1. Clear browser cache
   Menu → Settings → Privacy → Clear browsing data

2. Reload extension
   chrome://extensions
   Find extension
   Click refresh icon

3. Try again
   Open Settings
   Make changes
   Click "Save Settings"
```

### Problem: Currency shows old rates

```
Solution:

1. Open Settings
2. Currency section
3. Click "Update Now"
4. Wait for confirmation message
5. Rates should be fresh

If still not working:
- Check internet connection
- Try again in a moment
- Extension may be rate-limited
```

---

## 💡 Pro Tips

### 1. Copy Conversions Easily
```
Select text → Popup appears → Click "Copy" → Paste anywhere
```

### 2. Works on Most Websites
```
News sites, shopping sites, forums, social media, emails, etc.
Works anywhere with selectable text
```

### 3. Multiple Conversions
```
Limitation: Only one conversion per highlight

To convert multiple times:
1. Highlight text A → See popup
2. Press Escape (or click X)
3. Highlight text B → See new popup
```

### 4. Set to Local Timezone
```
When setting timezone:
- Go to Settings
- Current system timezone shown
- Select it from dropdown
- All conversions to local time
```

---

## 📱 Supported Browsers

| Browser | Support | How to Install |
|---------|---------|---|
| Chrome | ✅ Full | `chrome://extensions` |
| Edge | ✅ Full | `edge://extensions` |
| Brave | ✅ Full | Click menu → Extensions |
| Opera | ✅ Full | `opera://extensions` |
| Firefox | ⚠️ Limited | Requires Manifest v2 version |

---

## 🎨 Visual Examples

### Example 1: Time Zone Conversion
```
Website text:  "Meeting at 3:30 PM EST tomorrow"

User highlights: 3:30 PM EST

Popup shows:
┌──────────────────────────────────┐
│ ⏰ TIMEZONE                       │
│ 3:30 PM EST  →  12:30 PM PST    │
│ (America/Los_Angeles)            │
│ [Copy Result] [×]                │
└──────────────────────────────────┘

User clicks: Copy Result
Result copied: "12:30 PM (America/Los_Angeles)"
```

### Example 2: Currency Conversion
```
Website text:  "Special price: $100 USD - Limited time!"

User highlights: $100 USD

Popup shows:
┌──────────────────────────────────┐
│ 💱 CURRENCY                      │
│ $100 USD  →  €92.50              │
│ [Copy Result] [×]                │
└──────────────────────────────────┘

User clicks: Copy Result
Result copied: "92.50 EUR"
```

---

## ✅ Verification Checklist

After installation, verify everything works:

```
Installation:
☐ Extension appears in chrome://extensions
☐ Extension icon visible in toolbar
☐ No error messages shown

Settings:
☐ Can open Settings page
☐ Timezones load in dropdown
☐ Currencies load in dropdown
☐ Can select and save preferences
☐ Settings persist after refresh

Testing:
☐ Can highlight time text (e.g., "3:30 PM EST")
☐ Popup appears above selection
☐ Timezone conversion shown
☐ Can highlight currency (e.g., "$100")
☐ Currency conversion shown
☐ Copy button works
☐ Close button works
☐ Works on different websites

Everything checked? ✅ Ready to use!
```

---

## 🚀 Quick Access Links

**In Chrome:**
- `chrome://extensions` - Extension management
- `chrome://extension-shortcut-ui` - Keyboard shortcuts

**In Edge:**
- `edge://extensions` - Extension management

**Documentation:**
1. README.md - Full features guide
2. SETUP_GUIDE.md - Detailed setup
3. QUICK_REFERENCE.md - Fast lookup
4. PROJECT_SUMMARY.md - Technical details

---

## 🎉 You're All Set!

You now have a fully functional browser extension that can:

✨ Detect highlighted text  
🎨 Show beautiful popup conversions  
⏰ Convert timezones  
💱 Convert currencies  
⚙️ Customize settings  
📋 Copy results to clipboard  
🔄 Update exchange rates  
💾 Save preferences  

**Start converting text today!**

---

**Questions?** Check the documentation files or QUICK_REFERENCE.md

**Ready to use?** Go to `chrome://extensions` and load the unpacked extension!

🚀 Happy Converting!
