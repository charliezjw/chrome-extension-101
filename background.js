// background.js

// Object to store the highest frequency word for each tab
const tabWordMap = {};

// Function to inject content script into all existing tabs
function injectContentScriptIntoAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      // Exclude special tabs like chrome:// or about://
      if (tab.url && /^https?:\/\//.test(tab.url)) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js'],
        });
      }
    }
  });
}

// Inject content script when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  injectContentScriptIntoAllTabs();
});

// Inject content script when the service worker starts
chrome.runtime.onStartup.addListener(() => {
  injectContentScriptIntoAllTabs();
});

// Listen for messages from content scripts and the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateWord") {
    // Update the word for the specific tab
    const tabId = sender.tab.id;
    tabWordMap[tabId] = message.word;
  } else if (message.type === "getWordForTab") {
    // Send the word for the requested tab to the popup
    const tabId = message.tabId;
    const word = tabWordMap[tabId];
    sendResponse({ word: word });
  }
  // Return true to keep the message channel open for sendResponse
  return true;
});

// Clean up data when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabWordMap[tabId];
});
