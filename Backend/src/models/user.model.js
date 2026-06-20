import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    name: {
      type: String,
      required: [true, "Name is required for creating account"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never returned in queries
    },
  },

  {
    timestamps: true, // createdAt, updatedAt auto-added
    toJSON: { virtuals: true },
  },
);

// Middleware: Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
   

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  return ;
});

userSchema.methods.comparePassword = async function (password) {
  console.log(password, this.password)
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
