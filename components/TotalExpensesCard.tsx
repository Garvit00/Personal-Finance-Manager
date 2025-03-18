"use client";

interface TotalExpensesCardProps {
  total: number;
}

export function TotalExpensesCard({ total }: TotalExpensesCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <h3 className="text-lg font-semibold text-gray-700">Total Expenses</h3>
    <p className="text-2xl font-bold text-blue-600 mt-2">₹ {total.toFixed(2)}</p>
  </div>
  );
}