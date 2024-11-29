// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const wordList = document.getElementById('wordList');
  
    // Get all tabs with URLs matching http or https
    chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] }, (tabs) => {
      tabs.forEach((tab) => {
        // Send a message to the content script in each tab
        chrome.tabs.sendMessage(
          tab.id,
          { type: 'getHighestFreqWord' },
          (response) => {
            let word = 'No words found';
            if (chrome.runtime.lastError) {
              // Optionally handle the error
              // console.warn(`Cannot access tab ${tab.id}: ${chrome.runtime.lastError.message}`);
            } else if (response && response.word) {
              word = response.word;
            }
  
            // Create a div to display the tab title and word
            const item = document.createElement('div');
            item.className = 'tab-item';
            item.innerHTML = `
              <div class="tab-title">${tab.title}</div>
              <div class="tab-word">${word}</div>
            `;
            wordList.appendChild(item);
          }
        );
      });
    });
  });
  