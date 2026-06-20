import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";


//user register controller
export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  // check if user already exists
  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ name }, { email }],
  });
  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "user is already exist",
    });
  }

  // make password into hash form
  const hash = await bcrypt.hash(password, 10); //10 is salt

  // create user
  const user = await userModel.create({
    name,
    email,
    password: hash,
  });

  // ── Step 4: Generate tokens ───────────────────
  const accessToken = jwt.sign(
    // ✅ moved inside function
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }, // ✅ "15m" not "15min"
  );

  console.log("accessToken", accessToken);

  const refreshToken = jwt.sign(
    // ✅ moved inside function
    { id: user._id },
    process.env.JWT_SECRET, // ✅ separate secret for refresh
    { expiresIn: "7d" },
  );

  console.log("refreshToken", refreshToken);

  // ── Step 5: Set cookie ────────────────────────
  res.cookie("refreshToken", refreshToken, {
    // ✅ moved inside function
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    accessToken,
  });
}

//user login controller
export async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  console.log(user);

  if (!user) {
    return res.status(401).json({
      message: "Email is incorrect",
    });
  }

  const isValidPassword = await user.comparePassword(password);
  console.log("isvalidpassword", isValidPassword);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Password is incorrect",
    });
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // ── Step 5: Set cookie ────────────────────────
  res.cookie("refreshToken", refreshToken, {
    // ✅ moved inside function
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // ── Step 6: Send response ─────────────────────
  res.status(201).json({
    // ✅ moved inside function
    message: "User login successfully",
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    accessToken,
  });
}
