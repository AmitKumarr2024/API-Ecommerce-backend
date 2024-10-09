// Import the express framework for building web applications
import express from "express";
// Import controller functions for user operations
import {
  allUser,
  deleteUser,
  login,
  logout,
  signUp,
  userOne,
} from "./user.controller.js";
// Import JWT authentication middleware for protecting routes
import jwtAuth from "../../middleware/jwtAuth.js";

// Create a new router instance
const routes = new express.Router();

// Define a route for user signup
routes.post("/signup", signUp);

// Define a route for user login
routes.post("/login", login);

// Define a route for retrieving a single user's details by their ID
routes.get("/one-user/:id", userOne);

// Define a route for user logout, protected by JWT authentication
routes.post("/logout", jwtAuth, logout);

// Define a route for retrieving all users
routes.get("/all-user", allUser);

// Define a route for deleting a user by their ID
routes.delete("/delete/:id", deleteUser);

// Export the defined routes for use in other parts of the application
export default routes;
