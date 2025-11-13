// Background service worker for CORS handling and message passing

chrome.runtime.onInstalled.addListener(() => {
  console.log('Chat Assistant Extension installed');
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-panel') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.sidePanel.open({ windowId: tabs[0].windowId });
      }
    });
  }
});

// Handle all messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle toggle panel message from content script
  if (request.type === 'TOGGLE_PANEL') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.sidePanel.open({ windowId: tabs[0].windowId });
      }
    });
    sendResponse({ success: true });
    return false;
  }
  
  // CORS-safe fetch wrapper
  if (request.type === 'FETCH') {
    const { url, options } = request;
    
    fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...options?.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        const contentType = response.headers.get('content-type');
        const isSSE = contentType?.includes('text/event-stream');
        
        if (isSSE) {
          // For SSE, we'll handle it differently
          const reader = response.body?.getReader();
          if (!reader) {
            sendResponse({ error: 'No response body' });
            return;
          }
          
          const decoder = new TextDecoder();
          let buffer = '';
          
          const readChunk = async () => {
            try {
              const { done, value } = await reader.read();
              if (done) {
                sendResponse({ done: true });
                return;
              }
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    sendResponse({ done: true });
                    return;
                  }
                  try {
                    const json = JSON.parse(data);
                    sendResponse({ data: json, done: false });
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
              
              readChunk();
            } catch (error) {
              sendResponse({ error: error.message });
            }
          };
          
          readChunk();
          return true; // Keep channel open for streaming
        } else {
          return response.json().then((data) => {
            sendResponse({ data });
          });
        }
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });
    
    return true; // Keep channel open for async response
  }
  
  if (request.type === 'GET_COOKIE') {
    chrome.cookies.get(
      { url: request.url, name: request.name },
      (cookie) => {
        sendResponse({ cookie: cookie?.value || null });
      }
    );
    return true;
  }
  
  if (request.type === 'GET_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tab: tabs[0] || null });
    });
    return true;
  }
  
  return false;
});

