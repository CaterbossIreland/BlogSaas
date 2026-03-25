import { Queue } from "bullmq";
import IORedis from "ioredis";

import {
  createCorrelationId,
  type JobKind,
  type WorkerJobPayload,
  WorkerJobPayloadSchema,
} from "@blog-saas/domain";

const queueName = "blog-saas-tenant-jobs";

let queue: Queue | null = null;

function getQueue() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!queue) {
    const connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
    queue = new Queue(queueName, { connection });
  }

  return queue;
}

export async function enqueueTenantJob(
  jobKind: JobKind,
  payload: Omit<WorkerJobPayload, "correlationId"> & Partial<Pick<WorkerJobPayload, "correlationId">>,
) {
  const parsedPayload = WorkerJobPayloadSchema.parse({
    ...payload,
    correlationId: payload.correlationId ?? createCorrelationId(),
  });

  const activeQueue = getQueue();
  if (!activeQueue) {
    return {
      mode: "simulated" as const,
      queueName,
      correlationId: parsedPayload.correlationId,
      jobId: `simulated-${parsedPayload.correlationId}`,
    };
  }

  const job = await activeQueue.add(jobKind, parsedPayload, {
    jobId: parsedPayload.correlationId,
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 30_000,
    },
    removeOnComplete: 500,
    removeOnFail: 1_000,
  });

  return {
    mode: "queued" as const,
    queueName,
    correlationId: parsedPayload.correlationId,
    jobId: String(job.id),
  };
}
