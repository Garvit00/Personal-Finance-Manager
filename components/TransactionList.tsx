"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const formatDate = (date: string | number | Date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};



export function TransactionList({transactions, onDelete }: TransactionListProps) {

  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    onDelete(id);  // Update UI after delete
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }
      
      router.refresh();  // 🔄 Automatically refresh page
      alert("Transaction Deleted!!")
    } catch (error) {
      console.error("Error deleting Transaction:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction._id}>
            <TableCell>
              {formatDate(transaction.date)}
            </TableCell>
            <TableCell>₹ {transaction.amount.toFixed(2)}</TableCell>
            <TableCell>{transaction.category}</TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>
              <button 
              onClick={() => handleDelete(transaction._id)}
              className="bg-white-500 text-black rounded-full hover:bg-gray-300 cursor-pointer transition duration-200"
              disabled={deletingId === transaction._id}
              >
                {deletingId === transaction._id ? (
                  <span className="animate-spin">⌛</span>
                ) : (
                  <Trash2 className="w-5 h-5"/>
                )}
                </button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}