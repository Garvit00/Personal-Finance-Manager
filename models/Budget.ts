import mongoose from "mongoose";

// Define the Budget type
export interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

// Define the Mongoose schema
const budgetSchema = new mongoose.Schema({
  category: { type: String, required: true, enum: ["Food", "Transportation", "Entertainment", "Utilities", "Shopping", "Bills"] },
  amount: { type: Number, required: true, min: 0 },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
});

// Create the Mongoose model
const BudgetModel = mongoose.models.Budget || mongoose.model<Budget>("Budget", budgetSchema);

export default BudgetModel;