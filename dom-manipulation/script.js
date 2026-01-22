document.addEventListener('DOMContentLoaded', function () {

  // Load quotes from localStorage or defaults
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
  const categoryFilter = document.getElementById('categoryFilter');
  const exportBtn = document.getElementById('exportQuotes');
  const importFile = document.getElementById('importFile');

  // Save quotes
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Populate category dropdown dynamically
  function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];

    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    // Restore last selected filter
    const savedFilter = localStorage.getItem('selectedCategory');
    if (savedFilter) {
      categoryFilter.value = savedFilter;
    }
  }

  // Display filtered quotes
  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);

    quoteDisplay.innerHTML = "";

    const filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
      quoteDisplay.textContent = "No quotes available for this category.";
      return;
    }

    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

    const p = document.createElement('p');
    p.textContent = `"${randomQuote.text}"`;

    const small = document.createElement('small');
    small.textContent = `Category: ${randomQuote.category}`;

    quoteDisplay.appendChild(p);
    quoteDisplay.appendChild(small);
  }

  // Add quote
  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
      alert("Please enter both quote and category");
      return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    filterQuotes();

    newQuoteText.value = "";
    newQuoteCategory.value = "";
  }

  // Export quotes
  function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  // Import quotes
  function importFromJsonFile(event) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes imported successfully!");
    };
    reader.readAsText(event.target.files[0]);
  }

  // Event listeners
  newQuoteBtn.addEventListener('click', filterQuotes);
  addQuoteBtn.addEventListener('click', addQuote);
  categoryFilter.addEventListener('change', filterQuotes);
  exportBtn.addEventListener('click', exportQuotes);
  importFile.addEventListener('change', importFromJsonFile);

  // Initial load
  populateCategories();
  filterQuotes();
});
