import mongoose, { Connection } from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); 

const MONGODB_URL = process.env.MONGO_URI as string;

if (!MONGODB_URL) {
  throw new Error("MongoDB URI not found!");
}

// Fix: Properly define global cache using globalThis
declare global {
  var mongoose: { conn: Connection | null; promise: Promise<Connection> | null };
}

globalThis.mongoose = globalThis.mongoose || { conn: null, promise: null };

async function connect() {
  if (globalThis.mongoose.conn) {
    return globalThis.mongoose.conn;
  }

  if (!globalThis.mongoose.promise) {
    globalThis.mongoose.promise = mongoose
      .connect(MONGODB_URL, {
        dbName: "PFV", // Ensure a database name is provided
        bufferCommands: false,
      })
      .then((mongoose) => mongoose.connection);
  }

  globalThis.mongoose.conn = await globalThis.mongoose.promise;
  return globalThis.mongoose.conn;
}
export default connect;
