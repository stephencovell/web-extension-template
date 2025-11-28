// Content script
// Runs on web pages matching the manifest's content_scripts patterns

// Example: Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'getPageInfo') {
    sendResponse({
      title: document.title,
      url: window.location.href
    })
  }
  return true
})

console.log('Content script loaded')
