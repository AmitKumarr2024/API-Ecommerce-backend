import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("MongoDb connected successfully");
  } catch (error) {
    console.log("Error connecting to Mongodb: ", error);
  }
};

export default connectToMongoDB;
