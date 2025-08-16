# Webpage Summary Generator - Chrome Extension

A powerful Chrome extension that generates intelligent summaries of any webpage content with a single click. Perfect for quickly understanding long articles, research papers, or any web content.

## ✨ Features

- **One-Click Summarization**: Click the "Generate Summary" button on any webpage
- **AI-Powered**: Uses OpenAI's GPT-3.5-turbo for intelligent, contextual summaries
- **Smart Content Extraction**: Automatically identifies and extracts main content from webpages
- **Beautiful UI**: Modern, responsive interface with smooth animations
- **Cross-Platform**: Works on any website with readable content
- **Privacy-Focused**: Content is processed securely through OpenAI's API

## 🚀 Installation

### Method 1: Load Unpacked Extension (Recommended for Development)

1. **Download/Clone** this repository to your local machine
2. **Get OpenAI API Key**:
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (you'll need it in the next step)

3. **Configure API Key**:
   - Open `background.js` in a text editor
   - Replace `YOUR_OPENAI_API_KEY_HERE` with your actual API key
   - Save the file

4. **Load Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the folder containing this extension
   - The extension should now appear in your extensions list

5. **Pin Extension** (Optional):
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Webpage Summary Generator" and click the pin icon

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store for easy installation.

## 📖 How to Use

1. **Navigate** to any webpage you want to summarize
2. **Look for the blue "Generate Summary" button** in the top-right corner
3. **Click the button** and wait for the AI to process the content
4. **Read your summary** in the beautiful popup modal
5. **Close the modal** by clicking the × button or clicking outside

## 🔧 Configuration

### API Key Setup

The extension requires an OpenAI API key to function. Here's how to set it up:

1. **Get API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Edit File**: Open `background.js` in a text editor
3. **Replace Placeholder**: Change this line:
   ```javascript
   const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';
   ```
   To:
   ```javascript
   const OPENAI_API_KEY = 'sk-your-actual-api-key-here';
   ```
4. **Reload Extension**: Go to `chrome://extensions/` and click the reload button

### Cost Considerations

- **Free Tier**: OpenAI offers $5 free credit for new users
- **Pricing**: After free tier, costs ~$0.002 per 1K tokens
- **Typical Usage**: A webpage summary costs approximately $0.01-0.05

## 🏗️ Technical Details

### Architecture

- **Content Script** (`content.js`): Injects UI elements and extracts webpage content
- **Background Script** (`background.js`): Handles API calls and message passing
- **Popup** (`popup.html/js/css`): Extension management interface
- **Manifest** (`manifest.json`): Extension configuration and permissions

### Content Extraction

The extension uses intelligent content extraction:
- Prioritizes semantic HTML elements (`<main>`, `<article>`, `.content`)
- Removes navigation, ads, and other non-content elements
- Limits content to 8000 characters for optimal API performance
- Falls back to body content if no main content area is found

### API Integration

- **Model**: GPT-3.5-turbo (optimal balance of quality and cost)
- **Max Tokens**: 500 (sufficient for concise summaries)
- **Temperature**: 0.7 (balanced creativity and consistency)

## 🐛 Troubleshooting

### Common Issues

1. **Button Not Appearing**:
   - Check if extension is enabled in `chrome://extensions/`
   - Reload the webpage
   - Ensure the extension has necessary permissions

2. **API Errors**:
   - Verify your OpenAI API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure the API key has proper permissions

3. **Content Not Extracted**:
   - Some websites may block content extraction
   - Try on different types of websites
   - Check browser console for error messages

### Debug Mode

1. **Open Developer Tools**: Right-click → Inspect
2. **Check Console**: Look for error messages
3. **Check Network Tab**: Verify API calls are being made

## 🔒 Privacy & Security

- **No Data Storage**: The extension doesn't store any webpage content
- **Secure API**: All communication with OpenAI is encrypted (HTTPS)
- **Local Processing**: Content extraction happens locally in your browser
- **API Limits**: OpenAI has strict data usage policies and retention limits

## 🚧 Limitations

- **Content Length**: Very long articles may be truncated
- **Complex Layouts**: Some websites with complex layouts may not extract perfectly
- **Dynamic Content**: JavaScript-heavy sites may require page reload
- **API Dependencies**: Requires active internet connection and OpenAI API access

## 🤝 Contributing

Contributions are welcome! Here are some areas for improvement:

- **Better Content Extraction**: Improve algorithms for different website types
- **Alternative APIs**: Add support for other summarization services
- **UI Enhancements**: Improve the user interface and experience
- **Performance**: Optimize content processing and API calls
- **Local Summarization**: Add offline summarization capabilities

### Development Setup

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT API
- **Chrome Extensions Team** for the excellent documentation
- **Open Source Community** for inspiration and tools

## 📞 Support

If you encounter issues or have questions:

1. **Check** the troubleshooting section above
2. **Search** existing GitHub issues
3. **Create** a new issue with detailed information
4. **Include** browser version, extension version, and error messages

---

**Happy Summarizing! 📚✨**
