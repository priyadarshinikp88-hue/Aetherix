import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const phoneLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access Token Missing",
      });
    }

    console.log("======================================");
    console.log("AUTH KEY FROM ENV:");
    console.log(process.env.MSG91_AUTH_KEY);
    console.log("Access Token:", accessToken);
    console.log("======================================");

    const verifyResponse = await axios({
      method: "POST",
      url: "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        authkey: process.env.MSG91_AUTH_KEY,
        "access-token": accessToken,
      },
    });

    console.log("STATUS:", verifyResponse.status);
    console.log(
      "DATA:",
      JSON.stringify(verifyResponse.data, null, 2)
    );

    // Check MSG91 verification
    if (verifyResponse.data.type !== "success") {
      return res.status(400).json({
        success: false,
        message: verifyResponse.data.message,
      });
    }

    // Get phone number
    const phone = verifyResponse.data.message;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone Number Not Found",
        msg91: verifyResponse.data,
      });
    }

    console.log("Verified Phone:", phone);

    // Find existing user
    let user = await User.findOne({ phone });

    console.log("Existing User:", user);

    // Create user if not found
    if (!user) {
      user = await User.create({
        phone: phone,
        name: "Phone User",
      });

      console.log("Created User:", user);
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.error("=========== MSG91 ERROR ===========");

    if (error.response) {
      console.error("Status:", error.response.status);

      console.error(
        JSON.stringify(error.response.data, null, 2)
      );

      return res.status(error.response.status).json({
        success: false,
        message: "MSG91 Verification Failed",
        error: error.response.data,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};