import Redis from "ioredis"

const redisClient = new Redis("rediss://default:gQAAAAAAAbj_AAIgcDJhMjU3OWQ2MzE4MjE0NjZhYTI5MzA2MTdmZmNkYzljZg@golden-rabbit-112895.upstash.io:6379");
redisClient.set('foo', 'bar');

export default redisClient;