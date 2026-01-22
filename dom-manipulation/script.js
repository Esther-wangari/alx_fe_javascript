document.addEventListener('DOMContentLoaded', function () {

  // Load quotes from localStorage or use defaults
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal.", category: "Inspiration" },
    { text: "Talk is cheap. Show me the code.", category: "Programming" }
  ];

  // DOM elements
  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteBtn = document.getElementById('newQuote');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const exportBtn = document.getElementById('exportQuotes');
  const importFile = document.getElementById('importFile');

  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Show random quote
  function showRandomQuote() {
    quoteDisplay.innerHTML = "";

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Save last viewed quote in sessionStorage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));

    const quoteText = document.createElement('p');
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement('small');
    quoteCategory.textContent = `Category: ${quote.category}`;

    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
  }

  // Add new quote
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
      alert("Please enter both quote and category");
      return;
    }

    quotes.push({ text, category });
    saveQuotes();

    newQuoteText.value = "";
    newQuoteCategory.value = "";

    showRandomQuote();
  }

  // Export quotes to JSON file
  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  // Import quotes from JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();

    fileReader.onload = function (e) {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    };

    fileReader.readAsText(event.target.files[0]);
  }

  // Event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  addQuoteBtn.addEventListener('click', addQuote);
  exportBtn.addEventListener('click', exportQuotes);
  importFile.addEventListener('change', importFromJsonFile);

  // Load last viewed quote from sessionStorage if available
  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) {
    quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><small>Category: ${lastQuote.category}</small>`;
  } else {
    showRandomQuote();
  }
});
