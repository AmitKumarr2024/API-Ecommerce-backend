import UserModel from "../Users/user.model.js";
import ProductModel from "./product.model.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Retrieve the session user ID from request parameters
    const sessionUserId = req.params.id;
    console.log("sessionUserId", sessionUserId);

    // Check if the user exists
    const userExist = await UserModel.findById(sessionUserId);

    // If the user does not exist, return a 404 response
    if (!userExist) {
      return res.status(404).json({
        message: "User not Found",
        error: true,
      });
    }

    // Check if the user has admin role
    if (userExist.role !== "admin") {
      return res.status(404).json({
        message: "Permission denied Please login with Admin",
        success: true,
      });
    }

    // Create a new product with the request body data
    const uploadProduct = new ProductModel(req.body);
    // Save the product to the database
    const saveProduct = await uploadProduct.save();

    // Return a response indicating the product was created successfully
    res.status(202).json({
      message: "Product Created",
      data: saveProduct,
      success: true,
    });
  } catch (error) {
    // Log the error and return a 500 response if an error occurs
    console.error("Error in ProductCreate controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all products
export const getAllProduct = async (req, res) => {
  try {
    // Retrieve all products from the database
    const allProduct = await ProductModel.find();

    // If no products are found, return a 401 response
    if (!allProduct) {
      return res.status(401).json({
        message: "No Product are available",
      });
    }

    // Return a successful response with all products
    res.status(200).json({
      message: "Request completed successfully",
      data: allProduct,
      success: true,
    });
  } catch (error) {
    // Log the error and return a 500 response if an error occurs
    console.error("Error in AllProduct controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  try {
    // Retrieve the product ID from request parameters
    const productId = req.params.id;

    // Check if the product exists
    const productExist = await ProductModel.findById(productId);

    // If the product does not exist, return a 200 response indicating not found
    if (!productExist) {
      return res.status(200).json({
        message: "Product not found",
        error: true,
      });
    }

    // Destructure request body to get updated product data
    const { ...resBody } = req.body;

    // Update the product with the new data
    const updateProduct = await ProductModel.findByIdAndUpdate(
      productId,
      resBody,
      {
        new: true, // Return the updated product
      }
    );

    // If no product was updated, return a 404 response
    if (!updateProduct) {
      return res.status(404).json({
        message: "No product found with provided ID",
        error: true,
        success: false,
      });
    }

    // Return a successful response with the updated product
    res.status(200).json({
      message: "Product updated successfully",
      data: updateProduct,
      success: true,
    });
  } catch (error) {
    // Log the error and return a 500 response if an error occurs
    console.error("Error in AllProduct controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    // Retrieve the product ID from request parameters
    const productId = req.params.id;

    // Check if the product exists and delete it
    const productExist = await ProductModel.findByIdAndDelete(productId);

    // If the product does not exist, return a 404 response
    if (!productExist) {
      return res.status(404).json({
        message: "Product is not available",
        error: true,
      });
    }

    // Return a successful response indicating the product was deleted
    res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    // Log the error and return a 500 response if an error occurs
    console.error("Error in AllProduct controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
