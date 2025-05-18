import { Router } from "express";
import {
  getFileByIdController,
  uploadFileController,
} from "../controllers/file";
import multer from "multer";
import { verifyAccessToken } from "../middleware/auth";

const filesRouter = Router();

// Multer setup for file uploads
export const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  },
});

export const upload = multer({ storage });

filesRouter.post(
  "/upload",
  verifyAccessToken,
  upload.single("file"),
  uploadFileController
);

filesRouter.get("/:id", verifyAccessToken, getFileByIdController);

export default filesRouter;
