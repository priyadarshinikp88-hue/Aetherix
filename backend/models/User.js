import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

   email: {
  type: String,
  unique: true,
  lowercase: true,
  sparse: true,
  
},
     
    phone: {
  type: String,
  unique: true,
  sparse: true,
},
  password: {
  type: String,
  default: null,
},
 
  membership: {
  type: String,
  default: "User",
},

profileImage: {
  type: String,
  default: "",
},

    // Phone Login

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
