import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import UserModel from "./user.model.js"; // Import User model for user data operations
import jwt from "jsonwebtoken"; // Import jsonwebtoken for generating tokens

// User signup function
export const signUp = async (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;
  try {
    // Check if a user with the given email already exists
    const UserExist = await UserModel.findOne({ email });

    // If the user already exists, return a 400 response
    if (UserExist) {
      return res.status(400).json({
        message: "User Exist already",
        false: true,
      });
    }

    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    const hashPassword = await bcrypt.hash(password, salt);

    // If password hashing fails, throw an error
    if (!hashPassword) {
      throw new Error("SomeThing went wrong");
    }

    // Prepare user data payload, including the hashed password
    const payload = {
      ...req.body,
      password: hashPassword,
    };

    // Create a new user instance with the payload data
    const userData = new UserModel(payload);

    // Save the new user to the database
    const saveUser = await userData.save();

    // Return a success response indicating the user was created
    res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    // Log any errors and return a 500 response if an error occurs
    console.error("Error in Signup controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// User login function
export const login = async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Check if a user with the given email exists
    const userExist = await UserModel.findOne({ email });

    // If the user does not exist, return a 400 response
    if (!userExist) {
      return res.status(400).json({
        message: "User Not Found!!",
        error: true,
      });
    }

    // Check password validity by comparing with the hashed password
    const isValidPassword = await bcrypt.compare(password, userExist.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Credentials " });
    }

    // Check if the user is already logged in by verifying the token from cookies
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        // If the decoded token ID matches the user's ID, return a response indicating they are already logged in
        if (decoded._id === userExist._id.toString()) {
          return res.status(400).json({ message: "You are already Logged in" });
        }
      } catch (err) {
        // Token is invalid or expired
        return res.status(400).json({
          message: "Invalid or expired token",
          error: err.message,
        });
      }
    }

    // Prepare token data for the user
    const tokenData = {
      _id: userExist._id,
      email: userExist.email,
    };

    // Generate a new token with the user data, set to expire in 24 hours
    const newToken = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: 24 * 60 * 60, // Token expiry set to 24 hours
    });

    // Determine if the environment is production for cookie settings
    const isProduction = process.env.NODE_ENV === "production";

    // Set cookie options
    const tokenOptions = {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: isProduction, // Secure cookies only in production
      sameSite: "strict", // Protects against CSRF attacks
    };

    // Set the cookie and respond with the token
    res.cookie("token", newToken, tokenOptions).status(200).json({
      message: "Login successful",
      data: newToken,
      success: true,
      error: false,
    });
  } catch (error) {
    // Log any errors and return a 500 response if an error occurs
    console.error("Error in Login controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch a single user by ID
export const userOne = async (req, res) => {
  try {
    // Check if userId is present in the request parameters
    if (!req.params.id) {
      return res.status(400).json({
        message: "User ID is missing",
        error: true,
      });
    }

    // Fetch user details from the database, excluding the password
    const user = await UserModel.findById(req.params.id).select("-password");

    // Check if the user exists
    if (!user) {
      console.error("User not found for ID:", req.userId);
      return res.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    // Send user details in response
    res.status(200).json({
      data: user,
      message: "User details retrieved successfully",
      success: true,
    });
  } catch (error) {
    // Log any errors and return a 500 response if an error occurs
    console.error("Error in userOne controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch all users
export const allUser = async (req, res) => {
  try {
    // Retrieve all users from the database
    const user = await UserModel.find();

    // If no users are found, return a 400 response
    if (!user) {
      return res.status(400).json({
        message: "No User available",
        data: [],
        error: true,
      });
    }

    // Return a successful response with all users
    res.status(200).json({
      message: "Request complete Successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    // Log any errors and return a 500 response if an error occurs
    console.error("Error in allUser controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    // Retrieve the user ID from request parameters
    const id = req.params.id;
    console.log("deleteId", id);

    // Delete the user from the database
    const deletedUser = await UserModel.findByIdAndDelete(id);

    // If the user is not found, return a 404 response
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found", error: true });
    }

    // Return a successful response indicating the user was deleted
    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    // Log any errors and return a 500 response if an error occurs
    console.error("Error in deleteUser controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout function to clear the user session
export const logout = async (req, res) => {
  try {
    // Clear the cookie named "token"
    res.clearCookie("token", {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent only over HTTPS in production
      sameSite: "strict", // Protects against CSRF attacks
      maxAge: 0, // Set the cookie's maxAge to 0 to expire it
      // Add domain option if necessary:
      // domain: process.env.COOKIE_DOMAIN || undefined, // Define this if you're using subdomains
    });

    // Log a message indicating successful logout
    console.log("User logged out successfully");

    // Send a success response
    res.status(200).json({ message: "Logout successfully", success: true });
  } catch (error) {
    // Log the error with a stack trace for better debugging
    console.error("Error in logout controller:", error);

    // Send an internal server error response
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
