import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { TotalExpensesCard } from "@/components/TotalExpensesCard";
import { RecentTransactionsCard } from "@/components/RecentTransactionsCard";
import { CategoryBreakdownCard } from "@/components/CategoryBreakdownCard";
import { BudgetVsActualChart } from "@/components/Budget/BudgetVsActualChart";
import BudgetModel, { Budget as BudgetType } from "@/models/Budget";
import { BudgetCard } from "@/components/Budget/BudgetCard";
import { BudgetForm } from "@/components/Budget/BudgetForm";

// Define the Transaction type
interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: "Food" | "Transport" | "Shopping" | "Bills" | "Other";
}
// Fetch transactions from the API
async function getTransactions(): Promise<Transaction[]> {
  const res = await fetch("http://localhost:3000/api/transactions", {
    cache: "no-store", // Ensure fresh data on every request
  });
  const json = await res.json()
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return json.data || [];
}

async function getBudgets(): Promise<BudgetType[]> {
  const res = await fetch("http://localhost:3000/api/budgets");
  if (!res.ok) throw new Error("Failed to fetch budgets");
  const budgets = await res.json();
  return budgets.data || [];
}


function calculateBudgetVsActual(transactions: Transaction[], budgets: BudgetType[]) {
  const categoryTotals: { [key: string]: { [key: string]: number } } = {};

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getUTCMonth() + 1;
    const transactionYear = transactionDate.getUTCFullYear();
    const key = `${transaction.category}-${transactionMonth}-${transactionYear}`;

    if (!categoryTotals[key]) {
      categoryTotals[key] = { actual: 0 };
    }
    categoryTotals[key].actual += transaction.amount;
  });

  return budgets.map((budget) => {
    const key = `${budget.category}-${budget.month}-${budget.year}`;

    return {
      category: budget.category,
      budget: budget.amount,
      actual: categoryTotals[key]?.actual || 0,
      month: budget.month,
      year: budget.year,
    };
  });
}




// Calculate monthly expenses for the chart
function calculateMonthlyExpenses(transactions: Transaction[]) {
  const monthlyTotals: { [key: string]: number } = {};

  transactions.forEach((transaction) => {
    const month = new Date(transaction.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0;
    }
    monthlyTotals[month] = (monthlyTotals[month] || 0) + transaction.amount;
  });

  return Object.keys(monthlyTotals).map((month) => ({
    month,
    total: monthlyTotals[month],
  }));
}

function calculateCategoryExpenses(transactions: Transaction[]) {
  const categoryTotals: { [key: string]: number } = {};

  transactions.forEach((transaction) => {
    const { category, amount } = transaction;
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += amount;
  });

  return Object.keys(categoryTotals).map((category) => ({
    name: category,
    value: categoryTotals[category],
  }));
}


export default async function TransactionsPage() {
  // Fetch transactions from the API
  const transactions = await getTransactions();
  const budgets = await getBudgets();
  
  const budgetVsActualData = calculateBudgetVsActual(transactions, budgets);

  // Calculate monthly expenses for the chart
  const monthlyExpenses = calculateMonthlyExpenses(transactions);
  const categoryExpenses = calculateCategoryExpenses(transactions);
  const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0);
  const recentTransactions = transactions.slice(0, 2);

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">Transactions</h1>

      {/* Transaction Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
        <TransactionForm />
      </div>
      
      {/* Budget form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Set Budget</h2>
        <BudgetForm />
      </div>

       {/* Budget Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets?.length > 0 ? (
        budgets.map((budget) => {
        return (<BudgetCard
        key={budget._id}
        category={budget.category}
        budget={budget.amount}
        transactions={transactions}
        month={budget.month}
        year={budget.year}
      />);
})) : (
      <p>No budget data available</p>
      )}
      </div>

       {/* Budget vs Actual Comparison Chart */}
       <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Budget vs Actual</h2>
        <BudgetVsActualChart data={budgetVsActualData} />
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TotalExpensesCard total={totalExpenses} />
        <CategoryBreakdownCard data={categoryExpenses} />
        <RecentTransactionsCard transactions={recentTransactions} />
      </div>

      {/* Monthly Expenses Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
        <MonthlyExpensesChart data={monthlyExpenses} />
      </div>
      {/* categorywise monthly expenses */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Category-wise Expenses</h2>
        <CategoryPieChart data={categoryExpenses} />
      </div>

      {/* Transaction List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Transactions List</h2>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}