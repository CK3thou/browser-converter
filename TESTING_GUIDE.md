# 🧪 TEXT CONVERTER PRO - TESTING GUIDE

## QUICK TEST CHECKLIST (5 minutes)

### Step 1: Load Extension (1 minute)
- [ ] Open `chrome://extensions/`
- [ ] Enable "Developer mode" (toggle top-right)
- [ ] Click "Load unpacked"
- [ ] Select: `c:\Users\justthatuser\Documents\GitHub\browser converter`
- [ ] Click "Select Folder"
- [ ] Verify extension appears in list

### Step 2: Test Currency Conversion (2 minutes)
- [ ] Open any website (Google, Wikipedia, etc.)
- [ ] Highlight: `"USD 100"`
- [ ] Verify popup appears above text
- [ ] Verify shows conversions (EUR, GBP, JPY, etc.)
- [ ] Click "Copy" button
- [ ] Paste somewhere to verify format

### Step 3: Test Timezone Conversion (1 minute)
- [ ] Highlight: `"3 PM EST"`
- [ ] Verify popup shows timezone conversion
- [ ] Verify shows time in your timezone
- [ ] Try: `"2:30 PM GMT"` → Should convert

### Step 4: Test Settings (1 minute)
- [ ] Click extension icon in toolbar
- [ ] Click "Settings" at bottom
- [ ] Change timezone to different option
- [ ] Change currency to different option
- [ ] Click "Save Settings"
- [ ] Go back to webpage
- [ ] Highlight text again → Should use new settings

---

## DETAILED TEST CASES

### Test Suite 1: Installation & Setup

**Test 1.1: Extension Loading**
```
Action: Load extension from chrome://extensions/
Expected: Extension appears in list
Status: [ ] Pass [ ] Fail
Notes: _________________________________
```

**Test 1.2: Icon Display**
```
Action: Check extension toolbar icon
Expected: Icon appears in toolbar
Status: [ ] Pass [ ] Fail
Notes: _________________________________
```

**Test 1.3: Popup Access**
```
Action: Click extension icon
Expected: Popup window opens
Status: [ ] Pass [ ] Fail
Notes: _________________________________
```

**Test 1.4: Settings Access**
```
Action: Click "Settings" in popup
Expected: Settings page opens
Status: [ ] Pass [ ] Fail
Notes: _________________________________
```

---

### Test Suite 2: Currency Conversion

**Test 2.1: Basic Currency Detection**
```
Action: Highlight "USD 100" on webpage
Expected: Popup shows conversions
Status: [ ] Pass [ ] Fail
Conversions Seen: _____________________
```

**Test 2.2: Different Currency Codes**
```
Highlight each and verify detection:
- [ ] "EUR 50" → Converts to other currencies
- [ ] "GBP 200" → Shows conversion
- [ ] "JPY 10000" → Shows conversion
- [ ] "INR 5000" → Shows conversion
- [ ] "AUD 100" → Shows conversion
```

**Test 2.3: Amount Variations**
```
- [ ] "100 USD" → Converts (different format)
- [ ] "USD100" → Detects without space
- [ ] "1000 euros" → Case variation
- [ ] "$100" → Symbol format (if applicable)
```

**Test 2.4: Conversion Accuracy**
```
Action: Verify conversions are reasonable
- USD 100 → EUR: ~92 EUR (approximate)
- EUR 50 → USD: ~54 USD (approximate)
- GBP 100 → INR: ~10,400 INR (approximate)
Status: [ ] Pass [ ] Fail
Notes: _________________________________
```

**Test 2.5: Copy Function**
```
Action: 
1. Highlight "USD 100"
2. Click "Copy" in popup
3. Paste in text editor
Expected: Conversion result pastes correctly
Status: [ ] Pass [ ] Fail
Result Copied: ________________________
```

---

### Test Suite 3: Timezone Conversion

**Test 3.1: Basic Time Detection**
```
Action: Highlight "3 PM EST"
Expected: Popup shows conversion to your timezone
Status: [ ] Pass [ ] Fail
Your Timezone: ________________________
Converted Time: _______________________
```

**Test 3.2: Different Time Formats**
```
- [ ] "3:00 PM EST" → Converts with minutes
- [ ] "14:30 UTC" → 24-hour format
- [ ] "9 AM PST" → Different timezone
- [ ] "11:45 IST" → Another timezone
```

**Test 3.3: All Major Timezones**
```
Try highlighting times in:
- [ ] EST (Eastern)
- [ ] CST (Central)
- [ ] MST (Mountain)
- [ ] PST (Pacific)
- [ ] GMT (Greenwich)
- [ ] IST (India)
- [ ] JST (Japan)
- [ ] AEST (Australia)
```

**Test 3.4: Timezone Accuracy**
```
Known Time: 12:00 PM UTC
- Your EST (UTC-5): 7:00 AM
- Your PST (UTC-8): 4:00 AM
Action: Highlight "12 PM UTC"
Expected: Shows correct time in your zone
Status: [ ] Pass [ ] Fail
Shown Time: ___________________________
```

---

### Test Suite 4: Mixed Content

**Test 4.1: Combined Text**
```
Action: Highlight "Meeting at 2 PM EST for USD 500"
Expected: Popup shows conversions (time or currency)
Status: [ ] Pass [ ] Fail
Which detected: [ ] Time [ ] Currency [ ] Both
```

**Test 4.2: Multiple Values**
```
Action: Highlight "100 USD and 50 EUR"
Expected: Shows conversions
Status: [ ] Pass [ ] Fail
Note: May detect first value
```

---

### Test Suite 5: Settings & Preferences

**Test 5.1: Timezone Preference**
```
Steps:
1. Open Settings
2. Select timezone (e.g., "Asia/Tokyo")
3. Save
4. Highlight "3 PM EST"
5. Verify converts to Tokyo time
Status: [ ] Pass [ ] Fail
Selected Timezone: ____________________
Verified Conversion: ___________________
```

**Test 5.2: Currency Preference**
```
Steps:
1. Open Settings
2. Select currency (e.g., "EUR")
3. Save
4. Highlight "USD 100"
5. Verify result shows in EUR
Status: [ ] Pass [ ] Fail
Selected Currency: ____________________
Result: ________________________________
```

**Test 5.3: Settings Persistence**
```
Steps:
1. Set timezone to "America/Los_Angeles"
2. Set currency to "GBP"
3. Close settings
4. Close extension
5. Reopen extension
6. Check settings
Expected: Settings are saved
Status: [ ] Pass [ ] Fail
```

**Test 5.4: Reset to Defaults**
```
Steps:
1. Change settings
2. Click "Reset Settings"
3. Verify defaults are restored
Expected: Back to original values
Status: [ ] Pass [ ] Fail
```

**Test 5.5: Settings Sync**
```
Steps:
1. Save settings on this device
2. Check Settings > Manage Extensions > "Allow to read and change all data"
3. Sync to another device (if available)
Expected: Settings sync across devices
Status: [ ] Pass [ ] Fail
Note: Requires Chrome sync to be enabled
```

---

### Test Suite 6: UI & UX

**Test 6.1: Popup Position**
```
Action: Highlight text at different locations
Expected: Popup appears above/near selected text
- [ ] Top of page: Popup visible above
- [ ] Bottom of page: Popup adjusted for visibility
- [ ] Center of page: Popup centered above
Status: [ ] Pass [ ] Fail
```

**Test 6.2: Popup Styling**
```
Verify popup appearance:
- [ ] Background color: Gradient (blue-ish)
- [ ] Text color: White/readable
- [ ] Copy button: Visible and clickable
- [ ] Close button: Present
- [ ] Animation: Smooth fade-in
Status: [ ] Pass [ ] Fail
```

**Test 6.3: Auto-Close**
```
Action: 
1. Highlight text (popup appears)
2. Click elsewhere on page
Expected: Popup closes
Status: [ ] Pass [ ] Fail
```

**Test 6.4: Mobile Responsiveness**
```
If testing on mobile:
- [ ] Popup displays correctly
- [ ] Text remains selectable
- [ ] Buttons are tappable
- [ ] Copy function works
Status: [ ] Pass [ ] Fail
```

---

### Test Suite 7: Performance

**Test 7.1: Popup Response Time**
```
Action: Highlight text and measure time to popup
Expected: < 100ms
Measured Time: ________________________
Status: [ ] Pass [ ] Fail
```

**Test 7.2: Settings Load Time**
```
Action: Click Settings button
Expected: < 500ms to load
Measured Time: ________________________
Status: [ ] Pass [ ] Fail
```

**Test 7.3: Multiple Conversions**
```
Action: Highlight 10 different texts quickly
Expected: No lag, all convert correctly
Status: [ ] Pass [ ] Fail
```

**Test 7.4: Memory Usage**
```
Steps:
1. Open Chrome DevTools (F12)
2. Go to Memory tab
3. Take heap snapshot
4. Use extension for 5 minutes
5. Take another snapshot
Expected: Memory increase < 10MB
Initial: __________ Final: __________
Status: [ ] Pass [ ] Fail
```

---

### Test Suite 8: Error Handling

**Test 8.1: Network Error Recovery**
```
Steps:
1. Disconnect internet
2. Refresh page
3. Highlight "USD 100"
Expected: Still converts using cached rates
Status: [ ] Pass [ ] Fail
Note: May show "Offline" indicator
```

**Test 8.2: Invalid Input**
```
Test with:
- [ ] "XYZ 100" (invalid currency) → Should not convert
- [ ] "25 PM EST" (invalid time) → Should not convert
- [ ] Random text → Should not trigger popup
Status: [ ] Pass [ ] Fail
```

**Test 8.3: Console Errors**
```
Steps:
1. Open DevTools (F12)
2. Go to Console tab
3. Use extension normally
4. Check for errors
Expected: No error messages
Errors Found: __________________________
Status: [ ] Pass [ ] Fail
```

---

### Test Suite 9: Browser Compatibility

Test on each available browser:

**Chrome**
```
- [ ] Extension loads
- [ ] Features work
- [ ] No errors
Status: [ ] Pass [ ] Fail
Version: ________________________________
```

**Edge**
```
- [ ] Extension loads
- [ ] Features work
- [ ] No errors
Status: [ ] Pass [ ] Fail
Version: ________________________________
```

**Brave/Opera** (if available)
```
- [ ] Extension loads
- [ ] Features work
- [ ] No errors
Status: [ ] Pass [ ] Fail
Browser: ______________________________
```

---

### Test Suite 10: Website Compatibility

Test on various websites:

**Google.com**
- [ ] Text selection works
- [ ] Conversions appear
- [ ] No conflicts with site

**Wikipedia.org**
- [ ] Popup displays correctly
- [ ] No layout issues
- [ ] Readable text

**GitHub.com**
- [ ] Code highlighting doesn't interfere
- [ ] Conversions work on text
- [ ] No JavaScript conflicts

**Your Email (Gmail/Outlook)**
- [ ] Works in email compose
- [ ] Works in message body
- [ ] Copy function works

**Any Shopping Site**
- [ ] Detects currency amounts
- [ ] Shows conversions
- [ ] Doesn't interfere with site

---

## TEST RESULT SUMMARY

### Overall Status
- Total Tests: _____ / 50+
- Passed: _____ ✓
- Failed: _____ ✗
- Success Rate: _____%

### Categories
- Installation: [ ] Pass [ ] Fail
- Currency Conversion: [ ] Pass [ ] Fail
- Timezone Conversion: [ ] Pass [ ] Fail
- Settings: [ ] Pass [ ] Fail
- UI/UX: [ ] Pass [ ] Fail
- Performance: [ ] Pass [ ] Fail
- Error Handling: [ ] Pass [ ] Fail
- Compatibility: [ ] Pass [ ] Fail
- Website Compatibility: [ ] Pass [ ] Fail

### Issues Found
1. ________________________________________
2. ________________________________________
3. ________________________________________

### Performance Metrics
- Average popup response: ________ ms
- Memory usage increase: ________ MB
- Storage usage: ________ KB

### Notes for Production
_________________________________________
_________________________________________

---

## ✅ SIGN-OFF

**Tested By:** _____________________  
**Date:** _____________________  
**Result:** [ ] Ready for Release [ ] Needs Fixes  

**Recommendation:**
- [ ] ✅ Approve for production
- [ ] ⚠️ Fix issues and retest
- [ ] ❌ Major issues - needs work
