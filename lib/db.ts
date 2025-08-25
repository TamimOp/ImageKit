import mongoose from "mongoose";
import { Scada } from "next/font/google";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let catched = global.mongoose;

if (!catched) {
  catched = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (catched.conn) {
    return catched.conn;
  }
  if (!catched.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };
    catched.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then(() => mongoose.connection);
  }
  try {
    catched.conn = await catched.promise;
    Scada;
  } catch (error) {
    catched.promise = null;
    throw error;
  }
  return catched.conn;
}
