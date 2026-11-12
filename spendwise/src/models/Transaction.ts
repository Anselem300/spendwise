
import mongoose, { Schema, models, model, Types } from "mongoose";

export interface ITransaction {
  userId: Types.ObjectId;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

TransactionSchema.index({ userId: 1, date: -1 });

const Transaction =
  models.Transaction ||
  model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
