import { verifyGoogleToken } from "../config/google.config.js";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.utils.js";

export const register = async (name, email, password) => {
  // 1. Check if email is already taken
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("Email already registered.");
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash the password (never store plain text)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Save new user to database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 4. Generate JWT token
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    },
  };
};


export const emailLogin = async (email, password) => {
  // 1. Find user by email
  const user = await User.findOne({ email });

  // 2. If no user found, or user signed up with Google (no password)
  if (!user || !user.password) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  // 3. Compare provided password with stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  // 4. Update last login time
  user.lastLogin = new Date();
  await user.save();

  // 5. Generate token and return
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    },
  };
};


export const googleLogin = async (credential) => {
  // 1. Verify the token is genuine with Google
  const googleUser = await verifyGoogleToken(credential);

  // 2. Find existing user or create new one (upsert)
  const user = await User.findOneAndUpdate(
    { googleId: googleUser.googleId },
    {
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      lastLogin: new Date(),
    },
    { upsert: true, new: true, returnDocument: "after" }
  );

  // 3. Generate token and return
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    },
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-__v -googleId");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    lastLogin: user.lastLogin,
  };
};