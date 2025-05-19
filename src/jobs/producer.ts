import { Queue } from "bullmq";

export const fileQueue = new Queue("file-processing-queue", {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    port: 6379,
  },
});

export async function enqueueFileProcessingJob(fileRecord: {
  id: string;
  storagePath: string;
}) {
  const job = await fileQueue.add("processFile", fileRecord);
  console.log(`✅ Enqueued job ${job.id} for file ${fileRecord.id}`);
}
