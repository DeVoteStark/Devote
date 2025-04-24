import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

async function connectToDb() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }
    const opts = {
      bufferCommands: false,
    };
    await mongoose.connect(MONGO_URI, opts);
    console.log("Connected to MongoDB");
    return mongoose;
  } catch (err) {
    console.log(err);
  }
}
export default connectToDb;
