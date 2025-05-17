import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { envVariables } from "./utils/env";
import authRouter from "./routes/auth";

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

// Routes
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use("/api/auth", authRouter);

export default app;

// start server for development environment
if (envVariables.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
