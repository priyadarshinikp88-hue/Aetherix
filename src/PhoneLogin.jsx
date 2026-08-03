import axios from "axios";
import jwt from "jsonwebtoken";


export const phoneLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access Token Missing",
      });
    }

    console.log("MSG91_AUTH_KEY:", process.env.MSG91_AUTH_KEY);
    console.log("Access Token:", accessToken);

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

    console.log("VERIFY RESPONSE:", verifyResponse.data);

    // If MSG91 itself rejected the request
    if (verifyResponse.data.type !== "success") {
      return res.status(401).json({
        success: false,
        message: verifyResponse.data.message,
        code: verifyResponse.data.code,
      });
    }

    // Try to extract phone number
    const phone =
      verifyResponse.data.mobile ||
      verifyResponse.data.phone ||
      verifyResponse.data.identifier ||
      verifyResponse.data.data?.mobile ||
      verifyResponse.data.data?.phone ||
      verifyResponse.data.data?.identifier;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone Number Not Found",
        response: verifyResponse.data,
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
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.error(
      "MSG91 ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Verification Failed",
      error: error.response?.data || error.message,
    });
  }
};