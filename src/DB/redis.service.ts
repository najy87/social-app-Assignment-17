import { redisClient } from "../common";

export async function setIntoCache(
  key: string,
  value: string | number,
  expire: number,
) {
  await redisClient.set(key, value, { EX: expire });
}

export async function getFromCache(key: string) {
  return await redisClient.get(key);
}

export async function deleteFromCache(key: string) {
  return await redisClient.del(key);
}
