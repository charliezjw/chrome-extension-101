// background.js

// Function to inject content script into all existing tabs
function injectContentScriptIntoAllTabs() {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        // Exclude special tabs and only inject into http and https URLs
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
  