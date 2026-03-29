import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,       // allows multiple users to have null googleId
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      default: null,      // null for Google SSO users (they have no password)
    },
    picture: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }   // auto-adds createdAt and updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;