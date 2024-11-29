// content.js

// Variable to store the highest frequency word
let highestFreqWord = null;

// // Function to calculate the highest frequency word
// function getHighestFrequencyWord() {
//   // Get all the text content from the page
//   const text = document.body.innerText || '';

//   // Split text into words using a regular expression
//   const words = text.toLowerCase().match(/\b\w+\b/g);
//   if (!words) return null;

//   // Count the frequency of each word
//   const frequency = {};
//   let maxFreq = 0;

//   for (const word of words) {
//     frequency[word] = (frequency[word] || 0) + 1;

//     // Keep track of the word with the highest frequency
//     if (frequency[word] > maxFreq) {
//       maxFreq = frequency[word];
//       highestFreqWord = word;
//       maxFreq = frequency[word];
//     }
//   }

//   return highestFreqWord;
// }
const otMeta = document.createElement('meta');
otMeta.httpEquiv = 'origin-trial';
otMeta.content = 'AgFY1Vi21ZJujH5YOTfwtSZP57j/j8zNRfil7n6qVyvQ5ZZZfyYCxwtMZVuVnIrWFfjSgJfJuk6EQ1PaXqcTVQsAAABzeyJvcmlnaW4iOiJjaHJvbWUtZXh0ZW5zaW9uOi8vZmtwYmFiYmlhbGNqbnBqamZwbmFraHBhYWZja2phbmUiLCJmZWF0dXJlIjoiQUlTdW1tYXJpemF0aW9uQVBJIiwiZXhwaXJ5IjoxNzUzMTQyNDAwfQ==';
document.head.append(otMeta);

// Function to generate a summary of the page
async function getPageSummary() {
  if ('ai' in self && 'summarizer' in self.ai) {
    const options = {
      type: 'tl;dr',
      format: 'markdown',
      length: 'medium',
    };

    const available = (await self.ai.summarizer.capabilities()).available;
    let summarizer;
    if (available === 'no') {
      // The Summarizer API isn't usable.
      console.error('Summarizer API is not usable for this browser');
      return;
    }
    if (available === 'readily') {
      // The Summarizer API can be used immediately .
      summarizer = await self.ai.summarizer.create(options);
      const longText = document.body.innerText || '';
      const summary = await summarizer.summarize(longText);
      return summary;
    } else {
      // The Summarizer API can be used after the model is downloaded.
      summarizer = await self.ai.summarizer.create(options);
      summarizer.addEventListener('downloadprogress', (e) => {
        console.log(e.loaded, e.total);
      });
      await summarizer.ready;
    }

    // Old code
    // The Summarizer API is supported.
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
  } else {
    console.error('Summarizer API is not supported in this context');
    return null;
  }
}

// Function to update the highest frequency word
function updateHighestFrequencyWord() {
  highestFreqWord = getPageSummary();
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
