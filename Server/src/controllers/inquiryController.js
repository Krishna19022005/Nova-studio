import Inquiry from "../models/Inquiry.js";

export const createInquiry = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      projectType,
      location,
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      subject: subject?.trim() || "",
      message: message.trim(),
      projectType:
        projectType?.trim() || "",
      location: location?.trim() || "",
      status: "new",
    });

    res.status(201).json({
      success: true,
      message:
        "Your inquiry has been submitted successfully.",
      data: inquiry,
    });
  } catch (error) {
    console.error(
      "Create inquiry error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to submit inquiry.",
    });
  }
};