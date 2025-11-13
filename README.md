# Chat Assistant Chrome Extension

A Chrome extension that adds a floating button to every page, opening a compact side panel with ChatGPT and Perplexity integration.

## Features

- **Floating Button**: 32×32px button on every page
- **Side Panel**: 320px wide panel with shadow DOM isolation
- **ChatGPT Tab**: 
  - Auto-detects login status
  - Fetches current conversation and last 10 messages
  - Send new messages and stream responses
  - Typing indicator during streaming
- **Perplexity Tab**:
  - Scrapes last query and answer from Perplexity pages
  - Follow-up question search
  - Auto-closes search tabs after 5 seconds
  - Caches last 5 Q&A pairs in localStorage
- **Keyboard Shortcut**: Ctrl+Shift+G (Cmd+Shift+G on Mac) to toggle panel
- **Theme Support**: Automatically follows system light/dark preference

## Tech Stack

- **Manifest V3**
- **TypeScript**
- **React 18** (via Vite)
- **Shadow DOM** for style isolation

## Quick Start

📖 **For detailed deployment and usage instructions, see [USAGE.md](./USAGE.md)**

### Quick Build Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add icon files** to `src/icons/` (see [USAGE.md](./USAGE.md) for details)

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Load in Chrome**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### API Keys

**Good News**: The extension works **without API keys**! It uses your existing browser sessions.

- **ChatGPT**: Uses your logged-in session (reads cookies)
- **Perplexity**: Scrapes from the web interface

If you want to add API key support for enhanced features, see the [API Keys section in USAGE.md](./USAGE.md#api-keys-configuration).

## Development

For development with watch mode:

```bash
npm run dev
```

This will rebuild automatically when you make changes. After rebuilding, reload the extension in `chrome://extensions/`.

## Project Structure

```
extension/
├── src/
│   ├── background/
│   │   └── background.ts      # Service worker for CORS and messaging
│   ├── content/
│   │   ├── content.ts          # Floating button injection
│   │   └── perplexity.ts       # Perplexity page scraping
│   ├── sidepanel/
│   │   ├── sidepanel.html      # Side panel HTML
│   │   ├── sidepanel-entry.tsx # React component entry
│   │   └── sidepanel.css       # Styles
│   ├── icons/                  # Extension icons
│   └── manifest.json           # Extension manifest
├── dist/                       # Build output (generated)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## How It Works

### Floating Button
The content script (`content.ts`) injects a floating button on every page. Clicking it opens the side panel.

### Side Panel
The side panel is a separate HTML page that uses React and Shadow DOM to prevent style leaks into the host page.

### ChatGPT Integration
- Checks for `__Secure-next-auth.session-token` cookie to detect login
- Extracts conversation ID from the current tab URL (if on chat.openai.com)
- Fetches conversation data via `/backend-api/conversation/{id}` endpoint
- Sends new messages via POST to `/backend-api/conversation`
- All requests go through the background service worker to handle CORS

### Perplexity Integration
- Content script scrapes query and answer from Perplexity pages
- Follow-up questions open a new Perplexity search tab
- After 3 seconds, the extension scrapes the result
- Tab auto-closes after 5 seconds
- Results are cached in Chrome's localStorage

## Roadmap: Adding Claude Support

To add Claude (Anthropic) support as a third tab:

1. **Add Claude Tab**:
   - Create a new tab in `sidepanel-entry.tsx`
   - Add state management for Claude conversations

2. **Detect Claude Session**:
   - Check for Claude cookies/session tokens
   - Detect if user is on `claude.ai` or `console.anthropic.com`

3. **Fetch Conversations**:
   - Research Claude's API endpoints (may require API key)
   - Or scrape from the DOM if using the web interface
   - Implement conversation fetching similar to ChatGPT

4. **Send Messages**:
   - Use Claude's API or web interface
   - Handle streaming responses (Claude uses SSE similar to ChatGPT)
   - Display messages in the chat interface

5. **Update Manifest**:
   - Add Claude domains to `host_permissions`
   - Update content scripts if needed

6. **Testing**:
   - Test login detection
   - Test message sending and receiving
   - Test streaming responses
   - Ensure proper error handling

### Example Claude Integration Snippet

```typescript
// In sidepanel-entry.tsx
const [claudeConversations, setClaudeConversations] = useState([]);

const checkClaudeLogin = async () => {
  const response = await chrome.runtime.sendMessage({
    type: 'GET_COOKIE',
    url: 'https://claude.ai',
    name: 'session_token' // Update with actual cookie name
  });
  // ... handle login check
};

const sendClaudeMessage = async (message: string) => {
  // Use Claude API or scrape from web interface
  // Handle streaming response
};
```

## Privacy & Security

- **No Analytics**: Zero third-party analytics or tracking
- **Local Storage Only**: All data stored locally in Chrome
- **No Remote Storage**: No data sent to external servers (except API calls to ChatGPT/Perplexity)
- **CORS Handling**: All external requests go through background service worker

## Troubleshooting

### Extension won't load
- Make sure you've built the project (`npm run build`)
- Check that all icon files exist in `src/icons/`
- Verify `dist/manifest.json` exists

### ChatGPT tab not working
- Ensure you're logged into chat.openai.com
- Check browser console for errors
- Verify the conversation ID is in the URL when on a ChatGPT page

### Perplexity scraping not working
- Perplexity may have changed their DOM structure
- Check browser console for errors
- Update selectors in `perplexity.ts` if needed

### Styles not loading
- Check that `sidepanel.css` is copied to `dist/assets/`
- Verify web_accessible_resources in manifest.json
- Check browser console for CSS loading errors

## License

MIT

