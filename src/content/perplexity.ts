// Content script for Perplexity page scraping

interface PerplexityData {
  query: string;
  answer: string;
  citations: string[];
}

function scrapePerplexityData(): PerplexityData | null {
  // Try to find query text
  const queryElement = document.querySelector('.query-text, [class*="query"], [class*="question"]');
  const query = queryElement?.textContent?.trim() || '';
  
  // Try to find answer text
  const answerElement = document.querySelector('.answer-text, [class*="answer"], [class*="response"]');
  const answer = answerElement?.textContent?.trim() || '';
  
  // Try to find citations
  const citationLinks = Array.from(document.querySelectorAll('.citation-link, [class*="citation"], a[href*="http"]'));
  const citations = citationLinks
    .map(link => (link as HTMLElement).textContent?.trim() || (link as HTMLAnchorElement).href)
    .filter(Boolean)
    .slice(0, 5);
  
  if (!query && !answer) {
    return null;
  }
  
  return { query, answer, citations };
}

// Listen for scrape requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SCRAPE_PERPLEXITY') {
    const data = scrapePerplexityData();
    sendResponse({ data });
  }
  return false;
});

// Auto-scrape when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const data = scrapePerplexityData();
    if (data) {
      chrome.runtime.sendMessage({ type: 'PERPLEXITY_DATA', data });
    }
  });
} else {
  const data = scrapePerplexityData();
  if (data) {
    chrome.runtime.sendMessage({ type: 'PERPLEXITY_DATA', data });
  }
}

