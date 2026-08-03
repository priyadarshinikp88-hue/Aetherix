const widgetId = "366862737242343031383233";
const tokenAuth = "556760TjhBRWxHviM6a6fb294P1";

let initialized = false;

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
        console.log("MSG91 Success:", data);
      },

      failure: (error) => {
        console.error("MSG91 Error:", error);
      },
    };

    window.configuration = configuration;

    const script = document.createElement("script");
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;

    script.onload = () => {
      window.initSendOTP(configuration);
      initialized = true;
      resolve();
    };

    script.onerror = () => {
      reject("MSG91 SDK failed to load");
    };

    document.body.appendChild(script);
  });
};

export const sendOTP = (mobile) => {
  return new Promise((resolve, reject) => {
    window.sendOtp(
      mobile,
      (data) => resolve(data),
      (err) => reject(err)
    );
  });
};

export const verifyOTP = (otp) => {
  return new Promise((resolve, reject) => {
    window.verifyOtp(
      otp,
      (data) => resolve(data),
      (err) => reject(err)
    );
  });
};

export const retryOTP = () => {
  return new Promise((resolve, reject) => {
    window.retryOtp(
      null,
      (data) => resolve(data),
      (err) => reject(err)
    );
  });
};