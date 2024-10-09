import express from "express";
import dotenv from "dotenv";
import connectToMongoDB from "./Config/mongodb.js";
import swaggerUiExpress from "swagger-ui-express";
import apiDocs from "./swagger.json" assert { type: "json" };
import UserRoute from "./Components/Users/user.routes.js";
import ProductRoute from "./Components/Products/product.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express(); // Removed `new`
const PORT = process.env.PORT || 7010;

app.use(express.json());
// Use cookie-parser middleware
app.use(cookieParser());

// Setup Swagger UI for API documentation
// http://localhost:7002/api-docs/#/    enter
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(apiDocs));

app.use("/api/user/", UserRoute);
// product
app.use("/api/product/", ProductRoute);

// app.get("/", (req, res) => {
//   res.status(200).send("<h1>Hello Amit</h1>");
// });

app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
  connectToMongoDB();
});
