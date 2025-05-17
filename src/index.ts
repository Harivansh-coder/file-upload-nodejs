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
  destination: (req: any, file, cb) => {
    // Ensure the directory exists
    const fs = require("fs");
    const dir = "uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });
app.use(upload.single("file")); // Use this middleware for file uploads
app.use((req, res, next) => {
  // Middleware to handle file uploads
  if (req.file) {
    console.log("File uploaded:", req.file);
  }
  next();
});

// Routes
app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

app.use("/api/auth", authRouter);
app.use("/api/files", filesRouter);

export default app;

// start server for development environment
if (envVariables.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
