import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Transaction from "@/models/Transaction";

// DELETE: Delete a tansaction
export async function DELETE(_: Request, context: { params: { id: string } }) {
    await connect();
    try {
      const { id } = await context.params;
      const deletedTransaction = await Transaction.findByIdAndDelete(id);
  
      if (!deletedTransaction) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Error deleting Transaction:", error);
      return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
  }