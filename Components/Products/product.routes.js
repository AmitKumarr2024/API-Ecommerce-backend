// Import the express framework for building web applications
import express from "express";
// Import controller functions for product operations
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "./product.controller.js";

// Create a new router instance
const routes = new express.Router();

// Define a route for creating a product with the specified user ID
routes.post("/create/:id", createProduct);

// Define a route for retrieving all products
routes.get("/all-product", getAllProduct);

// Define a route for updating a product by its ID
routes.post("/update-product/:id", updateProduct);

// Define a route for deleting a product by its ID
routes.delete("/delete-product/:id", deleteProduct);

// Export the defined routes for use in other parts of the application
export default routes;

