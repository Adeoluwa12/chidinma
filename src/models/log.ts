import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
});

export const LogModel = mongoose.model("Log", LogSchema);
