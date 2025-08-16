// Content script to inject the summary button and handle webpage content extraction

console.log('Webpage Summary Generator content script loaded');

// Create and inject the summary button
function createSummaryButton() {
  console.log('Attempting to create summary button...');
  
  // Check if button already exists
  if (document.getElementById('summary-generator-btn')) {
    console.log('Summary button already exists, skipping...');
    return;
  }

  try {
    const button = document.createElement('button');
    button.id = 'summary-generator-btn';
    button.textContent = 'Generate Summary';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: #4285f4;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Add hover effects
    button.addEventListener('mouseenter', () => {
      button.style.background = '#3367d6';
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.background = '#4285f4';
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    // Add click handler
    button.addEventListener('click', generateSummary);
    
    // Try to append to body, if not available, wait a bit and try again
    if (document.body) {
      document.body.appendChild(button);
      console.log('Summary button created and added to page');
    } else {
      console.log('Document body not ready, will retry...');
      setTimeout(createSummaryButton, 100);
      return;
    }
  } catch (error) {
    console.error('Error creating summary button:', error);
  }
}

// Extract readable content from the webpage
function extractPageContent() {
  // Remove script and style elements
  const scripts = document.querySelectorAll('script, style, noscript, iframe, img, video, audio');
  scripts.forEach(el => el.remove());

  // Get main content areas
  const contentSelectors = [
    'main',
    'article',
    '.content',
    '.post-content',
    '.entry-content',
    '.article-content',
    '#content',
    '.main-content'
  ];

  let content = '';
  
  // Try to find main content area
  for (const selector of contentSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim().length > 100) {
      content = element.textContent;
      break;
    }
  }

  // Fallback to body content if no main content found
  if (!content) {
    content = document.body.textContent;
  }

  // Clean up the content
  content = content
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim()
    .substring(0, 8000); // Limit content length

  return content;
}

// Generate summary using OpenAI API (you'll need to add your API key)
async function generateSummary() {
  const button = document.getElementById('summary-generator-btn');
  const originalText = button.textContent;
  
  try {
    button.textContent = 'Generating...';
    button.style.background = '#f4b400';
    button.disabled = true;

    const pageContent = extractPageContent();
    const pageTitle = document.title;
    const pageUrl = window.location.href;

    // Send message to background script to handle API call
    const response = await chrome.runtime.sendMessage({
      action: 'generateSummary',
      data: {
        content: pageContent,
        title: pageTitle,
        url: pageUrl
      }
    });

    if (response.success) {
      showSummaryModal(response.summary, pageTitle);
    } else {
      throw new Error(response.error || 'Failed to generate summary');
    }

  } catch (error) {
    console.error('Error generating summary:', error);
    showErrorModal('Failed to generate summary. Please try again.');
  } finally {
    button.textContent = originalText;
    button.style.background = '#4285f4';
    button.disabled = false;
  }
}

// Show summary in a modal
function showSummaryModal(summary, title) {
  // Remove existing modal
  const existingModal = document.getElementById('summary-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'summary-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    position: relative;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  closeBtn.addEventListener('click', () => modal.remove());
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = '#f5f5f5';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'none';
  });

  const titleEl = document.createElement('h2');
  titleEl.textContent = 'Page Summary';
  titleEl.style.cssText = `
    margin: 0 0 16px 0;
    color: #333;
    font-size: 20px;
    font-weight: 600;
  `;

  const pageTitleEl = document.createElement('h3');
  pageTitleEl.textContent = title;
  pageTitleEl.style.cssText = `
    margin: 0 0 16px 0;
    color: #666;
    font-size: 16px;
    font-weight: 400;
  `;

  const summaryEl = document.createElement('div');
  summaryEl.textContent = summary;
  summaryEl.style.cssText = `
    line-height: 1.6;
    color: #333;
    font-size: 14px;
  `;

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(titleEl);
  modalContent.appendChild(pageTitleEl);
  modalContent.appendChild(summaryEl);
  modal.appendChild(modalContent);

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);
}

// Show error modal
function showErrorModal(message) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    z-index: 10001;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  
  modal.textContent = message;
  document.body.appendChild(modal);
  
  setTimeout(() => modal.remove(), 5000);
}

// Initialize when DOM is ready
function initializeExtension() {
  console.log('Initializing extension...');
  
  // Try to create button immediately if possible
  if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', createSummaryButton);
  } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('Document ready, creating button...');
    createSummaryButton();
  }
  
  // Also try after a short delay to catch edge cases
  setTimeout(createSummaryButton, 500);
  
  // Try again after a longer delay for slow-loading pages
  setTimeout(createSummaryButton, 2000);
}

// Also create button for dynamic content changes
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    // Check if our button exists, if not, create it
    if (!document.getElementById('summary-generator-btn')) {
      console.log('Content changed, checking if button needs to be created...');
      createSummaryButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('Mutation observer set up');
}

// Start initialization
initializeExtension();

// Set up mutation observer when body is available
if (document.body) {
  setupMutationObserver();
} else {
  // Wait for body to be available
  const bodyObserver = new MutationObserver((mutations, observer) => {
    if (document.body) {
      setupMutationObserver();
      observer.disconnect(); // Stop observing once body is found
    }
  });
  
  bodyObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}
