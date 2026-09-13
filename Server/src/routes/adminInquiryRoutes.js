import express from "express";

import {
  getAdminInquiries,
  getAdminInquiry,
  updateInquiryStatus,
  updateInquiryNote,
  deleteAdminInquiry,
} from "../controllers/adminInquiryController.js";

const router = express.Router();

/* LIST */
router.get(
  "/",
  getAdminInquiries
);

/* SINGLE */
router.get(
  "/:id",
  getAdminInquiry
);

/* STATUS */
router.patch(
  "/:id/status",
  updateInquiryStatus
);

/* ADMIN NOTE */
router.patch(
  "/:id/note",
  updateInquiryNote
);

/* DELETE */
router.delete(
  "/:id",
  deleteAdminInquiry
);

export default router;