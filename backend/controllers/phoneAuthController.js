import axios from "axios";

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

    // Return the complete MSG91 response
    return res.status(200).json({
      success: true,
      msg91: verifyResponse.data,
    });

  } catch (error) {
    console.error("=========== MSG91 ERROR ===========");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);

      return res.status(error.response.status).json({
        success: false,
        error: error.response.data,
      });
    }

    console.error(error.message);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};