import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET() {
  try {
    await connect();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json({ success: true, data: transactions }, { status: 200 });
  } catch (error) {
    console.error("GET /transactions error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();
    const transaction = new Transaction(body);
    await transaction.save();
    return NextResponse.json({ success: true, data: transaction }, { status: 201 });
  } catch (error) {
    console.error("POST /transactions error:", error);
    return NextResponse.json({ success: false, error: "Failed to save transaction" }, { status: 500 });
  }
}
