const { Redis } = require('@upstash/redis');


const redis = Redis.fromEnv();
const REDIS_KEY = 'amigo_secreto_participantes';

module.exports = {
  redis,
  REDIS_KEY
};