import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    projectType: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "resolved",
      ],
      default: "new",
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Inquiry = mongoose.model(
  "Inquiry",
  inquirySchema
);

export default Inquiry;