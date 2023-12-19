import { User } from "@/models/user";
import { CompletePayment, isCurrentMonth } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function createUserAdmission(data: any) {
  const isItCurrentMonth = isCurrentMonth(data.month);
  const slot = isItCurrentMonth ?? data.slot;

  const user = new User({
    username: data.username.toLowerCase(),
    age: data.age,
    batch: {
      slot: data.slot,
      month: data.month,
      paymentStatus: "pending",
      hasBookedCurrentMonth: {
        booked: isItCurrentMonth,
        slot: slot,
      },
    },
  });

  try {
    await user.save();
  } catch (error) {
    throw error;
  }

  const paymentResult = await CompletePayment();

  // If payment fails, update the status or remove the data.
  if (!paymentResult.success) {
    // Option 1: Remove the data.
    // Option 2: Update the status.
    return NextResponse.json({ message: "Payment failed" }, { status: 500 });
  } else {
    try {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            "batch.paymentStatus": "successful",
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  return NextResponse.json({ status: 200 });
}

export async function updateBatchDetails(userToUpdate: any, data: any) {
  if (
    (isCurrentMonth(data.month) &&
      (!userToUpdate.batch.hasBookedCurrentMonth.booked ||
        userToUpdate.batch.hasBookedCurrentMonth.slot === data.slot)) ||
    !isCurrentMonth(data.month)
  ) {
    let updateData: { [key: string]: any } = {
      "batch.month": data.month,
      "batch.slot": data.slot,
    };

    if (
      isCurrentMonth(data.month) &&
      !userToUpdate.batch.hasBookedCurrentMonth.booked
    ) {
      updateData["batch.hasBookedCurrentMonth.booked"] = true;
      updateData["batch.hasBookedCurrentMonth.slot"] = data.slot;
    }

    try {
      await User.updateOne(
        { _id: userToUpdate._id },
        {
          $set: updateData,
        }
      );
    } catch (error) {
      throw error;
    }

    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.json(
      {
        error:
          "The slot for the current month cannot be updated. You can book any slot for next month or choose the same slot for current month",
      },
      { status: 400 }
    );
  }
}
