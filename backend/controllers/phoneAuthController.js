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
    console.log("MSG91_AUTH_KEY:", process.env.MSG91_AUTH_KEY);
    console.log("Access Token:", accessToken);
    console.log("======================================");

    const verifyResponse = await axios.post(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        authkey: process.env.MSG91_AUTH_KEY,
        "access-token": accessToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("=========== MSG91 FULL RESPONSE ===========");
    console.log(JSON.stringify(verifyResponse.data, null, 2));

    // If MSG91 authentication itself failed
    if (
      verifyResponse.data.type === "error" ||
      verifyResponse.data.message === "AuthenticationFailure"
    ) {
      return res.status(401).json({
        success: false,
        message: "MSG91 Authentication Failed",
        msg91: verifyResponse.data,
      });
    }

    // Extract phone number from every possible location
    const phone =
      verifyResponse.data.mobile ||
      verifyResponse.data.phone ||
      verifyResponse.data.identifier ||
      verifyResponse.data.data?.mobile ||
      verifyResponse.data.data?.phone ||
      verifyResponse.data.data?.identifier ||
      verifyResponse.data.result?.mobile ||
      verifyResponse.data.result?.phone ||
      verifyResponse.data.result?.identifier;

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