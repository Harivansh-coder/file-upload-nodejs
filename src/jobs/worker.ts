import { Worker } from "bullmq";
import IORedis from "ioredis";
import fs from "fs/promises";
import crypto from "crypto";
import prisma from "../utils/database";

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const fileWorker = new Worker(
  "file-processing-queue",
  async (job) => {
    const { id, storagePath } = job.data;

    console.log(`🔄 Processing file ${id} from ${storagePath}`);
    try {
      // 1. change status to PROCESSING
      await prisma.file.update({
        where: { id },
        data: { status: "PROCESSING" },
      });

      // 2. Read file and calculate hash
      const fileBuffer = await fs.readFile(`.${storagePath}`);
      const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

      // 3. Simulate long task
      await new Promise((res) => setTimeout(res, 2000));

      // 4. Update record
      await prisma.file.update({
        where: { id },
        data: {
          status: "PROCESSED",
          extractedData: hash,
        },
      });

      return { hash };
    } catch (error) {
      console.error("❌ Processing failed:", error);

      await prisma.file.update({
        where: { id },
        data: { status: "FAILED", extractedData: "the process failed" },
      });

      throw error;
    }
  },
  { connection: redisConnection }
);

// Event listeners
fileWorker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

fileWorker.on("failed", (job, err) => {
  console.log(`💥 Job ${job?.id} failed: ${err.message}`);
});
