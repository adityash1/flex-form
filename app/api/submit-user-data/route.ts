import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/user";
import { createUserAdmission, updateBatchDetails } from "@/lib/user";
import { MongoError } from "mongodb";

export async function POST(req: Request) {
  await connectDB();

  try {
    const data = await req.json();
    const usernameLowercase = data.username.toLowerCase();
    const existingUser = await User.findOne({ username: usernameLowercase });

    if (existingUser) {
      return await updateBatchDetails(existingUser, data);
    } else {
      return await createUserAdmission(data);
    }
  } catch (error) {
    return handleError(
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

// we can implement proper error handling abstraction
async function handleError(error: Error) {
  if (error instanceof MongoError && error.code === 11000) {
    const keyValue = (error as any).keyValue;
    console.error("Duplicate key error:", error.message);
    return NextResponse.json(
      { error: "Duplicate Key Error", details: keyValue },
      { status: 409 }
    );
  } else if (error.name === "ValidationError") {
    console.error("Validation Error:", error.message);
    return NextResponse.json(
      { error: "Validation Error", details: error.message },
      { status: 400 }
    );
  } else {
    console.error("Error in submitting data: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
