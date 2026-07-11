import Redis from "ioredis"

const redisClient = new Redis(process.env.REDIS_URL || "rediss://default:YOUR_REDIS_PASSWORD@YOUR_REDIS_HOST:6379");

export default redisClient;