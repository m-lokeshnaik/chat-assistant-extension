# Troubleshooting Guide

## Common Issues and Solutions

### 1. Extension Won't Load in Chrome

**Symptoms**: Error when clicking "Load unpacked"

**Solutions**:
- ✅ Make sure you selected the **`dist`** folder (not `src`)
- ✅ Check that all files exist in `dist/`:
  - `manifest.json`
  - `background.js`
  - `content.js`
  - `sidepanel-entry.js`
  - `sidepanel.html`
  - `perplexity.js`
  - `icons/` folder with all 4 PNG files

**Check for errors**:
1. Go to `chrome://extensions/`
2. Find your extension
3. Click "Errors" or "Details" to see error messages

### 2. Floating Button Not Appearing

**Symptoms**: No button visible on web pages

**Solutions**:
- ✅ Refresh the webpage (F5)
- ✅ Check if extension is enabled (toggle should be ON)
- ✅ Open browser console (F12) → Console tab → Look for errors
- ✅ Try a different website
- ✅ Reload the extension:
  1. Go to `chrome://extensions/`
  2. Click the refresh icon on your extension

**Debug**:
```javascript
// In browser console, check if content script loaded:
// Should see: "Chat Assistant Extension installed" in background console
```

### 3. Side Panel Not Opening

**Symptoms**: Button click or keyboard shortcut doesn't open panel

**Solutions**:
- ✅ Try keyboard shortcut: `Ctrl+Shift+G` (Windows) or `Cmd+Shift+G` (Mac)
- ✅ Check Chrome version (needs Chrome 114+ for side panel API)
- ✅ Open browser console (F12) → Check for errors
- ✅ Verify `sidepanel.html` exists in `dist/` folder

**Check**:
- Go to `chrome://extensions/`
- Click "Service worker" link (if available)
- Check console for errors

### 4. Side Panel Opens But Is Blank/White

**Symptoms**: Panel opens but shows nothing

**Solutions**:
- ✅ Check browser console (F12) → Console tab → Look for errors
- ✅ Verify `sidepanel-entry.js` exists and is not empty
- ✅ Check if React is loading properly
- ✅ Look for CORS or module loading errors

**Debug**:
1. Open side panel
2. Right-click in the panel → "Inspect"
3. Check Console tab for errors
4. Check Network tab for failed requests

### 5. ChatGPT Tab Not Working

**Symptoms**: Can't see messages or send messages

**Solutions**:
- ✅ Make sure you're logged into https://chat.openai.com
- ✅ Navigate to a conversation page (URL should contain `/c/`)
- ✅ Check browser console for errors
- ✅ Verify cookies permission is granted
- ✅ Try refreshing the ChatGPT page

**Check login**:
- Visit https://chat.openai.com
- Make sure you're logged in
- Open a conversation
- Then try the extension

### 6. Perplexity Tab Not Working

**Symptoms**: Can't scrape or search

**Solutions**:
- ✅ Visit https://www.perplexity.ai first
- ✅ Perform a search on Perplexity
- ✅ Check if DOM selectors need updating (Perplexity may have changed their HTML)
- ✅ Check browser console for errors

### 7. Build Errors

**Symptoms**: `npm run build` fails

**Solutions**:
- ✅ Make sure all dependencies are installed: `npm install`
- ✅ Check for TypeScript errors
- ✅ Verify all source files exist
- ✅ Check `vite.config.ts` is correct

**Rebuild**:
```bash
# Clean and rebuild
rm -rf dist
npm run build
```

### 8. Icons Missing Error

**Symptoms**: Extension shows error about missing icons

**Solutions**:
- ✅ Add 4 icon PNG files to `src/icons/`:
  - `icon16.png`
  - `icon32.png`
  - `icon48.png`
  - `icon128.png`
- ✅ Rebuild: `npm run build`
- ✅ Verify icons are in `dist/icons/` folder

### 9. Module Loading Errors

**Symptoms**: Console shows "Failed to load module" or "Cannot find module"

**Solutions**:
- ✅ Check `sidepanel.html` script reference is correct
- ✅ Verify all JS files are built
- ✅ Check for missing chunk files
- ✅ Rebuild the extension

### 10. CORS Errors

**Symptoms**: Network requests fail with CORS errors

**Solutions**:
- ✅ All external requests should go through background service worker
- ✅ Check `background.js` is running
- ✅ Verify host_permissions in manifest.json
- ✅ Check service worker console for errors

## Debugging Steps

### Step 1: Check Extension Status
1. Go to `chrome://extensions/`
2. Find "Chat Assistant Extension"
3. Check if it's enabled
4. Click "Errors" if shown
5. Click "Service worker" to check background script

### Step 2: Check Console
1. Open any webpage
2. Press F12 to open DevTools
3. Go to Console tab
4. Look for red error messages
5. Note any error messages

### Step 3: Check Side Panel Console
1. Open the side panel
2. Right-click in the panel → "Inspect"
3. Check Console tab for errors
4. Check Network tab for failed requests

### Step 4: Verify Files
```bash
# Check dist folder structure
dir dist
dir dist\icons

# Should see:
# - manifest.json
# - background.js
# - content.js
# - sidepanel-entry.js
# - sidepanel.html
# - perplexity.js
# - icons/ (with 4 PNG files)
```

### Step 5: Test Components
1. **Background Script**: Check service worker is running
2. **Content Script**: Check if button appears on pages
3. **Side Panel**: Check if panel opens and loads
4. **ChatGPT**: Check if it detects login
5. **Perplexity**: Check if it scrapes data

## Getting Help

If none of these solutions work:

1. **Check browser console** for specific error messages
2. **Check service worker console** for background errors
3. **Check side panel console** for panel errors
4. **Note the exact error message** you see
5. **Check Chrome version** (should be 114+)

## Quick Fixes

```bash
# 1. Clean and rebuild
rm -rf dist node_modules
npm install
npm run build

# 2. Reload extension
# Go to chrome://extensions/
# Click refresh icon on extension

# 3. Clear browser cache
# Chrome → Settings → Privacy → Clear browsing data
```

