"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIntoCache = setIntoCache;
exports.getFromCache = getFromCache;
exports.deleteFromCache = deleteFromCache;
const common_1 = require("../common");
async function setIntoCache(key, value, expire) {
    await common_1.redisClient.set(key, value, { EX: expire });
}
async function getFromCache(key) {
    return await common_1.redisClient.get(key);
}
async function deleteFromCache(key) {
    return await common_1.redisClient.del(key);
}
