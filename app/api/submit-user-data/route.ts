import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/user";
import { CompletePayment } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const user = new User({ ...data, paymentStatus: "pending" });
    try {
      await user.save();
    } catch (error) {
      console.error("Error in saving user data: ", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    const paymentResult = await CompletePayment(user);

    // If payment fails, update the status or remove the data.
    if (!paymentResult.success) {
      // Option 1: Remove the data.
      // await user.remove();

      // Option 2: Update the status.
      // user.status = 'failed';
      // await user.save();

      return NextResponse.json(
        { message: "Payment failed" },
        {
          status: 500,
        }
      );
    } else {
      user.paymentStatus = "succesful";
      user.save();
    }

    return NextResponse.json(user, {
      status: 200,
    });
  } catch (error) {
    console.error("Error in submitting data: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}
