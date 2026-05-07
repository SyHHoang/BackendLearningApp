import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379"
});

redisClient.on("error", (err) =>
  console.log("Redis Client Error", err)
);

redisClient.on("connect", () =>
  console.log("Redis connected")
);

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export default redisClient;