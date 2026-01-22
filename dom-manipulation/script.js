document.addEventListener('DOMContentLoaded', function () {

  const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Talk is cheap. Show me the code.", category: "Programming" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const syncStatus = document.getElementById('syncStatus');
  const manualSyncBtn = document.getElementById('manualSync');

  // Save locally
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Display random quote
  function showRandomQuote() {
    quoteDisplay.innerHTML = "";

    const random = quotes[Math.floor(Math.random() * quotes.length)];

    const p = document.createElement('p');
    p.textContent = `"${random.text}"`;

    const small = document.createElement('small');
    small.textContent = `Category: ${random.category}`;

    quoteDisplay.appendChild(p);
    quoteDisplay.appendChild(small);
  }

  // -------------------------------
  // SERVER SYNC LOGIC
  // -------------------------------

  async function fetchServerQuotes() {
    try {
      const response = await fetch(SERVER_URL);
      const data = await response.json();

      // Simulate server quotes
      const serverQuotes = data.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server"
      }));

      resolveConflicts(serverQuotes);

    } catch (error) {
      syncStatus.textContent = "⚠️ Server sync failed.";
    }
  }

  // Conflict resolution: SERVER WINS
  function resolveConflicts(serverQuotes) {
    const localTexts = quotes.map(q => q.text);

    let updated = false;

    serverQuotes.forEach(serverQuote => {
      if (!localTexts.includes(serverQuote.text)) {
        quotes.push(serverQuote);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      syncStatus.textContent = "🔄 Server updates synced. Conflicts resolved.";
      showRandomQuote();
    } else {
      syncStatus.textContent = "✅ Data already up to date.";
    }
  }

  // Periodic sync every 30 seconds
  setInterval(fetchServerQuotes, 30000);

  // Manual sync
  manualSyncBtn.addEventListener('click', fetchServerQuotes);

  // Initial load
  showRandomQuote();
});
