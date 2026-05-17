(() => {
  const STORAGE_KEY = "expenseTracker.transactions.v1";

  const form = document.getElementById("transactionForm");
  const message = document.getElementById("formMessage");
  const list = document.getElementById("transactionList");
  const searchInput = document.getElementById("search");
  const filterSelect = document.getElementById("filter");
  const exportBtn = document.getElementById("exportCsv");

  const balanceEl = document.getElementById("totalBalance");
  const incomeEl = document.getElementById("totalIncome");
  const expenseEl = document.getElementById("totalExpense");

  let transactions = [];

  const formatCurrency = value =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  };

  const loadTransactions = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      transactions = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(transactions)) transactions = [];
    } catch (error) {
      transactions = [];
      message.textContent = "Saved data could not be read. Starting fresh.";
    }
  };

  const updateBalance = () => {
    const totals = transactions.reduce(
      (acc, tx) => {
        if (tx.type === "income") acc.income += tx.amount;
        if (tx.type === "expense") acc.expense += tx.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    const balance = totals.income - totals.expense;
    incomeEl.textContent = formatCurrency(totals.income);
    expenseEl.textContent = formatCurrency(totals.expense);
    balanceEl.textContent = formatCurrency(balance);
  };

  const getFilteredTransactions = () => {
    const term = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;

    return transactions.filter(tx => {
      const matchesSearch =
        tx.description.toLowerCase().includes(term) || tx.category.toLowerCase().includes(term);
      const matchesFilter = filter === "all" ? true : tx.type === filter;
      return matchesSearch && matchesFilter;
    });
  };

  const renderTransactions = () => {
    const filtered = getFilteredTransactions().sort((a, b) => b.createdAt - a.createdAt);

    if (!filtered.length) {
      list.innerHTML = '<li class="transaction-item">No transactions found.</li>';
      return;
    }

    list.innerHTML = filtered
      .map(tx => {
        const amountSign = tx.type === "income" ? "+" : "-";
        const badgeClass = tx.type === "income" ? "badge-income" : "badge-expense";
        const created = new Date(tx.createdAt).toLocaleString();

        return `
          <li class="transaction-item ${tx.type}">
            <div>
              <strong>${tx.description}</strong>
              <div class="tx-meta">${tx.category} • ${created}</div>
            </div>
            <div>
              <div class="tx-amount">${amountSign}${formatCurrency(tx.amount)}</div>
              <span class="badge ${badgeClass}">${tx.type}</span>
              <button class="delete-btn" data-id="${tx.id}" aria-label="Delete ${tx.description}">Delete</button>
            </div>
          </li>`;
      })
      .join("");
  };

  const addTransaction = formData => {
    const description = formData.get("description")?.trim();
    const amount = Number(formData.get("amount"));
    const type = formData.get("type");
    const category = formData.get("category");

    if (!description || !amount || amount <= 0 || !type || !category) {
      message.textContent = "Please fill all fields and enter an amount greater than 0.";
      return;
    }

    const transaction = {
      id: crypto.randomUUID(),
      description,
      amount,
      type,
      category,
      createdAt: Date.now()
    };

    transactions.push(transaction);
    saveToLocalStorage();
    updateBalance();
    renderTransactions();

    form.reset();
    message.textContent = "Transaction added successfully.";
  };

  const deleteTransaction = id => {
    transactions = transactions.filter(tx => tx.id !== id);
    saveToLocalStorage();
    updateBalance();
    renderTransactions();
  };

  const exportToCsv = () => {
    if (!transactions.length) {
      message.textContent = "No transactions available to export.";
      return;
    }

    const headers = ["Description", "Amount", "Type", "Category", "DateTime"];
    const rows = transactions.map(tx => [
      tx.description,
      tx.amount,
      tx.type,
      tx.category,
      new Date(tx.createdAt).toISOString()
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
    URL.revokeObjectURL(url);

    message.textContent = "CSV exported successfully.";
  };

  form.addEventListener("submit", event => {
    event.preventDefault();
    addTransaction(new FormData(form));
  });

  list.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.classList.contains("delete-btn")) {
      const id = target.dataset.id;
      if (id) deleteTransaction(id);
    }
  });

  searchInput.addEventListener("input", renderTransactions);
  filterSelect.addEventListener("change", renderTransactions);
  exportBtn.addEventListener("click", exportToCsv);

  loadTransactions();
  updateBalance();
  renderTransactions();
})();
