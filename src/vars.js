const { join } = require('path');

require('dotenv-safe').config({
  example: join(__dirname, '..', '.env.example'),
  path: join(__dirname, '..', '.env'),
});

const { BOT_TOKEN, COUNTDOWN_SECONDS_SOFT_LIMIT } = process.env;
const COUNTDOWN_COMMAND = 'countdown';
const COUNTDOWN_SECONDS_HARD_LIMIT = 600; // 10 min

module.exports = {
  BOT_TOKEN,
  COUNTDOWN_COMMAND,
  COUNTDOWN_SECONDS_SOFT_LIMIT,
  COUNTDOWN_SECONDS_HARD_LIMIT,
};
