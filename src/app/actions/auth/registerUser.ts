"use server";

import { dbConnect } from "@/src/lib/dbConnect";
import bcrypt from "bcryptjs"; 

// Define the payload type
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  try {
    const collection = await dbConnect("users"); // your MongoDB collection

    // validation: Check if email already exists
    const existingUser = await collection.findOne({ email: payload.email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    // Insert the new user
    const result = await collection.insertOne({
      name: payload.name,
      email: payload.email,
      password: hashedPassword, // store hashed password
      createdAt: new Date(),
    });

    console.log("User registered:", result.insertedId);

    // Convert ObjectId to string before returning
    return { success: true, id: result.insertedId.toString() };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Register error:", err.message);
      return { success: false, message: err.message };
    }
    console.error("Register error:", err);
    return { success: false, message: "Unknown error occurred" };
  }
};
