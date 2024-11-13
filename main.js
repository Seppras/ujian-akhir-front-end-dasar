const STORAGE_KEY = "BOOK_KEY";

function isStorageSupported() {
  return typeof Storage !== "undefined";
}

const addBookForm = document.getElementById("bookForm");
const searchBookForm = document.getElementById("searchBook");

addBookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = parseInt(document.getElementById("bookFormYear").value);
  const bookIsComplete = document.getElementById("bookFormIsComplete").checked;

  const bookId =
    document.getElementById("bookFormTitle").dataset.id ||
    Date.now().toString();

  const newBook = {
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: bookIsComplete,
  };

  let books = getBookshelf();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    books.push(newBook);
  } else {
    books[bookIndex] = newBook;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  clearForm();
  displayBooks(books);
});

function getBookshelf() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function displayBooks(books) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("bookItem");
    bookItem.dataset.bookid = book.id;
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    `;

    const actionButtons = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.innerText = book.isComplete ? "Belum Selesai" : "Selesai";
    toggleButton.style.backgroundColor = "#00c853";
    toggleButton.style.color = "white";
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus";
    deleteButton.style.backgroundColor = "#ff1744";
    deleteButton.style.color = "white";
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    actionButtons.append(toggleButton, deleteButton);
    bookItem.appendChild(actionButtons);

    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}

function toggleBookStatus(id) {
  let books = getBookshelf();
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    displayBooks(books);
  }
}

function deleteBook(id) {
  let books = getBookshelf();
  books = books.filter((book) => book.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  displayBooks(books);
}

function clearForm() {
  document.getElementById("bookFormTitle").value = "";
  document.getElementById("bookFormAuthor").value = "";
  document.getElementById("bookFormYear").value = "";
  document.getElementById("bookFormIsComplete").checked = false;
}

searchBookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = getBookshelf();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );
  displayBooks(filteredBooks);
});

window.addEventListener("load", function () {
  if (isStorageSupported()) {
    displayBooks(getBookshelf());
  } else {
    alert("Browser tidak mendukung penyimpanan lokal");
  }
});
