import Inquiry from "../models/Inquiry.js";

/* ============================================
   GET ALL INQUIRIES
============================================ */

export const getAdminInquiries = async (
  req,
  res
) => {
  try {
    const inquiries =
      await Inquiry.find()
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error(
      "Get admin inquiries error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load inquiries.",
    });
  }
};

/* ============================================
   GET SINGLE INQUIRY
============================================ */

export const getAdminInquiry = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const inquiry =
      await Inquiry.findById(id).lean();

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error(
      "Get admin inquiry error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load inquiry.",
    });
  }
};

/* ============================================
   UPDATE STATUS
============================================ */

export const updateInquiryStatus =
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "new",
        "contacted",
        "resolved",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid inquiry status.",
        });
      }

      const inquiry =
        await Inquiry.findByIdAndUpdate(
          id,
          { status },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found.",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Inquiry status updated successfully.",
        data: inquiry,
      });
    } catch (error) {
      console.error(
        "Update inquiry status error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update inquiry status.",
      });
    }
  };

/* ============================================
   UPDATE ADMIN NOTE
============================================ */

export const updateInquiryNote =
  async (req, res) => {
    try {
      const { id } = req.params;
      const { adminNote } = req.body;

      const inquiry =
        await Inquiry.findByIdAndUpdate(
          id,
          {
            adminNote:
              adminNote?.trim() || "",
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found.",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Admin note updated successfully.",
        data: inquiry,
      });
    } catch (error) {
      console.error(
        "Update inquiry note error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update admin note.",
      });
    }
  };

/* ============================================
   DELETE INQUIRY
============================================ */

export const deleteAdminInquiry =
  async (req, res) => {
    try {
      const { id } = req.params;

      const inquiry =
        await Inquiry.findByIdAndDelete(id);

      if (!inquiry) {
        return res.status(404).json({
          success: false,
          message: "Inquiry not found.",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Inquiry deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete inquiry error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete inquiry.",
      });
    }
  };