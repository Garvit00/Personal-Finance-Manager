"use client";

interface RecentTransactionsCardProps {
  transactions: { date: string; description: string; amount: number }[];
}

export function RecentTransactionsCard({ transactions }: RecentTransactionsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>
      <ul className="space-y-2">
        {transactions.map((transaction, index) => (
          <li key={index} className="flex justify-between">
            <span className="text-gray-600">{transaction.description}</span>
            <span className="font-medium text-gray-800">₹ {transaction.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}