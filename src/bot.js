const Telegraf = require('telegraf');

const { BOT_TOKEN, COUNTDOWN_COMMAND } = require('./vars');
const { catchErrors, log } = require('./utils');

const bot = new Telegraf(BOT_TOKEN);

const state = {
  intervals: {}
}

bot.command(COUNTDOWN_COMMAND, catchErrors(ctx => {
  const { message } = ctx;
  const { from, chat, text } = message;
  const { is_bot } = from;
  const { id } = chat;

  const intervalId = `int_${id}`;
  const countString = text
    .replace(new RegExp(`\/${COUNTDOWN_COMMAND}`, 'img'), '')
    .trim();

  let count = Number(countString);

  if (is_bot) {
    log.info('this bot does not listen to othe bots', is_bot);
    return;
  }

  if (typeof count !== 'number' || isNaN(count) || count <= 0) {
    log.info('this bot only accepts numbers as param');
    ctx.reply('please, send me the number of seconds to start the countdown (greater than 0)');
    return;
  }

  if (typeof state.intervals[intervalId] !== 'undefined') {
    log.info('there is already a running countdown on that chat', id);
    return;
  }

  log.info(`starting countdown from ${count} to 0 in chat ${id}`);

  state.intervals[intervalId] = setInterval(() => {
    log.info(`sending countdown on chat ${id} with value ${count}`);
    ctx.reply(count);
    count--;

    if (count < 0) {
      log.info('finished countdown in chat', id);
      clearInterval(state.intervals[intervalId]);
      delete state.intervals[intervalId];
    }
  }, 1000);
}));

module.exports = bot;
