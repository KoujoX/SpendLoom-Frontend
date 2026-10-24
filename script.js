const tipsButton = document.getElementById("tips-button");
const tipsMessage = document.getElementById("tips-message");

tipsButton.addEventListener("click", function(){
    tipsMessage.textContent = "Your personalised AI tips will be available here soon.";
    tipsButton.textContent = "Tips coming soon";
});

//EXPENSE FORM---------
const expenseForm = document.getElementById("expense-form");
const transactionList = document.getElementById("transaction-list");
const formMessage = document.getElementById("form-message");
const monthlySpending = document.getElementById("monthly-spending");

let transactions = [];

expenseForm.addEventListener("submit", function(event) {
    //Preventing the page from refreshing
    event.preventDefault();

    const name = document.getElementById("expense-name").value.trim();
    const amount = Number(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;

    if (!name || !Number.isFinite(amount) || amount <= 0 || !category){
        formMessage.textContent = "Please enter valid expense details";
        return;
    }

    //Creating an expense object with info about one transaction
    const expense = {
        name: name,
        amount: amount,
        category: category,
        date: new Date().toLocaleDateString("en-GB")
    };

    //Storing the transaction
    transactions.unshift(expense);
    const totalSpent = transactions.reduce(function (total, expense) {
        return total + expense.amount;
    }, 0);
    monthlySpending.textContent = "£" + totalSpent.toFixed(2);
    

    //Displaying the transaction
    renderTransactions();

    formMessage.textContent = "Expense added successfully!";
    expenseForm.reset();
});

function renderTransactions(){
    transactionList.replaceChildren();

    transactions.forEach(function (expense) {
        const row = document.createElement("div");
        row.className = "transaction";

        const details = document.createElement("div");

        const name = document.createElement("p");
        name.className = "transaction-name";
        name.textContent = expense.name;

        const info = document.createElement("p");
        info.classname = "transaction-details";
        info.textContent = expense.category + " - " + expense.date;

        const amount = document.createElement("span");
        amount.className = "transaction-amount";
        amount.textContent = "-£" + expense.amount.toFixed(2);

        details.append(name, info);
        row.append(details, amount);
        transactionList.appendChild(row);
    });

    if (transactions.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.classname = "muted";
        emptyMessage.textContent = "No transactions added yet.";
        transactionList.appendChild(emptyMessage);
    }

    const categoryTotals = {
        Food: 0,
        Transport: 0,
        Shopping: 0,
        Entertainment: 0,
        Bills: 0,
        Other: 0
    };

    transactions.forEach(function (expense) {
        if (categoryTotals[expense.category] !== undefined) {
            categoryTotals[expense.category] += expense.amount;
        }
    });

    document.getElementById("food-total").textContent = "£" + categoryTotals.Food.toFixed(2);         
    document.getElementById("transport-total").textContent = "£" + categoryTotals.Transport.toFixed(2);
    document.getElementById("shopping-total").textContent = "£" + categoryTotals.Shopping.toFixed(2);
    document.getElementById("entertainment-total").textContent = "£" + categoryTotals.Entertainment.toFixed(2);
    document.getElementById("bills-total").textContent = "£" + categoryTotals.Bills.toFixed(2);
    document.getElementById("other-total").textContent = "£" + categoryTotals.Other.toFixed(2);
}
