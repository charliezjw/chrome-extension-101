// content.js

// Variable to store the highest frequency word
let highestFreqWord = null;

// Function to calculate the highest frequency word
function getHighestFrequencyWord() {
  // Get all the text content from the page
  const text = document.body.innerText || '';

  // Split text into words using a regular expression
  const words = text.toLowerCase().match(/\b\w+\b/g);
  if (!words) return null;

  // Count the frequency of each word
  const frequency = {};
  let maxFreq = 0;

  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;

    // Keep track of the word with the highest frequency
    if (frequency[word] > maxFreq) {
      maxFreq = frequency[word];
      highestFreqWord = word;
      maxFreq = frequency[word];
    }
  }

  return highestFreqWord;
}

// Function to update the highest frequency word
function updateHighestFrequencyWord() {
  highestFreqWord = getHighestFrequencyWord();
}

// Initial calculation of the highest frequency word
updateHighestFrequencyWord();

// Set up a MutationObserver to watch for changes in the body content
const observer = new MutationObserver(() => {
  // Debounce the updates to prevent excessive calculations
  if (observer.debouncing) return;
  observer.debouncing = true;
  setTimeout(() => {
    observer.debouncing = false;
    updateHighestFrequencyWord();
  }, 1000); // Adjust the delay as needed
});

// Start observing the body for changes in child nodes and subtree
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getHighestFreqWord') {
    sendResponse({ word: highestFreqWord });
  }
  // Return true to indicate that the response will be sent asynchronously
  return true;
});
