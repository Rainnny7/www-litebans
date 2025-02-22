import { Redis } from "@upstash/redis";
import { env } from "~/env";

export const redis: Redis | undefined =
    env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
        ? new Redis({
              url: env.UPSTASH_REDIS_REST_URL,
              token: env.UPSTASH_REDIS_REST_TOKEN,
              enableTelemetry: false,
          })
        : undefined;
