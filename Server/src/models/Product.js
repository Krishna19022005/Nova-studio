import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
    },

    collection: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    finish: {
      type: String,
      default: "",
      trim: true,
    },

    colour: {
      type: String,
      default: "",
      trim: true,
    },

    space: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    specs: {
      type: Map,
      of: String,
      default: {},
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;