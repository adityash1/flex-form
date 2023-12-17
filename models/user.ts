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
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: "pending",
  },
});

let User: Model<any, {}>;

if (mongoose.models.User) {
  User = mongoose.model("User");
} else {
  User = mongoose.model("User", UserSchema);
}

export { User };
