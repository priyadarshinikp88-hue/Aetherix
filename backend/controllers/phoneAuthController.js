import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// =======================================================
// PHONE LOGIN
// MSG91 APP WIDGET ACCESS TOKEN VERIFICATION
// =======================================================

export const phoneLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    // ---------------------------------------------------
    // VALIDATE ACCESS TOKEN
    // ---------------------------------------------------

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access Token Missing",
      });
    }

    // ---------------------------------------------------
    // VALIDATE MSG91 SERVER AUTHKEY
    // ---------------------------------------------------

    const msg91AuthKey =
      process.env.MSG91_AUTH_KEY;

    if (!msg91AuthKey) {
      console.error(
        "❌ MSG91_AUTH_KEY is missing on Render"
      );

      return res.status(500).json({
        success: false,
        message:
          "MSG91 server authentication is not configured",
      });
    }

    console.log(
      "✅ MSG91 SERVER AUTHKEY EXISTS:",
      true
    );

    console.log(
      "🔐 MSG91 ACCESS TOKEN RECEIVED:",
      true
    );


    // ===================================================
    // VERIFY MSG91 ACCESS TOKEN
    // ===================================================

    const verifyResponse =
      await axios.post(

        "https://control.msg91.com/api/v5/widget/verifyAccessToken",

        {
          "access-token":
            accessToken,
        },

        {
          headers: {
            authkey:
              msg91AuthKey,

            Accept:
              "application/json",

            "Content-Type":
              "application/json",
          },

          timeout: 15000,
        }
      );


    // ---------------------------------------------------
    // LOG RESPONSE
    // ---------------------------------------------------

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


    // ===================================================
    // CHECK MSG91 RESPONSE
    // ===================================================

    if (
      verifyResponse.data?.type !==
      "success"
    ) {

      return res.status(400).json({
        success: false,

        message:
          verifyResponse.data?.message ||
          "MSG91 access token verification failed.",

        msg91:
          verifyResponse.data,
      });
    }


    // ===================================================
    // GET VERIFIED PHONE
    // ===================================================

    const phone =
      verifyResponse.data?.message ||
      verifyResponse.data?.phone ||
      verifyResponse.data?.mobile ||
      verifyResponse.data?.data?.phone ||
      verifyResponse.data?.data?.mobile;


    if (!phone) {

      console.error(
        "❌ MSG91 VERIFIED PHONE NOT FOUND"
      );

      console.error(
        "MSG91 RESPONSE:",
        JSON.stringify(
          verifyResponse.data,
          null,
          2
        )
      );

      return res.status(400).json({
        success: false,

        message:
          "Phone Number Not Found",

        msg91:
          verifyResponse.data,
      });
    }


    console.log(
      "✅ VERIFIED PHONE:",
      phone
    );


    // ===================================================
    // FIND EXISTING USER
    // ===================================================

    let user =
      await User.findOne({
        phone,
      });


    // ===================================================
    // CREATE USER IF NOT FOUND
    // ===================================================

    if (!user) {

      user =
        await User.create({
          phone,
          name:
            "Phone User",
        });

      console.log(
        "✅ CREATED PHONE USER:",
        user._id
      );

    } else {

      console.log(
        "✅ EXISTING PHONE USER:",
        user._id
      );
    }


    // ===================================================
    // GENERATE AETHERIX JWT
    // ===================================================

    if (!process.env.JWT_SECRET) {

      console.error(
        "❌ JWT_SECRET is missing"
      );

      return res.status(500).json({
        success: false,
        message:
          "JWT authentication is not configured",
      });
    }


    const token =
      jwt.sign(

        {
          id:
            user._id,
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            "7d",
        }
      );


    // ===================================================
    // SUCCESS
    // ===================================================

    return res.status(200).json({

      success:
        true,

      message:
        "Phone Login Successful",

      token,

      user,

    });


  } catch (error) {

    console.error(
      "=========== MSG91 PHONE LOGIN ERROR ==========="
    );


    // ---------------------------------------------------
    // MSG91 / AXIOS ERROR
    // ---------------------------------------------------

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


      return res.status(
        error.response.status >= 400 &&
        error.response.status < 500
          ? error.response.status
          : 500
      ).json({

        success:
          false,

        message:
          error.response.data?.message ||
          "MSG91 Verification Failed",

        error:
          error.response.data,

      });
    }


    // ---------------------------------------------------
    // OTHER ERROR
    // ---------------------------------------------------

    console.error(
      "ERROR:",
      error.message
    );


    return res.status(500).json({

      success:
        false,

      message:
        error.message ||
        "Phone login failed",

    });
  }
};