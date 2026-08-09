const widgetId = "366862737242343031383233";
const tokenAuth = "556760TjhBRWxHviM6a6fb294P1";

let initialized = false;

// Store the current MSG91 request ID
let requestId = null;


// ==========================================
// INITIALIZE MSG91
// ==========================================

export const initializeMSG91 = () => {

  return new Promise((resolve, reject) => {

    if (initialized) {
      resolve();
      return;
    }

    const configuration = {

      widgetId,

      tokenAuth,

      exposeMethods: true,

      success: (data) => {

        console.log(
          "MSG91 Success:",
          data
        );

      },

      failure: (error) => {

        console.error(
          "MSG91 Error:",
          error
        );

      },

    };

    window.configuration = configuration;


    const script = document.createElement("script");

    script.src =
      "https://verify.msg91.com/otp-provider.js";

    script.async = true;


    script.onload = () => {

      try {

        window.initSendOTP(configuration);

        initialized = true;

        console.log(
          "MSG91 Initialized"
        );

        resolve();

      } catch (error) {

        console.error(
          "MSG91 Initialization Error:",
          error
        );

        reject(error);

      }

    };


    script.onerror = () => {

      reject(
        new Error(
          "MSG91 SDK failed to load"
        )
      );

    };


    document.body.appendChild(script);

  });

};


// ==========================================
// SEND OTP
// ==========================================

export const sendOTP = (mobile) => {

  return new Promise((resolve, reject) => {

    if (
      !window.sendOtp ||
      typeof window.sendOtp !== "function"
    ) {

      reject(
        new Error(
          "MSG91 is not initialized"
        )
      );

      return;
    }


    window.sendOtp(

      mobile,

      (data) => {

        console.log(
          "MSG91 SEND OTP RESPONSE:",
          data
        );


        // MSG91 returns the request ID
        // in the message field

        if (
          data &&
          data.message
        ) {

          requestId =
            data.message;

        }


        console.log(
          "MSG91 request ID:",
          requestId
        );


        resolve(data);

      },


      (error) => {

        console.error(
          "MSG91 SEND OTP ERROR:",
          error
        );

        reject(error);

      }

    );

  });

};


// ==========================================
// VERIFY OTP
// ==========================================

export const verifyOTP = (otp) => {

  return new Promise((resolve, reject) => {

    if (
      !window.verifyOtp ||
      typeof window.verifyOtp !== "function"
    ) {

      reject(
        new Error(
          "MSG91 verifyOtp is not available"
        )
      );

      return;
    }


    if (!requestId) {

      reject(
        new Error(
          "MSG91 request ID is missing. Please send OTP again."
        )
      );

      return;

    }


    console.log(
      "Verifying OTP with request ID:",
      requestId
    );


    window.verifyOtp(

      otp,

      (data) => {

        console.log(
          "MSG91 VERIFY OTP RESPONSE:",
          data
        );

        resolve(data);

      },

      (error) => {

        console.error(
          "MSG91 VERIFY OTP ERROR:",
          error
        );

        reject(error);

      },

      // IMPORTANT:
      // Pass request ID as 4th argument

      requestId

    );

  });

};


// ==========================================
// RESEND / RETRY OTP
// ==========================================

export const retryOTP = () => {

  return new Promise((resolve, reject) => {

    if (
      !window.retryOtp ||
      typeof window.retryOtp !== "function"
    ) {

      reject(
        new Error(
          "MSG91 retryOtp is not available"
        )
      );

      return;

    }


    if (!requestId) {

      reject(
        new Error(
          "MSG91 request ID is missing. Please send OTP again."
        )
      );

      return;

    }


    console.log(
      "Retrying OTP with request ID:",
      requestId
    );


    window.retryOtp(

      null,

      (data) => {

        console.log(
          "MSG91 RETRY OTP RESPONSE:",
          data
        );


        // Some responses may return
        // a new request ID.

        if (
          data &&
          data.message
        ) {

          requestId =
            data.message;

        }


        console.log(
          "Updated MSG91 request ID:",
          requestId
        );


        resolve(data);

      },

      (error) => {

        console.error(
          "MSG91 RETRY OTP ERROR:",
          error
        );

        reject(error);

      },

      // IMPORTANT:
      // Pass request ID

      requestId

    );

  });

};