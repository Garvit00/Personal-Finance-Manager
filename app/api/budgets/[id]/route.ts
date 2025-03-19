import { NextResponse } from "next/server";
import connect from "@/lib/db";
import BudgetModel from "@/models/Budget";


// DELETE: Delete a budget
export async function DELETE(_: Request, context: { params: { id: string } }) {
  await connect();
  try {
    const { id } = await context.params;
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