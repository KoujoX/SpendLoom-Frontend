const tipsButton = document.getElementById("tips-button");
const tipsMessage = document.getElementById("tips-message");

tipsButton.addEventListener("click", function(){
    tipsMessage.textContent = "Your personalised AI tips will be available here soon.";
    tipsButton.textContent = "Tips coming soon";
});

const startingBalance = 420;
const upcomingBillsTotal = 180;
const daysUntilNextPayment = 14;

function updateSummary(){
    const totalSpent = transactions.reduce(function (total, expense) {
        return total + expense.amount;
    }, 0);
    document.getElementById("monthly-spending").textContent = "£" + totalSpent.toFixed(2)

    const availableBalance = startingBalance - totalSpent;
    const moneyAfterBills = availableBalance - upcomingBillsTotal;
    const safeToSpend = Math.max(0, moneyAfterBills / daysUntilNextPayment);
    const balanceWarning = document.getElementById("balance-warning");

    if (moneyAfterBills < 0) {
        balanceWarning.textContent = "Warning: you're short of money for your upcoming bills.";
    } else if (moneyAfterBills < 50) {
        balanceWarning.textContent = "Careful: you have less than £50 left after upcoming bills.";
    } else {
        balanceWarning.textContent = "";
    }

    document.getElementById("available-balance").textContent = "£" + availableBalance.toFixed(2);
    document.getElementById("safe-to-spend").textContent = "£" + safeToSpend.toFixed(2);
}

//EXPENSE FORM---------
const monthlySpending = document.getElementById("monthly-spending");
const expenseForm = document.getElementById("expense-form");
const transactionList = document.getElementById("transaction-list");
const formMessage = document.getElementById("form-message");

expenseForm.addEventListener("input", function () {
    formMessage.textContent = "";
})

//Creating a local storage 
let transactions = JSON.parse(
    localStorage.getItem("spendloom-transactions")
) || [];

expenseForm.addEventListener("submit", function(event) {
    //Preventing the page from refreshing
    event.preventDefault();

    const name = document.getElementById("expense-name").value.trim();
    const amount = Number(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;

    if (!name || !Number.isFinite(amount) || amount <= 0 || !category){
        formMessage.className = "muted error";
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
    localStorage.setItem("spendloom-transactions", JSON.stringify(transactions));

    //Updating  the financial figures
    updateSummary();
    //Displaying the transaction
    renderTransactions();

    formMessage.className = "muted success";
    formMessage.textContent = "Expense added successfully!";
    expenseForm.reset();
});

function renderTransactions(){
    transactionList.replaceChildren();

    transactions.forEach(function (expense) {
        const row = document.createElement("div");
        row.className = "transaction";

        const details = document.createElement("div");
        details.className = "transaction-info";

        const name = document.createElement("p");
        name.className = "transaction-name";
        name.textContent = expense.name;

        const info = document.createElement("p");
        info.classname = "transaction-details";
        info.textContent = expense.category + " - " + expense.date;

        const amount = document.createElement("span");
        amount.className = "transaction-amount";
        amount.textContent = "-£" + expense.amount.toFixed(2);
        //Option to delete an expense
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            transactions = transactions.filter(function (item) {
                return item !== expense;
            });

            localStorage.setItem("spendloom-transactions", JSON.stringify(transactions));

            renderTransactions();
            updateSummary();
        });

        details.append(name, info);
        const transactionMain = document.createElement("div");
        transactionMain.className = "transaction-main";
        transactionMain.append(details, amount);

        row.append(transactionMain, deleteButton);
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


//DISPLAY THE SAVED EXPENSES ON PAGE LOAD
renderTransactions();
updateSummary();