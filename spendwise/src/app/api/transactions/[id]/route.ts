
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { transactionSchema } from "@/lib/validations";
import Transaction from "@/models/Transaction";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET: Retrieve one transaction
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid transaction ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const transaction = await Transaction.findOne({
      _id: id,
      userId: user.userId,
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { transaction },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to retrieve transaction." },
      { status: 500 }
    );
  }
}

// PATCH: Update one transaction
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid transaction ID." },
        { status: 400 }
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

    const updateSchema = transactionSchema.partial();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Please check your transaction details.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updates = validation.data;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: "Provide at least one field to update." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
        userId: user.userId,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Transaction updated successfully.",
        transaction,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to update transaction." },
      { status: 500 }
    );
  }
}

// DELETE: Delete one transaction
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid transaction ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Transaction deleted successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to delete transaction." },
      { status: 500 }
    );
  }
}
