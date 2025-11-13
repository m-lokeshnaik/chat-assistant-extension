# Quick Start: Use Extension in Chrome (5 Minutes)

## Step 1: Create Icons (Required)

You need 4 icon files. Here's the fastest way:

### Option A: Use Online Tool (Easiest)
1. Go to https://www.favicon-generator.org/ or https://realfavicongenerator.net/
2. Upload any image or create a simple design
3. Download the generated icons
4. Rename and place them in `src/icons/`:
   - `icon16.png`
   - `icon32.png`
   - `icon48.png`
   - `icon128.png`

### Option B: Create Simple Icons Manually
1. Open any image editor (Paint, GIMP, Photoshop, or online editor)
2. Create a 128×128px colored circle or square
3. Save as PNG
4. Resize to create all 4 sizes:
   - 16×16px → `icon16.png`
   - 32×32px → `icon32.png`
   - 48×48px → `icon48.png`
   - 128×128px → `icon128.png`
5. Place all files in `src/icons/` folder

### Option C: Use Emoji as Icon (Quick Test)
If you just want to test quickly, you can use any simple image and resize it.

## Step 2: Build the Extension

Open terminal in this folder and run:

```bash
npm run build
```

This creates a `dist/` folder with the compiled extension.

## Step 3: Load in Chrome

1. **Open Chrome Extensions Page**:
   - Type `chrome://extensions/` in the address bar
   - OR go to Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**:
   - Toggle the switch in the top-right corner

3. **Load the Extension**:
   - Click **"Load unpacked"** button
   - Navigate to this project folder
   - Select the **`dist`** folder (NOT the `src` folder)
   - Click "Select Folder"

4. **Verify Installation**:
   - You should see "Chat Assistant Extension" in your extensions list
   - The extension icon should appear

## Step 4: Use the Extension

1. **Visit any website** (e.g., google.com)
2. **Look for the floating button** (💬) in the bottom-right corner
3. **Click the button** OR press `Ctrl+Shift+G` (Windows) or `Cmd+Shift+G` (Mac)
4. **The side panel opens** with two tabs:
   - **ChatGPT Tab**: Works if you're logged into chat.openai.com
   - **Perplexity Tab**: Works when you visit perplexity.ai

## Troubleshooting

### "Icons are missing" error
- Make sure all 4 icon files exist in `src/icons/`
- Check file names are exactly: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

### Extension won't load
- Make sure you selected the `dist` folder (not `src`)
- Check that `npm run build` completed successfully
- Look for errors in the extensions page

### Floating button not appearing
- Refresh the webpage
- Check if extension is enabled in `chrome://extensions/`
- Open browser console (F12) to check for errors

### Side panel not opening
- Try the keyboard shortcut: `Ctrl+Shift+G`
- Check if side panel API is supported (Chrome 114+)
- Update Chrome to latest version

## Next Steps

- ✅ Extension loaded and working
- 🔄 Test ChatGPT integration (log into chat.openai.com first)
- 🔄 Test Perplexity integration (visit perplexity.ai)
- 📖 Read [USAGE.md](./USAGE.md) for advanced features

