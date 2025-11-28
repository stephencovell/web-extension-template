// Background service worker
// Runs in the background and handles extension events

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Initialize storage on first install
    chrome.storage.local.set({ todos: [] })
    console.log('Extension installed')
  }
})

// Example: Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'ping') {
    sendResponse({ status: 'ok' })
  }
  return true // Keep channel open for async response
})
