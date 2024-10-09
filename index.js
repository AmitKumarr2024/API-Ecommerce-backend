import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import the CORS package
import connectToMongoDB from "./Config/mongodb.js";
import swaggerUiExpress from "swagger-ui-express";
import apiDocs from "./swagger.json" assert { type: "json" };
import UserRoute from "./Components/Users/user.routes.js";
import ProductRoute from "./Components/Products/product.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 7010;

// Configure CORS options if needed
const corsOptions = {
  origin: "*", // Allows all origins, you can specify your frontend URL here
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

app.use(cors(corsOptions)); // Use the CORS middleware
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Setup Swagger UI for API documentation
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(apiDocs));

// Open access to user and product routes
app.use("/api/user/", UserRoute);
app.use("/api/product/", ProductRoute);

app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
  connectToMongoDB();
});
