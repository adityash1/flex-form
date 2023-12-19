import mongoose, { Model } from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  batch: {
    paymentStatus: {
      type: String,
      default: "pending",
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    hasBookedCurrentMonth: {
      booked: {
        type: Boolean,
        required: true,
      },
      slot: {
        type: String,
      },
    },
  },
});

// we can refactor this
let User: Model<any, {}>;

if (mongoose.models.User) {
  User = mongoose.model("User");
} else {
  User = mongoose.model("User", UserSchema);
}

export { User };
