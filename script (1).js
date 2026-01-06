let books = JSON.parse(localStorage.getItem("books")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

/* SAVE */
function saveData() {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("history", JSON.stringify(history));
}

/* TOAST */
function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.style.opacity = "1";
    setTimeout(() => t.style.opacity = "0", 2000);
}

/* ADD BOOK */
function addBook() {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value.trim();

    if (!title || !author || !category) {
        showToast("⚠️ Fill all fields");
        return;
    }

    books.push({
        id: Date.now(),
        title,
        author,
        category,
        borrowed: false
    });

    saveData();
    updateCategoryFilter();
    renderBooks();
    clearInputs();
    showToast("✅ Book Added");
}

/* CLEAR INPUTS */
function clearInputs() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("category").value = "";
}

/* RENDER BOOKS */
function renderBooks() {
    const list = document.getElementById("bookList");
    list.innerHTML = "";

    const search = document.getElementById("search").value.toLowerCase();
    const filter = document.getElementById("filterCategory").value;

    const filtered = books.filter(book => {
        return (
            (book.title.toLowerCase().includes(search) ||
             book.author.toLowerCase().includes(search)) &&
            (filter === "" || book.category === filter)
        );
    });

    if (filtered.length === 0) {
        list.innerHTML = "<p>No books found 📚</p>";
        return;
    }

    filtered.forEach(book => {
        const div = document.createElement("div");
        div.className = "book-card";
        div.innerHTML = `
            <span class="status ${book.borrowed ? "borrowed" : "available"}">
                ${book.borrowed ? "Borrowed" : "Available"}
            </span>
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
            <small>#${book.category}</small>
            <div class="actions">
                <button onclick="toggleBorrow(${book.id})">
                    ${book.borrowed ? "Return" : "Borrow"}
                </button>
                <button onclick="deleteBook(${book.id})">Delete</button>
            </div>
        `;
        list.appendChild(div);
    });
}

/* BORROW / RETURN */
function toggleBorrow(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    book.borrowed = !book.borrowed;

    history.push({
        text: `${book.title} ${book.borrowed ? "Borrowed" : "Returned"}`,
        time: new Date().toLocaleString()
    });

    saveData();
    renderBooks();
    renderHistory();
    showToast("📖 Status Updated");
}

/* DELETE */
function deleteBook(id) {
    books = books.filter(b => b.id !== id);
    saveData();
    renderBooks();
    showToast("🗑️ Book Deleted");
}

/* HISTORY */
function renderHistory() {
    const list = document.getElementById("historyList");
    list.innerHTML = "";

    history.slice().reverse().forEach(h => {
        const li = document.createElement("li");
        li.textContent = `${h.text} • ${h.time}`;
        list.appendChild(li);
    });
}

/* CATEGORY FILTER */
function updateCategoryFilter() {
    const filter = document.getElementById("filterCategory");
    const categories = [...new Set(books.map(b => b.category))];

    filter.innerHTML = `<option value="">All Categories</option>`;
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        filter.appendChild(option);
    });
}

/* INIT */
updateCategoryFilter();
renderBooks();
renderHistory();
