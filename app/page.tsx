import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome to Personal Finance Visualizer</h1>

      <p className="mt-4">
        <Link href="/transactions" className="text-blue-500 underline">
          Go to Transactions
        </Link>
      </p>
    </div>
  );
}
