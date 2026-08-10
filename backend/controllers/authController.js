import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login Successful",
      token,

     user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    membership: user.membership,
    profileImage: user.profileImage,
     }
    }); 

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
    name,
    email,
    password: hashedPassword,
    membership: "User",
    profileImage: "",
});

    await user.save();

    return res.status(201).json({
      message: "Registration Successful",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= FORGOT PASSWORD (TEST) =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

  console.log("Email received:", email);

const users = await User.find();
console.log("All users:", users);

const user = await User.findOne({
  email: email.toLowerCase().trim(),
});

console.log("User found:", user);

if (!user) {
  return res.status(404).json({
    message: "User not found",
  });
}
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
      <h2>Aetherix Cloud Password Reset</h2>

      <p>Hello <b>${user.name}</b>,</p>

      <p>Click the button below to reset your password.</p>

      <a href="${resetURL}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
    `;

    await sendEmail(
      user.email,
      "Aetherix Cloud Password Reset",
      html
    );

    return res.status(200).json({
      message: "Password reset email sent successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or Expired Token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    return res.status(200).json({
      message: "Password Updated Successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= SEND OTP =================
export const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile number is required",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 5 minutes
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ mobile });

    if (!user) {
      user = new User({
        name: "Phone User",
        email: `${mobile}@phone.aetherix`,
        password: "phone-login",
        mobile,
      });
    }

    user.otp = otp;
    user.otpExpiry = expiry;

    await user.save();

    console.log("OTP:", otp);

    return res.status(200).json({
      message: "OTP generated successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        message: "OTP not generated",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    user.isPhoneVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Phone Login Successful",
      token,
      user,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }
};
// ================= GET PROFILE =================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};


// ================= UPDATE PROFILE =================

export const updateProfile = async (req, res) => {
  try {
    console.log("================================");
    console.log("UPDATE PROFILE REQUEST");
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);
    console.log("================================");

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user authentication.",
      });
    }

    const user = await User.findById(userId);

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      name,
      email,
      phone,
      profileImage,
    } = req.body;


    // ================= NAME =================

    if (name !== undefined && name.trim()) {
      user.name = name.trim();
    }


    // ================= EMAIL =================

    if (email !== undefined && email.trim()) {

      const cleanEmail =
        email.trim().toLowerCase();

      const existingEmail =
        await User.findOne({
          email: cleanEmail,
          _id: { $ne: user._id },
        });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered.",
        });
      }

      user.email = cleanEmail;
    }


    // ================= PHONE =================

    if (phone !== undefined && phone.trim()) {

      const cleanPhone =
        phone.trim();

      const existingPhone =
        await User.findOne({
          phone: cleanPhone,
          _id: { $ne: user._id },
        });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message:
            "Phone number is already registered.",
        });
      }

      user.phone = cleanPhone;
    }


    // ================= PROFILE PHOTO =================

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }


    // ================= SAVE =================

    await user.save();

    console.log(
      "PROFILE SAVED:",
      user._id
    );


    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        membership:
          user.membership || "User",
        profileImage:
          user.profileImage || "",
      },
    });

  } catch (error) {

    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone number is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update profile.",
      error: error.message,
    });
  }
};