import { Worker } from "bullmq";

import { JobKindSchema, WorkerJobPayloadSchema } from "@blog-saas/domain";

import { dispatchJob } from "./jobs";
import { createRedisConnection, queueName } from "./queue";

async function main() {
  const connection = createRedisConnection();

  const worker = new Worker(
    queueName,
    async (job) => {
      const jobKind = JobKindSchema.parse(job.name);
      const payload = WorkerJobPayloadSchema.parse(job.data);
      const result = await dispatchJob(jobKind, payload);
      console.log(JSON.stringify({ jobKind, correlationId: payload.correlationId, result }, null, 2));
      return result;
    },
    {
      connection,
      concurrency: 4,
    },
  );

  worker.on("completed", (job) => {
    console.log(`Completed ${job.name} ${job.id}`);
  });

  worker.on("failed", (job, error) => {
    console.error(`Failed ${job?.name ?? "unknown"} ${job?.id ?? "unknown"}:`, error);
  });

  console.log(`Worker listening on queue ${queueName}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
