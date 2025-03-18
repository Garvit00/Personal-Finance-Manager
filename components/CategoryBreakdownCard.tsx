"use client";

interface CategoryBreakdownCardProps {
  data: { name: string; value: number }[];
}

export function CategoryBreakdownCard({ data }: CategoryBreakdownCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Category Breakdown</h3>
      <ul className="space-y-2">
        {data.map((category) => (
          <li key={category.name} className="flex justify-between">
            <span className="text-gray-600">{category.name}</span>
            <span className="font-medium text-gray-800">₹ {category.value.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}