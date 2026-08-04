import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

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
    "Accept": "application/json",
  },
  data: {
    authkey: process.env.MSG91_AUTH_KEY,
    "access-token": accessToken,
  },
});

console.log("STATUS:", verifyResponse.status);
console.log("DATA:", JSON.stringify(verifyResponse.data, null, 2));

 // Extract phone number from every possible location
    
 if (verifyResponse.data.type !== "success") {
  return res.status(400).json({
    success: false,
    message: verifyResponse.data.message,
  });
}

const phone = verifyResponse.data.message;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone Number Not Found",
        msg91: verifyResponse.data,
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

    console.error(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};