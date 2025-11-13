# How to Deploy and Use the Extension

## Quick Start Guide

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Add Extension Icons

Before building, you need to add icon files to `src/icons/`:
- `icon16.png` (16×16 pixels)
- `icon32.png` (32×32 pixels)
- `icon48.png` (48×48 pixels)
- `icon128.png` (128×128 pixels)

**Quick way to create icons:**
1. Create a simple design (colored circle, chat bubble, etc.)
2. Export at all 4 sizes
3. Save as PNG files in `src/icons/` folder

### Step 3: Build the Extension

```bash
npm run build
```

This creates a `dist/` folder with all the compiled files.

### Step 4: Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `dist` folder from this project
5. The extension should now appear in your extensions list

### Step 5: Use the Extension

1. **Floating Button**: Visit any website - you'll see a 32×32px floating button (💬) in the bottom right
2. **Open Panel**: Click the button or press `Ctrl+Shift+G` (or `Cmd+Shift+G` on Mac)
3. **ChatGPT Tab**: 
   - Make sure you're logged into https://chat.openai.com
   - Navigate to a ChatGPT conversation
   - The extension will auto-detect your session and load messages
4. **Perplexity Tab**: 
   - Visit https://www.perplexity.ai and perform a search
   - Use the follow-up feature to search related questions

## API Keys Configuration

### Current Implementation: No API Keys Required! ✅

The extension currently works **without any API keys**:

- **ChatGPT**: Uses your existing browser session (reads cookies from chat.openai.com)
- **Perplexity**: Scrapes data from the web interface (no API needed)

### Adding API Keys (Optional - For Future Features)

If you want to add API key support for enhanced features, here's how:

#### Option 1: Environment Variables (Recommended for Development)

1. Create a `.env` file in the project root:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here
VITE_ANTHROPIC_API_KEY=your_claude_api_key_here
```

2. Update `vite.config.ts` to handle env variables:
```typescript
export default defineConfig({
  // ... existing config
  define: {
    'process.env': process.env
  }
});
```

3. Access in code:
```typescript
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
```

**⚠️ Important**: Never commit `.env` files to git! They're already in `.gitignore`.

#### Option 2: Chrome Storage (For Runtime Configuration)

Store API keys in Chrome's secure storage:

1. Create a settings page or popup for users to enter keys
2. Store in `chrome.storage.local`:
```typescript
// Save API key
chrome.storage.local.set({ 
  openaiApiKey: 'user_entered_key' 
});

// Retrieve API key
chrome.storage.local.get(['openaiApiKey'], (result) => {
  const apiKey = result.openaiApiKey;
});
```

3. Add to manifest permissions:
```json
"permissions": [
  // ... existing permissions
  "storage"
]
```

#### Option 3: Background Script Configuration

Create a config file that's loaded by the background script:

1. Create `src/config/api-keys.ts`:
```typescript
export const API_KEYS = {
  openai: process.env.VITE_OPENAI_API_KEY || '',
  perplexity: process.env.VITE_PERPLEXITY_API_KEY || '',
  anthropic: process.env.VITE_ANTHROPIC_API_KEY || ''
};
```

2. Use in background script:
```typescript
import { API_KEYS } from './config/api-keys';

// Use API key in fetch requests
fetch(url, {
  headers: {
    'Authorization': `Bearer ${API_KEYS.openai}`
  }
});
```

### Example: Adding OpenAI API Key Support

Here's how to modify the ChatGPT integration to use an API key instead of cookies:

1. **Update `src/sidepanel/sidepanel-entry.tsx`**:

```typescript
// Add state for API key
const [apiKey, setApiKey] = useState<string>('');

// Load API key from storage
useEffect(() => {
  chrome.storage.local.get(['openaiApiKey'], (result) => {
    if (result.openaiApiKey) {
      setApiKey(result.openaiApiKey);
    }
  });
}, []);

// Modify sendChatGPTMessage to use API key
const sendChatGPTMessage = async () => {
  if (!apiKey) {
    alert('Please set your OpenAI API key in settings');
    return;
  }
  
  const response = await chrome.runtime.sendMessage({
    type: 'FETCH',
    url: 'https://api.openai.com/v1/chat/completions',
    options: {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    }
  });
  // ... handle response
};
```

2. **Add Settings UI** (in sidepanel):

```typescript
const [showSettings, setShowSettings] = useState(false);
const [tempApiKey, setTempApiKey] = useState('');

const saveApiKey = () => {
  chrome.storage.local.set({ openaiApiKey: tempApiKey });
  setApiKey(tempApiKey);
  setShowSettings(false);
};

// In JSX:
{showSettings && (
  <div className="settings-modal">
    <input
      type="password"
      value={tempApiKey}
      onChange={(e) => setTempApiKey(e.target.value)}
      placeholder="Enter OpenAI API Key"
    />
    <button onClick={saveApiKey}>Save</button>
  </div>
)}
```

### Security Best Practices

1. **Never hardcode API keys** in source code
2. **Use environment variables** for development
3. **Store keys securely** in Chrome storage (encrypted)
4. **Add `.env` to `.gitignore`** (already done)
5. **Validate API keys** before making requests
6. **Show clear errors** if API keys are missing or invalid

### Testing API Keys

Create a test function:

```typescript
const testApiKey = async (key: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${key}`
      }
    });
    return response.ok;
  } catch {
    return false;
  }
};
```

## Development Mode

For active development with auto-rebuild:

```bash
npm run dev
```

This watches for changes and rebuilds automatically. After each rebuild:
1. Go to `chrome://extensions/`
2. Click the refresh icon on your extension
3. Test your changes

## Troubleshooting

### Extension won't load
- ✅ Make sure you built the project (`npm run build`)
- ✅ Check that icon files exist in `src/icons/`
- ✅ Verify `dist/manifest.json` exists
- ✅ Check browser console for errors

### ChatGPT not working
- ✅ Ensure you're logged into chat.openai.com
- ✅ Check that you're on a conversation page (URL contains `/c/`)
- ✅ Open browser DevTools console to see errors
- ✅ Verify cookies permission in manifest

### Perplexity scraping fails
- ✅ Perplexity may have changed their DOM structure
- ✅ Check browser console for selector errors
- ✅ Update selectors in `src/content/perplexity.ts`

### API Key not working
- ✅ Verify the key is correct (no extra spaces)
- ✅ Check API key permissions/scopes
- ✅ Verify network requests in DevTools → Network tab
- ✅ Check if API has rate limits

## Production Deployment

### For Chrome Web Store:

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Create a ZIP file** of the `dist` folder:
   ```bash
   cd dist
   zip -r ../extension.zip .
   ```

3. **Submit to Chrome Web Store**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Upload the ZIP file
   - Fill in store listing details
   - Submit for review

### For Distribution:

- Share the GitHub repository link
- Users can clone and build locally
- Or provide pre-built ZIP files for direct installation

## Next Steps

- ✅ Extension is deployed to GitHub
- ✅ Ready to build and use locally
- 🔄 Add API key support (optional)
- 🔄 Add Claude integration (see README roadmap)
- 🔄 Publish to Chrome Web Store (optional)

