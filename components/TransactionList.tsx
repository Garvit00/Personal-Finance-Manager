"use client";

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
}

const formatDate = (date: string | number | Date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};



export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}