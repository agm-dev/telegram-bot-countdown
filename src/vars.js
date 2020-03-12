const { join } = require('path');

require('dotenv-safe').config({
  example: join(__dirname, '..', '.env.example'),
  path: join(__dirname, '..', '.env'),
});

const { BOT_TOKEN } = process.env;
const COUNTDOWN_COMMAND = 'countdown';

module.exports = {
  BOT_TOKEN,
  COUNTDOWN_COMMAND,
};
