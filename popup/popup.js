// popup/popup.js

document.addEventListener('DOMContentLoaded', () => {
    const wordList = document.getElementById('wordList');
  
    // Get all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        // Request the highest frequency word for each tab from the background script
        chrome.runtime.sendMessage({ type: "getWordForTab", tabId: tab.id }, (response) => {
          const word = response && response.word ? response.word : 'No words found';
  
          // Create a div to display the tab title and word
          const item = document.createElement('div');
          item.className = 'tab-item';
          item.innerHTML = `
            <div class="tab-title">${tab.title}</div>
            <div class="tab-word">${word}</div>
          `;
          wordList.appendChild(item);
        });
      });
    });
  });
  