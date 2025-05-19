import { Router } from "express";
import {
  getFileByIdController,
  uploadFileController,
} from "../controllers/file";
import multer from "multer";
import { verifyAccessToken } from "../middleware/auth";
import fs from "fs";

const filesRouter = Router();

// Multer setup for file uploads
export const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // if folder does not exist, create it
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // 5 MB limit

filesRouter.post(
  "/upload",
  verifyAccessToken,
  upload.single("file"),
  uploadFileController
);

filesRouter.get("/:id", verifyAccessToken, getFileByIdController);

export default filesRouter;
