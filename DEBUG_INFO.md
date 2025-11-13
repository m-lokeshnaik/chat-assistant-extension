# Debug Information Needed

To help fix the issue, please provide:

## 1. Extension Status
- [ ] Is the extension loaded in `chrome://extensions/`? (yes/no)
- [ ] Any error messages shown? (copy exact text)
- [ ] Is extension enabled? (toggle ON/OFF)

## 2. Console Output
Open browser console (F12 → Console tab) on any website and check:

- [ ] Do you see: `Chat Assistant: Floating button created`?
- [ ] Any red error messages? (copy them)
- [ ] Any warnings? (copy them)

## 3. Button Visibility
- [ ] Do you see the button on web pages? (yes/no)
- [ ] If no, check console for errors
- [ ] Try: `document.getElementById('chat-assistant-float-btn')` in console

## 4. Service Worker
Go to `chrome://extensions/` → Click "Service worker" link:

- [ ] Any errors in console?
- [ ] Do you see: "Chat Assistant Extension installed"?
- [ ] Copy any error messages

## 5. Side Panel
- [ ] Does side panel open when clicking button? (yes/no/blank)
- [ ] Does keyboard shortcut work? (`Ctrl+Shift+G`)
- [ ] If panel opens but blank, right-click in panel → Inspect → Check console

## 6. Chrome Version
- [ ] What Chrome version? (Menu → Help → About)
- [ ] Side panel needs Chrome 114+

## Quick Test Commands

**In Browser Console (F12):**
```javascript
// Check if button exists
document.getElementById('chat-assistant-float-btn')

// Check if content script loaded
console.log('Testing extension')

// Manually trigger
chrome.runtime.sendMessage({type: 'TOGGLE_PANEL'}, (r) => console.log(r))
```

**Check Extension Files:**
```bash
# Verify all files exist
dir dist
dir dist\icons
```

## Most Common Issues:

1. **Extension won't load** → Check icons in `dist/icons/`
2. **Button not appearing** → Check console for content script errors
3. **Panel won't open** → Check service worker console
4. **Panel blank** → Check side panel console (right-click → Inspect)

Please fill out this checklist and share the results!

