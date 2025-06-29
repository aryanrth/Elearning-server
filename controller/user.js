import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

// export const register = async (req, res) => {
//   try {
//     res.send("register");
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "User alredy exist" });
  const hashPassword = await bcrypt.hash(password, 10);
  user = {
    name,
    email,
    password: hashPassword,
  };
  const otp = Math.floor(Math.random() * 1000000);
  const activationToken = jwt.sign(
    {
      user,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m",
    }
  );
  const data = {
    name,
    otp,
  };
  await sendMail(email, "Elearning", data);
  res.status(200).json({
    message: "otp is send to our mail",
    activationToken,
  });
});
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;
  const verify = jwt.verify(activationToken, process.env.Activation_Secret);
  if (!verify)
    return res.status(400).json({
      message: "otp expired",
    });
  if (verify.otp !== otp)
    return res.status(400).json({
      message: "otp wrong",
    });
  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });
  res.json({
    message: "user registered",
  });
});
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({
      message: "No user with the email",
    });
  const mathPassword = await bcrypt.compare(password, user.password);
  if (!mathPassword)
    return res.status(400).json({
      message: "wrong password",
    });
  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });
  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user,
  });
});
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ user });
});
export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({
      message: "No user with the email",
    });
  const token = jwt.sign({ email }, process.env.Forget_Password_Secret);
  const data = { email, token };
  await sendForgotMail("E learning", data);
  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 15 minutes
  await user.save();
  res.json({
    message: "Reset password link sent to your email",
    token,
  });
});
export const resetPassword = TryCatch(async (req, res) => {
  const decodedData = jwt.verify(
    req.query.token,
    process.env.Forget_Password_Secret
  );
  const user = await User.findOne({ email: decodedData.email });
  if (!user)
    return res.status(400).json({
      message: "No user with the email",
    });
  if (user.resetPasswordExpire === null)
    return res.status(400).json({
      message: "Reset password link expired",
    });
  if (user.resetPasswordExpire < Date.now()) {
    return res.status(400).json({
      message: "Reset password link expired",
    });
  }
  const password = await bcrypt.hash(req.body.password, 10);
  user.password = password;
  user.resetPasswordExpire = null;
  await user.save();
  res.json({
    message: "Password reset successfully",
  });
});
