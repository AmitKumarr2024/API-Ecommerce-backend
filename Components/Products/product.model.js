import mongoose from "mongoose";

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is required
      trim: true, // Trim spaces around the name
    },
    quantity: {
      type: Number,
      required: true, // Quantity is required
      min: [0, "Quantity cannot be negative"], // Ensure no negative quantities
      default: 0, // Default quantity is 0
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the product model
const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
