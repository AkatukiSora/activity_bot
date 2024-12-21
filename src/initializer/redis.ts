import Redis from "ioredis";
import { logger } from "./log";
const redisClient = new Redis({
  host: process.env["REDIS_HOST"],
  port: Number(process.env["REDIS_PORT"]),
});

const redisConnectionTest = () => {
  redisClient.ping().then((res) => {
    if (!res) {
      throw new Error("Redis connect error");
    }
    logger.info("Redis connect success");
  });
};

redisConnectionTest();

export default redisClient;
