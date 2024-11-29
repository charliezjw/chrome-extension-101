// content.js

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
  let maxWord = null;

  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;

    // Keep track of the word with the highest frequency
    if (frequency[word] > maxFreq) {
      maxFreq = frequency[word];
      maxWord = word;
    }
  }

  return maxWord;
}

// Function to send the highest frequency word to the background script
function sendHighestFrequencyWord() {
  const highestFreqWord = getHighestFrequencyWord();
  chrome.runtime.sendMessage({ type: "updateWord", word: highestFreqWord });
}

// Initial calculation and sending of the highest frequency word
sendHighestFrequencyWord();

// Set up a MutationObserver to watch for changes in the body content
const observer = new MutationObserver(() => {
  // Debounce the updates to prevent excessive calculations
  if (observer.debouncing) return;
  observer.debouncing = true;
  setTimeout(() => {
    observer.debouncing = false;
    sendHighestFrequencyWord();
  }, 1000); // Adjust the delay as needed
});

// Start observing the body for changes in child nodes and subtree
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});
