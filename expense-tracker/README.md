# ExpenseFlow — Daily Expense Tracker

A modern, beginner-friendly expense tracker website built with **HTML5**, **CSS3**, and **Vanilla JavaScript**.
It runs fully in the browser, stores data in **LocalStorage**, and works offline after loading.

## Features

- Add income and expense transactions
- Category-based entries (Food, Shopping, Bills, Salary, Travel, Entertainment, Investment, Other)
- Live dashboard summary:
  - Total balance
  - Total income
  - Total expense
- Transaction history with:
  - Description
  - Category
  - Date/time
  - Amount
  - Income/expense badge
  - Delete action
- Search transactions by description or category
- Filter by All / Income / Expense
- CSV export for transactions
- Persistent data with LocalStorage
- Responsive fintech-style dark UI with glassmorphism
- Accessibility-friendly labels and semantic structure

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Media Queries, Animations)
- Vanilla JavaScript (ES6+)
- Browser LocalStorage API

## Installation

1. Download or clone this project.
2. Open the `expense-tracker` folder.
3. Double-click `index.html` (or open with Live Server).

No build tools or dependencies are required.

## Usage Guide

1. Fill in description, amount, type, and category.
2. Click **Add Transaction**.
3. View balance updates instantly on the dashboard.
4. Use search and filter tools to quickly find entries.
5. Delete unwanted transactions with the **Delete** button.
6. Export your records to CSV with **Export CSV**.

## Folder Structure

```txt
expense-tracker/
├── index.html
├── style.css
├── script.js
├── assets/
│   └── icons/
└── README.md
```

## Future Improvements

- Monthly analytics widgets
- Category-based charts
- Budget limit alerts
- Theme customization
- Progressive Web App (PWA) enhancements
