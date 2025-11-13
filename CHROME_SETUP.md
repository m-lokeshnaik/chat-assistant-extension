# How to Use the Extension in Chrome - Step by Step

## ✅ Build Complete!

The extension has been built successfully. Now follow these steps:

## Step 1: Add Icons (Required)

Before loading the extension, you need to add icon files:

1. **Create or download 4 icon PNG files** (16×16, 32×32, 48×48, 128×128 pixels)
2. **Place them in `src/icons/` folder** with these exact names:
   - `icon16.png`
   - `icon32.png`
   - `icon48.png`
   - `icon128.png`

**Quick Option**: Use any simple image and resize it to these 4 sizes, or use an online icon generator.

3. **Rebuild** (after adding icons):
   ```bash
   npm run build
   ```

## Step 2: Load Extension in Chrome

1. **Open Chrome Extensions Page**:
   - Type `chrome://extensions/` in the address bar
   - OR: Click the three dots (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**:
   - Toggle the switch in the **top-right corner**

3. **Load the Extension**:
   - Click the **"Load unpacked"** button
   - Navigate to: `C:\Users\lokes\Desktop\extension\dist`
   - Select the **`dist`** folder
   - Click "Select Folder"

4. **Verify**:
   - You should see "Chat Assistant Extension" in your extensions list
   - The extension should be enabled (toggle should be ON)

## Step 3: Use the Extension

1. **Visit any website** (e.g., google.com, github.com)

2. **Look for the floating button**:
   - You'll see a 💬 button in the **bottom-right corner** of the page

3. **Open the side panel**:
   - **Click the floating button** OR
   - Press **`Ctrl+Shift+G`** (Windows) or **`Cmd+Shift+G`** (Mac)

4. **Use the tabs**:
   - **ChatGPT Tab**: 
     - Make sure you're logged into https://chat.openai.com
     - Navigate to a conversation page
     - The extension will auto-detect and load messages
   
   - **Perplexity Tab**:
     - Visit https://www.perplexity.ai
     - Perform a search
     - Use the follow-up feature to search related questions

## Troubleshooting

### "Icons are missing" error
- ✅ Add the 4 icon files to `src/icons/` folder
- ✅ Rebuild: `npm run build`
- ✅ Reload the extension in Chrome

### Extension won't load
- ✅ Make sure you selected the **`dist`** folder (not `src`)
- ✅ Check that the build completed successfully
- ✅ Look for errors in the extensions page (click "Errors" if shown)

### Floating button not appearing
- ✅ Refresh the webpage (F5)
- ✅ Check if extension is enabled in `chrome://extensions/`
- ✅ Open browser console (F12) to check for errors
- ✅ Try a different website

### Side panel not opening
- ✅ Try the keyboard shortcut: `Ctrl+Shift+G`
- ✅ Make sure you're using Chrome 114 or later
- ✅ Check browser console for errors

### ChatGPT not working
- ✅ Ensure you're logged into chat.openai.com
- ✅ Navigate to a conversation page (URL should have `/c/` in it)
- ✅ Check browser console for errors

## Quick Commands Reference

```bash
# Rebuild after making changes
npm run build

# Development mode (auto-rebuild on changes)
npm run dev
```

## Next Steps

- ✅ Extension loaded and working
- 🔄 Test ChatGPT integration
- 🔄 Test Perplexity integration
- 📖 Read [USAGE.md](./USAGE.md) for advanced features
- 📖 Read [README.md](./README.md) for full documentation

