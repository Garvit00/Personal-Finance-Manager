"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BudgetVsActualData {
  category: string;
  budget: number;
  actual: number;
  month: number;
  year: number;
}

interface BudgetVsActualChartProps {
  data: BudgetVsActualData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { category, budget, actual, month, year } = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
        <strong>{new Date(year, month - 1).toLocaleString("en-US", { month: "long" })} {year}</strong>
        <p>Budget: ₹ {budget}</p>
        <p>Actual: ₹ {actual}</p>
      </div>
    );
  }
  return null;
};

export function BudgetVsActualChart({ data }: BudgetVsActualChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip content={<CustomTooltip />}/>
        <Legend />
        <Bar dataKey="budget" fill="#8884d8" name="Budget" />
        <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
      </BarChart>
    </ResponsiveContainer>
  );
}