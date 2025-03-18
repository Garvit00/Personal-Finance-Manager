import mongoose, { Schema, Document } from "mongoose";

// Define TypeScript Interface
export interface ITransaction extends Document {
  amount: number;
  date: Date;
  description?: string;
  category: "Food" | "Transportation" | "Entertainment" | "Utilities" | "Shopping" | "Bills" | "Other";
}

const transactionSchema = new Schema<ITransaction>({
  amount: {
    type: Number,
    required: true, // Fixed typo: require → required
    min: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Fixed: Use function reference instead of calling it immediately
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String, 
    required: true, 
    enum: ["Food", "Transportation", "Entertainment", "Utilities", "Shopping", "Bills"] 
  },
});

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>("transactions", transactionSchema);

export default Transaction;
