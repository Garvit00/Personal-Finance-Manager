import { NextResponse } from "next/server";
import connect from "@/lib/db";
import BudgetModel from "@/models/Budget";

// GET: Fetch all budgets
export async function GET() {
  await connect();
  try {
    const budgets = await BudgetModel.find();
    return NextResponse.json({ success: true, data: budgets }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

// POST: Create a new budget
export async function POST(request: Request) {
  await connect();
  try {
    const body = await request.json();
    const budget = new BudgetModel(body);
    if (!body.amount || !body.category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    
    await budget.save();
    return NextResponse.json({ success: true, data: budget }, { status: 201 });
  } catch (error) {
      console.error("POST /budgets error:", error);
      return NextResponse.json({ success: false, error: "Failed to save budget" }, { status: 500 });
  }
}

// PUT: Update a budget
export async function PUT(request: Request) {
  await connect();
  try {
    const { _id, ...updateData } = await request.json();
    const updatedBudget = await BudgetModel.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    return NextResponse.json(updatedBudget);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a budget
export async function DELETE(request: Request) {
  await connect();
  try {

    const { _id } = await request.json();
    if (!_id) {
      return NextResponse.json(
        { error: "Missing budget ID" },
        { status: 400 }
      );
    }

    const deletedBudget =  await BudgetModel.findByIdAndDelete(_id);

    if (!deletedBudget) {
      return NextResponse.json({ error: "Budget not found" },{ status: 404 });
    }

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 }
    );
  }
}