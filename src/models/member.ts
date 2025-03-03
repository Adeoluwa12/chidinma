import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  name: String,
  detectedAt: { type: Date, default: Date.now }
});

export const MemberModel = mongoose.model("Member", MemberSchema);
