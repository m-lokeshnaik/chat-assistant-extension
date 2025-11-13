// Content script to inject floating button on all pages

let button: HTMLButtonElement | null = null;
let isPanelOpen = false;

function createFloatingButton() {
  if (button) return;
  
  button = document.createElement('button');
  button.id = 'chat-assistant-float-btn';
  button.innerHTML = '💬';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #4a90e2;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    z-index: 999999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  button.addEventListener('mouseenter', () => {
    if (button) {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    }
  });
  
  button.addEventListener('mouseleave', () => {
    if (button) {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    }
  });
  
  button.addEventListener('click', () => {
    togglePanel();
  });
  
  document.body.appendChild(button);
}

function togglePanel() {
  chrome.runtime.sendMessage({ type: 'TOGGLE_PANEL' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error toggling panel:', chrome.runtime.lastError);
    } else {
      isPanelOpen = !isPanelOpen;
    }
  });
}

// Listen for panel toggle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TOGGLE_PANEL') {
    togglePanel();
  }
});

// Inject button when DOM is ready
function initButton() {
  if (document.body) {
    createFloatingButton();
    console.log('Chat Assistant: Floating button created');
  } else {
    // Wait for body to be available
    const observer = new MutationObserver(() => {
      if (document.body) {
        createFloatingButton();
        console.log('Chat Assistant: Floating button created');
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true });
    
    // Fallback to DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      if (!button && document.body) {
        createFloatingButton();
        console.log('Chat Assistant: Floating button created');
      }
    });
  }
}

// Initialize immediately if possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initButton);
} else {
  initButton();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (button) {
    button.remove();
    button = null;
  }
});

