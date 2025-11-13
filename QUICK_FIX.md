# Quick Fix Guide - "It's Not Working"

## What's Not Working? Choose One:

### 🔴 Extension Won't Load
**Quick Fix**:
1. Go to `chrome://extensions/`
2. Click "Errors" button (if shown)
3. Tell me the exact error message

**Common Issues**:
- Missing icons → Already fixed ✅
- Wrong folder selected → Make sure you selected `dist` folder
- Manifest error → Check `dist/manifest.json` exists

---

### 🔴 Floating Button Not Appearing
**Quick Fix**:
1. Refresh the webpage (F5)
2. Open browser console (F12) → Console tab
3. Look for red errors
4. Tell me what errors you see

**Try This**:
- Visit a simple site like `google.com`
- Check if extension is enabled in `chrome://extensions/`
- Reload the extension (click refresh icon)

---

### 🔴 Side Panel Won't Open
**Quick Fix**:
1. Try keyboard shortcut: `Ctrl+Shift+G`
2. Open browser console (F12)
3. Check for errors
4. Tell me what you see

**Check**:
- Chrome version (needs 114+)
- Go to `chrome://extensions/` → Click "Service worker" → Check console

---

### 🔴 Side Panel Opens But Is Blank
**Quick Fix**:
1. Open side panel
2. Right-click in panel → "Inspect"
3. Check Console tab for errors
4. Tell me the error messages

**Common Issue**: Script not loading
- Check `dist/sidepanel-entry.js` exists (should be ~152KB)
- Check `dist/sidepanel.html` exists

---

### 🔴 ChatGPT Tab Not Working
**Quick Fix**:
1. Make sure you're logged into chat.openai.com
2. Navigate to a conversation (URL has `/c/` in it)
3. Open browser console (F12) → Check for errors
4. Tell me what errors you see

---

### 🔴 Perplexity Tab Not Working
**Quick Fix**:
1. Visit perplexity.ai first
2. Perform a search
3. Check browser console for errors
4. Tell me what you see

---

## Diagnostic Steps (Do These Now)

### Step 1: Check Extension Status
```
1. Open Chrome
2. Go to: chrome://extensions/
3. Find "Chat Assistant Extension"
4. Is it enabled? (toggle should be ON)
5. Click "Errors" if shown
6. What error message do you see?
```

### Step 2: Check Console
```
1. Visit any website (e.g., google.com)
2. Press F12 (open DevTools)
3. Go to "Console" tab
4. Look for red error messages
5. Copy the error messages
```

### Step 3: Test Floating Button
```
1. Visit google.com
2. Look at bottom-right corner
3. Do you see a 💬 button?
4. If not, check console (F12) for errors
```

### Step 4: Test Side Panel
```
1. Click the floating button OR press Ctrl+Shift+G
2. Does the side panel open?
3. If yes, is it blank or showing content?
4. If blank, right-click in panel → Inspect → Check console
```

## Tell Me:

1. **What exactly is not working?** (button, panel, ChatGPT, etc.)
2. **What error messages do you see?** (copy from console)
3. **What happens when you try?** (nothing, error, blank screen, etc.)
4. **Did you load the extension?** (yes/no, any errors when loading?)

## Most Common Issues:

### Issue 1: Extension Not Loaded
**Solution**: 
- Go to `chrome://extensions/`
- Enable Developer mode
- Click "Load unpacked"
- Select `C:\Users\lokes\Desktop\extension\dist` folder

### Issue 2: Button Not Appearing
**Solution**:
- Refresh the page (F5)
- Check extension is enabled
- Check console for errors

### Issue 3: Side Panel Blank
**Solution**:
- Right-click in panel → Inspect
- Check console for module loading errors
- Verify `sidepanel-entry.js` exists in `dist/`

### Issue 4: Script Errors
**Solution**:
- Rebuild: `npm run build`
- Reload extension in Chrome
- Clear browser cache

## Quick Rebuild (Try This):

```bash
# In terminal, run:
npm run build

# Then in Chrome:
# 1. Go to chrome://extensions/
# 2. Click refresh icon on your extension
# 3. Try again
```

---

**Please tell me**:
- What's not working?
- What error messages you see?
- What happens when you try to use it?

This will help me fix it quickly! 🚀

