// Popup script for Webpage Summary Generator

document.addEventListener('DOMContentLoaded', function() {
    // Check extension status
    checkExtensionStatus();
    
    // Check API key status
    checkAPIKeyStatus();
});

// Check if the extension is working properly
function checkExtensionStatus() {
    const statusElement = document.getElementById('extension-status');
    
    try {
        // Try to send a message to the background script
        chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Runtime error:', chrome.runtime.lastError);
                statusElement.textContent = 'Error';
                statusElement.style.color = '#dc3545';
                
                // Add error details
                const errorDetails = document.createElement('div');
                errorDetails.style.cssText = `
                    font-size: 12px;
                    color: #dc3545;
                    margin-top: 4px;
                    font-style: italic;
                `;
                errorDetails.textContent = chrome.runtime.lastError.message || 'Unknown error';
                statusElement.parentNode.appendChild(errorDetails);
            } else if (response && response.status === 'ok') {
                statusElement.textContent = 'Active';
                statusElement.style.color = '#28a745';
            } else {
                statusElement.textContent = 'Unknown';
                statusElement.style.color = '#ffc107';
            }
        });
    } catch (error) {
        console.error('Error checking extension status:', error);
        statusElement.textContent = 'Error';
        statusElement.style.color = '#dc3545';
    }
}

// Check API key configuration status
function checkAPIKeyStatus() {
    const apiStatusElement = document.getElementById('api-status');
    
    try {
        chrome.runtime.sendMessage({ action: 'checkAPIKey' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Runtime error checking API key:', chrome.runtime.lastError);
                apiStatusElement.textContent = 'Error';
                apiStatusElement.style.color = '#dc3545';
            } else if (response && response.valid) {
                apiStatusElement.textContent = 'Configured';
                apiStatusElement.style.color = '#28a745';
            } else if (response && response.configured) {
                apiStatusElement.textContent = 'Invalid';
                apiStatusElement.style.color = '#dc3545';
            } else {
                apiStatusElement.textContent = 'Not Configured';
                apiStatusElement.style.color = '#ffc107';
            }
        });
    } catch (error) {
        console.error('Error checking API key status:', error);
        apiStatusElement.textContent = 'Error';
        apiStatusElement.style.color = '#dc3545';
    }
}

// Add click handlers for external links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.href) {
        e.preventDefault();
        chrome.tabs.create({ url: e.target.href });
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.close();
    }
});

// Add some interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add a test button to check if content script is working
    const testSection = document.createElement('div');
    testSection.style.cssText = `
        background: #e8f5e8;
        border: 1px solid #c3e6c3;
        border-radius: 8px;
        padding: 16px;
        margin-top: 16px;
    `;
    
    testSection.innerHTML = `
        <h4 style="margin: 0 0 12px 0; color: #155724; font-size: 14px;">
            🧪 Test Extension
        </h4>
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #155724;">
            To test if the extension is working:
        </p>
        <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #155724;">
            <li>Go to any news article or blog post</li>
            <li>Look for the blue "Generate Summary" button in the top-right corner</li>
            <li>If you see it, the extension is working!</li>
        </ol>
    `;
    
    const content = document.querySelector('.content');
    if (content) {
        content.appendChild(testSection);
    }
    
    // Add test buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 8px;
        margin-top: 12px;
        flex-wrap: wrap;
    `;
    
    // Test API button
    const testAPIButton = document.createElement('button');
    testAPIButton.textContent = 'Test API';
    testAPIButton.style.cssText = `
        background: #28a745;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 16px;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s ease;
    `;
    
    testAPIButton.addEventListener('mouseenter', () => {
        testAPIButton.style.background = '#218838';
    });
    
    testAPIButton.addEventListener('mouseleave', () => {
        testAPIButton.style.background = '#28a745';
    });
    
    testAPIButton.addEventListener('click', testAPI);
    
    // Inject button manually button
    const injectButton = document.createElement('button');
    injectButton.textContent = 'Inject Button';
    injectButton.style.cssText = `
        background: #17a2b8;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 16px;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s ease;
    `;
    
    injectButton.addEventListener('mouseenter', () => {
        injectButton.style.background = '#138496';
    });
    
    injectButton.addEventListener('mouseleave', () => {
        injectButton.style.background = '#17a2b8';
    });
    
    injectButton.addEventListener('click', injectSummaryButton);
    
    // Reload button
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Extension';
    reloadButton.style.cssText = `
        background: #4285f4;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 16px;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.2s ease;
    `;
    
    reloadButton.addEventListener('mouseenter', () => {
        reloadButton.style.background = '#3367d6';
    });
    
    reloadButton.addEventListener('mouseleave', () => {
        reloadButton.style.background = '#4285f4';
    });
    
    reloadButton.addEventListener('click', () => {
        chrome.runtime.reload();
        window.close();
    });
    
    buttonContainer.appendChild(testAPIButton);
    buttonContainer.appendChild(injectButton);
    buttonContainer.appendChild(reloadButton);
    testSection.appendChild(buttonContainer);
});

// Test API functionality
function testAPI() {
    const testButton = event.target;
    const originalText = testButton.textContent;
    
    testButton.textContent = 'Testing...';
    testButton.disabled = true;
    testButton.style.background = '#ffc107';
    
    // Send test message to background script
    chrome.runtime.sendMessage({ 
        action: 'generateSummary',
        data: {
            content: 'This is a test content to verify the OpenAI API integration is working correctly. The extension should be able to generate a summary of this text.',
            title: 'Test Page',
            url: 'https://example.com/test'
        }
    }, (response) => {
        if (chrome.runtime.lastError) {
            alert('Test failed: ' + chrome.runtime.lastError.message);
        } else if (response && response.success) {
            alert('API test successful! Summary: ' + response.summary.substring(0, 100) + '...');
        } else {
            alert('Test failed: ' + (response?.error || 'Unknown error'));
        }
        
        // Reset button
        testButton.textContent = originalText;
        testButton.disabled = false;
        testButton.style.background = '#28a745';
    });
}

// Manually inject summary button into current tab
function injectSummaryButton() {
    const injectButton = event.target;
    const originalText = injectButton.textContent;
    
    injectButton.textContent = 'Injecting...';
    injectButton.disabled = true;
    injectButton.style.background = '#ffc107';
    
    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            // Execute content script to inject the button
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: injectButtonCode
            }, (result) => {
                if (chrome.runtime.lastError) {
                    alert('Failed to inject button: ' + chrome.runtime.lastError.message);
                } else {
                    alert('Summary button injected successfully! Look for the blue button in the top-right corner of the page.');
                }
                
                // Reset button
                injectButton.textContent = originalText;
                injectButton.disabled = false;
                injectButton.style.background = '#17a2b8';
            });
        } else {
            alert('No active tab found');
            injectButton.textContent = originalText;
            injectButton.disabled = false;
            injectButton.style.background = '#17a2b8';
        }
    });
}

// Function to be injected into the page
function injectButtonCode() {
    // Check if button already exists
    if (document.getElementById('summary-generator-btn')) {
        console.log('Summary button already exists');
        return;
    }
    
    // Create the button
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
    button.addEventListener('click', async () => {
        const originalText = button.textContent;
        button.textContent = 'Generating...';
        button.disabled = true;
        button.style.background = '#f4b400';
        
        try {
            // Extract page content
            const content = extractPageContent();
            const title = document.title;
            const url = window.location.href;
            
            // Send message to background script
            const response = await chrome.runtime.sendMessage({
                action: 'generateSummary',
                data: { content, title, url }
            });
            
            if (response.success) {
                showSummaryModal(response.summary, title);
            } else {
                throw new Error(response.error || 'Failed to generate summary');
            }
        } catch (error) {
            console.error('Error generating summary:', error);
            alert('Failed to generate summary: ' + error.message);
        } finally {
            button.textContent = originalText;
            button.disabled = false;
            button.style.background = '#4285f4';
        }
    });
    
    // Add to page
    document.body.appendChild(button);
    console.log('Summary button injected manually');
    
    // Helper functions
    function extractPageContent() {
        const scripts = document.querySelectorAll('script, style, noscript, iframe, img, video, audio');
        scripts.forEach(el => el.remove());
        
        const contentSelectors = [
            'main', 'article', '.content', '.post-content', '.entry-content',
            '.article-content', '#content', '.main-content'
        ];
        
        let content = '';
        for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim().length > 100) {
                content = element.textContent;
                break;
            }
        }
        
        if (!content) {
            content = document.body.textContent;
        }
        
        return content
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .trim()
            .substring(0, 8000);
    }
    
    function showSummaryModal(summary, title) {
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
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }
}
