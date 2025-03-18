interface Transaction{
  _id: string;
  category: string;
  amount: number;
  date: string;
}

interface BudgetCardProps {
    category: string;
    budget: number;
    transactions: Transaction[];
    month: number;
    year: number;
  }
  
  

  export function BudgetCard({ category, budget, transactions=[], month, year }: BudgetCardProps) {
    const budgetAmount = Number(budget) || 0;
    const monthName = new Date(year, month - 1,1).toLocaleString("en-US", { month: "long" });

    const filteredTransactions = transactions.filter((tx) => {
      const transactionDate = new Date(tx.date);

      const transactionYear = transactionDate.getUTCFullYear();
      const transactionMonth = transactionDate.getUTCMonth() + 1;
      return transactionYear === year && transactionMonth === month && tx.category === category;
    });

    const actualAmount = filteredTransactions.reduce((acc, tx) => acc + Number(tx.amount.toFixed(2)), 0);
    const progress = budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;
  
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">{category} - {monthName} {year}</h3>
        <p className="text-gray-600">Budget: ₹ {budgetAmount.toFixed(2)}</p>
        <p className="text-gray-600">Actual: ₹ {actualAmount.toFixed(2)}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        {progress > 100 && (
          <p className="text-red-500 mt-2">You've exceeded your budget!</p>
        )}
      </div>
    );
  }