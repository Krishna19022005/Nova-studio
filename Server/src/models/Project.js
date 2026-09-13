import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
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

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    surface: {
      type: String,
      default: "",
      trim: true,
    },

    projectType: {
      type: String,
      default: "",
      trim: true,
    },

    studio: {
      type: String,
      default: "NOVA Flooring Studio",
      trim: true,
    },

    story: {
      type: [String],
      default: [],
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

const Project = mongoose.model("Project", projectSchema);

export default Project;