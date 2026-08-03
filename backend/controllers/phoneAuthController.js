import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const phoneLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    console.log("Access Token:", accessToken);

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access Token Missing",
      });
    }

    // Verify Access Token with MSG91
    const verifyResponse = await axios.post(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        authkey: process.env.MSG91_AUTH_KEY,
        "access-token": accessToken,
      }
    );

    console.log("MSG91 Response:", verifyResponse.data);
    console.log("MSG91 Verify API Response:");
console.log(JSON.stringify(verifyResponse.data, null, 2));

return res.json({
  success: true,
  msg91: verifyResponse.data,
});
    // Get mobile number from MSG91 response
    const phone =
      verifyResponse.data.mobile ||
      verifyResponse.data.identifier ||
      verifyResponse.data.phone;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone Number Not Found",
      });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        name: "Phone User",
      });
    }

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

    console.log(
      "Backend Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Verification Failed",
    });
  }
};