import User from "../models/userModel.js";
import { hashPassword, verifyPassword } from "../utils/bcryptHelper.js";
import { createJWT } from "../utils/webtokenHelper.js";
import { recordActivity } from "../utils/activity.js";
import { sendMail } from "../utils/mailer.js";
import { loginAlertEmail, welcomeEmail } from "../utils/emailTemplates.js";

// Cross-site cookies (Vercel -> API) need SameSite=None + Secure; on plain http that would be rejected.
// COOKIE_SECURE / COOKIE_SAMESITE override the defaults (e.g. same-origin Docker deploy over http).
const isProduction = process.env.NODE_ENV === "production";
const cookieSecure = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === "true"
  : isProduction;
const authCookieOptions = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: process.env.COOKIE_SAMESITE || (cookieSecure ? "None" : "Lax"),
  path: "/",
};

// register controller
export const registerController = async (req, res) => {
  try {
    const { email, password, gender, height, weight, age, fullName } = req.body;

    // Validate input fields
    if (!email) return res.status(400).json({ message: "Email is missing" });
    if (!password)
      return res.status(400).json({ message: "Password is missing" });
    if (!height) return res.status(400).json({ message: "Height is missing" });
    if (!weight) return res.status(400).json({ message: "Weight is missing" });
    if (!age) return res.status(400).json({ message: "Age is missing" });
    if (!gender) return res.status(400).json({ message: "Gender is missing" });

    // Check if the user already exists (by email)
    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "user already registered, please try other email id!",
      });
    }

    // Hash password before saving
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await User.create({
      email,
      gender,
      height,
      weight,
      password: hashedPassword,
      age,
      fullName,
    });
    await recordActivity(req, user, "signup", "Created an account");
    sendMail({ to: user.email, ...welcomeEmail(user) });

    return res.status(201).json({
      success: true,
      message: "User registration successful",
      user_id: user.user_id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User registration failed!",
      error,
    });
  }
};

// login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is missing" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is missing" });
    }
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Either Email or Password is incorrect!",
      });
    }

    // Verify the password
    const isCorrectPassword = await verifyPassword(password, user?.password);

    if (!isCorrectPassword) {
      return res.status(401).json({
        success: false,
        message: "Either Email or Password is incorrect!",
      });
    }

    user.last_login_at = new Date();
    user.login_count = (user.login_count ?? 0) + 1;
    await user.save();
    await recordActivity(req, user, "login", "Logged in");
    sendMail({
      to: user.email,
      ...loginAlertEmail(user, { ip: req.ip, userAgent: req.get("user-agent"), at: user.last_login_at }),
    });

    // Create JWT token for user
    const user_id = user?.user_id;
    const jwtToken = await createJWT(user_id);

    // Set the token in an HTTP-Only Cookie
    res.cookie("authToken", jwtToken, {
      ...authCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _password, ...safeUser } = user.toObject();
    return res.status(200).json({
      success: true,
      message: "User validated, Logged In successfully",
      user: safeUser,
      // JWT: jwtToken
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User login failed!",
      error,
    });
  }
};

// get-user-details
export const userDetailsController = async (req, res) => {
  try {
    console.log("hii");
    const { user_id } = req.user;
    console.log("user_id is: ", user_id);

    const user = await User.findOne({ user_id }).select(
      "-password -created_at -updated_at"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Details fetched successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while retrieving user details",
      error,
    });
  }
};

// update user
export const userUpdateController = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { role, password, user_id, email, _id, ...allowedUpdates } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      { $set: { ...allowedUpdates, updated_at: Date.now() } },
      { new: true, runValidators: true }
    ).select("-password -createdAt -updatedAt");

    return res.status(200).send({
      success: true,
      message: "User Updated Successfully!",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating User-Details",
      error,
    });
  }
};

//delete user
export const userDeleteController = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await User.findOneAndDelete({ user_id });
    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Not Deleted, Error occurred while deleting user!",
      error,
    });
  }
};

// Express logout controller
export const logoutController = async (req, res) => {
  res.clearCookie("authToken", authCookieOptions);
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
