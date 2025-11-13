import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import cssText from './sidepanel.css?inline';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface PerplexityQA {
  query: string;
  answer: string;
  citations: string[];
  timestamp: number;
}

function SidePanel() {
  const [activeTab, setActiveTab] = useState<'chatgpt' | 'perplexity'>('chatgpt');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [perplexityQAs, setPerplexityQAs] = useState<PerplexityQA[]>([]);
  const [followUp, setFollowUp] = useState('');
  const [isDark, setIsDark] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Detect theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Load cached Perplexity Q&As
    chrome.storage.local.get(['perplexityQAs'], (result) => {
      if (result.perplexityQAs) {
        setPerplexityQAs(result.perplexityQAs);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const checkChatGPTLogin = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_COOKIE',
        url: 'https://chat.openai.com',
        name: '__Secure-next-auth.session-token'
      });
      
      const hasToken = response?.cookie !== null;
      setIsLoggedIn(hasToken);
      
      if (hasToken) {
        await fetchChatGPTMessages();
      }
    } catch (error) {
      console.error('Error checking login:', error);
      setIsLoggedIn(false);
    }
  };

  const fetchChatGPTMessages = async () => {
    try {
      // Get current tab to find conversation ID
      const tabResponse = await chrome.runtime.sendMessage({ type: 'GET_TAB' });
      const currentUrl = tabResponse?.tab?.url || '';
      
      // Try to extract conversation ID from URL
      const urlMatch = currentUrl.match(/\/c\/([a-z0-9-]+)/);
      const convId = urlMatch ? urlMatch[1] : null;
      
      if (!convId) {
        // If no conversation ID in URL, we can't fetch messages
        return;
      }
      
      setConversationId(convId);
      
      // Get auth token from cookies
      const tokenResponse = await chrome.runtime.sendMessage({
        type: 'GET_COOKIE',
        url: 'https://chat.openai.com',
        name: '__Secure-next-auth.session-token'
      });
      
      if (!tokenResponse?.cookie) {
        return;
      }
      
      // Fetch conversation data
      const response = await chrome.runtime.sendMessage({
        type: 'FETCH',
        url: `https://chat.openai.com/backend-api/conversation/${convId}`,
        options: {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenResponse.cookie}`
          }
        }
      });
      
      if (response?.data?.mapping) {
        const messageList: Message[] = [];
        const mapping = response.data.mapping;
        
        // Get last 10 messages
        const messageIds = Object.keys(mapping).slice(-10);
        
        for (const msgId of messageIds) {
          const msg = mapping[msgId];
          if (msg?.message) {
            const role = msg.message.author?.role === 'user' ? 'user' : 'assistant';
            const content = msg.message.content?.parts?.[0] || '';
            if (content) {
              messageList.push({
                id: msgId,
                role,
                content
              });
            }
          }
        }
        
        setMessages(messageList);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendChatGPTMessage = async () => {
    if (!inputValue.trim() || !conversationId || isStreaming) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsStreaming(true);
    
    try {
      // Get auth token
      const tokenResponse = await chrome.runtime.sendMessage({
        type: 'GET_COOKIE',
        url: 'https://chat.openai.com',
        name: '__Secure-next-auth.session-token'
      });
      
      if (!tokenResponse?.cookie) {
        setIsStreaming(false);
        return;
      }
      
      // Send message to ChatGPT
      const response = await chrome.runtime.sendMessage({
        type: 'FETCH',
        url: `https://chat.openai.com/backend-api/conversation`,
        options: {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenResponse.cookie}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            action: 'next',
            messages: [
              ...messages.map(m => ({
                id: m.id,
                role: m.role,
                content: {
                  content_type: 'text',
                  parts: [m.content]
                }
              })),
              {
                id: userMessage.id,
                role: 'user',
                content: {
                  content_type: 'text',
                  parts: [messageToSend]
                }
              }
            ],
            model: 'gpt-4',
            parent_message_id: messages[messages.length - 1]?.id || null
          })
        }
      });
      
      // Handle response
      if (response?.data?.message?.content?.parts?.[0]) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: response.data.message.content.parts[0]
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else if (response?.error) {
        console.error('Error:', response.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  const handlePerplexityFollowUp = async () => {
    if (!followUp.trim()) return;
    
    const encodedQuery = encodeURIComponent(followUp);
    const searchUrl = `https://www.perplexity.ai/search?q=${encodedQuery}`;
    
    // Open new tab
    const tab = await chrome.tabs.create({ url: searchUrl, active: false });
    
    // Wait for page to load and scrape
    setTimeout(async () => {
      try {
        // Inject script to scrape
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: () => {
            const queryEl = document.querySelector('.query-text, [class*="query"], [class*="question"]');
            const answerEl = document.querySelector('.answer-text, [class*="answer"], [class*="response"]');
            const citations = Array.from(document.querySelectorAll('.citation-link, [class*="citation"], a[href*="http"]'));
            
            return {
              query: queryEl?.textContent?.trim() || '',
              answer: answerEl?.textContent?.trim() || '',
              citations: citations.slice(0, 5).map(c => (c as HTMLElement).textContent?.trim() || (c as HTMLAnchorElement).href || '').filter(Boolean)
            };
          }
        });
        
        if (results[0]?.result) {
          const data = results[0].result;
          if (data.query || data.answer) {
            const newQA: PerplexityQA = {
              ...data,
              timestamp: Date.now()
            };
            
            const updatedQAs = [newQA, ...perplexityQAs].slice(0, 5);
            setPerplexityQAs(updatedQAs);
            chrome.storage.local.set({ perplexityQAs: updatedQAs });
          }
        }
      } catch (error) {
        console.error('Error scraping Perplexity:', error);
      }
      
      // Close tab after 5 seconds
      setTimeout(() => {
        chrome.tabs.remove(tab.id!);
      }, 5000);
    }, 3000);
    
    setFollowUp('');
  };

  useEffect(() => {
    if (activeTab === 'chatgpt') {
      checkChatGPTLogin();
    }
  }, [activeTab]);

  return (
    <div className={`sidepanel-container ${isDark ? 'dark' : 'light'}`}>
      <div className="sidepanel-header">
        <button
          className={`tab-button ${activeTab === 'chatgpt' ? 'active' : ''}`}
          onClick={() => setActiveTab('chatgpt')}
        >
          ChatGPT
        </button>
        <button
          className={`tab-button ${activeTab === 'perplexity' ? 'active' : ''}`}
          onClick={() => setActiveTab('perplexity')}
        >
          Perplexity
        </button>
      </div>

      <div className="sidepanel-content">
        {activeTab === 'chatgpt' ? (
          <div className="chatgpt-tab">
            {!isLoggedIn ? (
              <div className="login-prompt">
                Please log in to <a href="https://chat.openai.com" target="_blank" rel="noreferrer">chat.openai.com</a>
              </div>
            ) : (
              <>
                <div className="messages-container">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.role}`}>
                      <div className="message-content">{msg.content}</div>
                    </div>
                  ))}
                  {isStreaming && (
                    <div className="message assistant">
                      <div className="message-content typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatGPTMessage()}
                    placeholder="Type a message..."
                    disabled={isStreaming || !conversationId}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="perplexity-tab">
            <div className="follow-up-section">
              <label>Follow-up:</label>
              <input
                type="text"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePerplexityFollowUp()}
                placeholder="Enter follow-up question..."
              />
              <button onClick={handlePerplexityFollowUp}>Search</button>
            </div>
            <div className="qa-list">
              {perplexityQAs.length === 0 ? (
                <div className="empty-state">No Q&A pairs cached yet</div>
              ) : (
                perplexityQAs.map((qa, idx) => (
                  <div key={idx} className="qa-item">
                    <div className="qa-query">{qa.query}</div>
                    <div className="qa-answer">{qa.answer}</div>
                    {qa.citations.length > 0 && (
                      <div className="qa-citations">
                        {qa.citations.map((cite, i) => (
                          <span key={i} className="citation">{cite}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Render to root element with shadow DOM
const container = document.getElementById('root');
if (container) {
  // Create shadow DOM to avoid style leaks
  const shadowRoot = container.attachShadow({ mode: 'open' });
  const shadowContainer = document.createElement('div');
  shadowContainer.id = 'shadow-container';
  
  // Inject CSS into shadow DOM
  const style = document.createElement('style');
  style.textContent = cssText;
  shadowRoot.appendChild(style);
  shadowRoot.appendChild(shadowContainer);
  
  const root = createRoot(shadowContainer);
  root.render(<SidePanel />);
}

