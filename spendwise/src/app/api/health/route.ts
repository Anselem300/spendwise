
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";


export async function GET() {
  try {
    await connectToDatabase();

    return NextResponse.json({
      success: true,
      message: "SpendWise API is running and MongoDB is connected.",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed. Check server configuration.",
        database: "disconnected",
      },
      { status: 503 }
    );
  }
}
