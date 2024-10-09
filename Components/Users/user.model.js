import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
      validate: {
        validator: function (v) {
          return /.+@.+\..+/.test(v); // Checks for the "@" symbol and basic email format
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer"], // Restrict the role to admin or customer
      default: "customer", // Default role is customer
    },
  },
  { timestamps: true }
);

// Create the user model
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
