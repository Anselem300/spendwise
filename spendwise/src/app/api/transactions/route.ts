
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import connectToDatabase from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations";
import Transaction from "@/models/Transaction";

// GET: Retrieve all transactions belonging to the authenticated user.
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const userId = new Types.ObjectId(user.userId);

    const transactions = await Transaction.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction._id.toString(),
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }));

    return NextResponse.json(
      { transactions: formattedTransactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET transactions error:", error);

    return NextResponse.json(
      { message: "Unable to retrieve transactions." },
      { status: 500 }
    );
  }
}

// POST: Create an income or expense transaction.
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const validation = transactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Please check your transaction details.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const transaction = await Transaction.create({
      userId: new Types.ObjectId(user.userId),
      ...validation.data,
    });

    return NextResponse.json(
      {
        message: "Transaction created successfully.",
        transaction: {
          id: transaction._id.toString(),
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          category: transaction.category,
          date: transaction.date,
          createdAt: transaction.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST transaction error:", error);

    return NextResponse.json(
      { message: "Unable to create transaction." },
      { status: 500 }
    );
  }
}
