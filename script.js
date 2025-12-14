const STORAGE_KEY = "dynamic_quotes";
const SESSION_KEY = "last_viewed_quote";

// --------------------
// Application State
// --------------------
function loadQuotes() {
  const storedQuotes = localStorage.getItem(STORAGE_KEY);
  if (storedQuotes) {
    return JSON.parse(storedQuotes);
  }
  return [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Simplicity is the soul of efficiency.", category: "Programming" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" }
  ];
}

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}
let quotes = loadQuotes();
let selectedCategory = "All";


// --------------------
// DOM References
// --------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryContainer = document.getElementById("categoryContainer");
const addQuoteContainer = document.getElementById("addQuoteContainer");
const exportBtn = document.getElementById("exportQuotes");
const importInput = document.getElementById("importFile");



// --------------------
// Utility Functions
// --------------------


function getCategories() {
  const categories = quotes.map(q => q.category);
  return ["All", ...new Set(categories)];
}

// --------------------
// Display Random Quote
// --------------------
function showRandomQuote() {
  const filtered = selectedCategory === "All"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${quote.text}"`;

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(quote));
}


// --------------------
// Category Selector (Dynamic)
// --------------------
function restoreLastQuote() {
  const lastQuote = sessionStorage.getItem(SESSION_KEY);
  if (lastQuote) {
    quoteDisplay.textContent = `"${JSON.parse(lastQuote).text}"`;
  }
}
function getCategories() {
  return ["All", ...new Set(quotes.map(q => q.category))];
}

function renderCategories() {
  categoryContainer.innerHTML = "";

  const select = document.createElement("select");
  getCategories().forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  select.addEventListener("change", e => {
    selectedCategory = e.target.value;
    showRandomQuote();
  });

  categoryContainer.appendChild(select);
}

// --------------------
// Add Quote Form (Dynamic)
// --------------------
function createAddQuoteForm() {
  const textInput = document.createElement("input");
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.placeholder = "Enter quote category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";

  button.addEventListener("click", () => {
    if (!textInput.value || !categoryInput.value) return alert("Fill all fields");

    quotes.push({
      text: textInput.value.trim(),
      category: categoryInput.value.trim()
    });

    saveQuotes();
    renderCategories();
    showRandomQuote();

    textInput.value = "";
    categoryInput.value = "";
  });

  addQuoteContainer.append(textInput, categoryInput, button);
}
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
});

// --------------------
// Event Listeners
// --------------------
importInput.addEventListener("change", importFromJsonFile);

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      renderCategories();
      showRandomQuote();

      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing file");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

