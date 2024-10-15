import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Stating up...");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not found!");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not found!");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongo db!");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => console.log("Auth server is listening on port 3000!"));
};

start();
