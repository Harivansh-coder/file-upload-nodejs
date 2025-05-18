import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { envVariables } from "./utils/env";
import authRouter from "./routes/auth";
import filesRouter from "./routes/files";
import multer from "multer";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`); // Unique filename
  },
});

const upload = multer({ storage });

// Routes
app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

app.use("/api/auth", authRouter);
app.use("/api/files", filesRouter);
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    console.log("File uploaded:", file);

    if (file === undefined) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    // File upload successful

    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        ...file,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
});
export default app;

// start server for development environment
if (envVariables.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
