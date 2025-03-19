"use client";
import {useState} from 'react';
import { Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';

interface Transaction{
  _id: string;
  category: string;
  amount: number;
  date: string;
}

interface BudgetCardProps {
    id: string;
    category: string;
    budget: number;
    transactions: Transaction[];
    month: number;
    year: number;
    onDelete: (id: string) => void;
  }
  
  

  export function BudgetCard({id, category, budget, transactions=[], month, year, onDelete}: BudgetCardProps) {

    const router = useRouter();
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

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id: string) => {
      setIsDeleting(true);
      onDelete(id);  // Update UI after delete
      try {
        const response = await fetch(`/api/budgets/${id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete budget");
        }
        
        router.refresh();  // 🔄 Automatically refresh page
        alert("Successfully deleted budget!")
      } catch (error) {
        console.error("Error deleting budget:", error);
      } finally {
        setIsDeleting(false);
      }
    };
  
    return (
      <div className="relative bg-white p-4 rounded-lg shadow-md">
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
        {/* Delete Button */}
        <button
        onClick={() => handleDelete(id)}
        className="absolute top-3 right-3 bg-white-500 text-black px-4 py-2 rounded-full hover:bg-gray-300 cursor-pointer transition duration-200"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <Trash2 className="w-5 h-5" />
        )}
      </button>
      </div>
    );
  }