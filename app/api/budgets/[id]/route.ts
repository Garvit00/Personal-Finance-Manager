import { NextResponse } from "next/server";
import connect from "@/lib/db";
import BudgetModel from "@/models/Budget";


// GET /api/budgets/:id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connect();
  try {
    const { id } = params;
    const budget = await BudgetModel.findById(id);

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(budget, { status: 200 });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json({ error: "Failed to fetch budget" }, { status: 500 });
  }
}

// PUT /api/budgets/:id → Update a specific budget by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connect();
  try {
    const { id } = params;
    const data = await req.json();
    const updatedBudget = await BudgetModel.findByIdAndUpdate(id, data, { new: true });

    if (!updatedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBudget, { status: 200 });
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
  }
}


// DELETE: Delete a budget
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connect();
  try {
    const id = params?.id;
    const deletedBudget = await BudgetModel.findByIdAndDelete(id);

    if (!deletedBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}