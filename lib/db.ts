import mongoose from "mongoose";

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
    mongoose.connect(MONGODB_URI).then(() => mongoose.connection);
  }
  try {
    catched.conn = await catched.promise;
  } catch (error) {
    catched.promise = null;
    throw error;
  }
  return catched.conn;
}
