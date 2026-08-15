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
   
    console.log(
  "MSG91 AUTH KEY EXISTS:",
  !!process.env.MSG91_AUTH_KEY
);

    const params = new URLSearchParams();

    params.append(
      "authkey",
      process.env.MSG91_AUTH_KEY
    );

    params.append(
      "access-token",
      accessToken
    );

    const verifyResponse = await axios.post(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      params.toString(),
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    console.log(
      "MSG91 VERIFY STATUS:",
      verifyResponse.status
    );

    console.log(
      "MSG91 VERIFY RESPONSE:",
      JSON.stringify(
        verifyResponse.data,
        null,
        2
      )
    );

    /*
     * Check MSG91 verification
     */

    if (
      verifyResponse.data?.type !== "success"
    ) {
      return res.status(400).json({
        success: false,
        message:
          verifyResponse.data?.message ||
          "MSG91 access token verification failed.",
      });
    }

    /*
     * Get verified phone
     */

    const phone =
      verifyResponse.data?.message ||
      verifyResponse.data?.phone ||
      verifyResponse.data?.mobile;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone Number Not Found",
        msg91: verifyResponse.data,
      });
    }

    console.log(
      "Verified Phone:",
      phone
    );

    /*
     * Find existing user
     */

    let user = await User.findOne({
      phone,
    });

    /*
     * Create user if not found
     */

    if (!user) {
      user = await User.create({
        phone,
        name: "Phone User",
      });

      console.log(
        "Created User:",
        user._id
      );
    } else {
      console.log(
        "Existing User:",
        user._id
      );
    }

    /*
     * Generate Aetherix JWT
     */

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

    console.error(
      "=========== MSG91 ERROR ==========="
    );

    if (error.response) {

      console.error(
        "MSG91 STATUS:",
        error.response.status
      );

      console.error(
        "MSG91 RESPONSE:",
        JSON.stringify(
          error.response.data,
          null,
          2
        )
      );

      return res.status(400).json({
        success: false,
        message:
          error.response.data?.message ||
          "MSG91 Verification Failed",
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