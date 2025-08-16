// Background service worker for handling API calls

// You'll need to add your OpenAI API key here
// Get one from: https://platform.openai.com/api-keys
const OPENAI_API_KEY = 'PUT_YOUR_OPENAI_API_KEY_HERE';

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  if (request.action === 'ping') {
    // Handle ping from popup to check extension status
    sendResponse({ status: 'ok', message: 'Extension is running' });
    return true;
  }
  
  if (request.action === 'generateSummary') {
    generateSummary(request.data)
      .then(summary => {
        sendResponse({ success: true, summary });
      })
      .catch(error => {
        console.error('Error generating summary:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
  
  if (request.action === 'checkAPIKey') {
    // Handle API key check from popup
    const isValid = OPENAI_API_KEY && OPENAI_API_KEY.length > 20;
    sendResponse({ 
      valid: isValid, 
      configured: !!OPENAI_API_KEY,
      message: isValid ? 'API key is configured' : 'API key not configured'
    });
    return true;
  }
});

// Generate summary using OpenAI API
async function generateSummary(data) {
  if (!OPENAI_API_KEY) {
    throw new Error('Please add your OpenAI API key to the background.js file');
  }

  const { content, title, url } = data;

  // Prepare the prompt for summary generation
  const prompt = `Please provide a concise and informative summary of the following webpage content. Focus on the main points, key insights, and important information. Keep the summary clear and well-structured.

Webpage Title: ${title}
URL: ${url}

Content:
${content}

Summary:`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates clear, concise summaries of webpage content. Focus on extracting the most important information and presenting it in an organized manner.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    const summary = result.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error('No summary generated from API');
    }

    return summary;

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

// Alternative: Use a free summary service (fallback option)
async function generateSummaryFallback(data) {
  const { content, title } = data;
  
  // Simple extractive summarization using basic NLP techniques
  // This is a fallback when OpenAI API is not available
  
  // Split content into sentences
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Simple scoring based on word frequency and sentence position
  const wordFreq = {};
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  
  words.forEach(word => {
    if (word.length > 3) { // Skip short words
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  // Score sentences
  const sentenceScores = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
    const positionBonus = 1 / (index + 1); // Earlier sentences get bonus
    return { sentence: sentence.trim(), score: score + positionBonus };
  });
  
  // Sort by score and take top sentences
  sentenceScores.sort((a, b) => b.score - a.score);
  const topSentences = sentenceScores.slice(0, 3);
  
  // Create summary
  const summary = topSentences
    .map(item => item.sentence)
    .join('. ') + '.';
  
  return summary;
}

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Webpage Summary Generator extension installed');
  
  // Check if API key is configured
  if (!OPENAI_API_KEY) {
    console.warn('Please configure your OpenAI API key in background.js');
  } else {
    console.log('OpenAI API key is configured');
    // Test the API key with a simple request
    testAPIKey();
  }
});

// Test API key functionality
async function testAPIKey() {
  try {
    console.log('Testing API key...');
    const testData = {
      content: 'This is a test content to verify the API key is working correctly.',
      title: 'Test Page',
      url: 'https://example.com/test'
    };
    
    const summary = await generateSummary(testData);
    console.log('API key test successful:', summary.substring(0, 100) + '...');
  } catch (error) {
    console.error('API key test failed:', error.message);
  }
}
