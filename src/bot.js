const Telegraf = require('telegraf');

const {
  BOT_TOKEN,
  COUNTDOWN_COMMAND,
  COUNTDOWN_CANCEL_COMMAND,
  COUNTDOWN_SECONDS_SOFT_LIMIT,
  COUNTDOWN_SECONDS_HARD_LIMIT,
} = require('./vars');
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
    log.info('this bot does not listen to other bots', is_bot);
    return;
  }

  if (typeof count !== 'number' || isNaN(count) || count <= 0) {
    log.info('this bot only accepts numbers as param');
    ctx.reply('please, send me the number of seconds to start the countdown (greater than 0)');
    return;
  }

  if (count > COUNTDOWN_SECONDS_SOFT_LIMIT || count > COUNTDOWN_SECONDS_HARD_LIMIT) {
    const limit = count > COUNTDOWN_SECONDS_SOFT_LIMIT ? COUNTDOWN_SECONDS_SOFT_LIMIT : COUNTDOWN_SECONDS_HARD_LIMIT;
    log.info(`trying to set a countdown higher than ${limit} seconds`);
    ctx.reply(`can't start a countdown higher than ${limit} seconds`);
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

bot.command(COUNTDOWN_CANCEL_COMMAND, catchErrors(ctx => {
  const { message } = ctx;
  const { from, chat, text } = message;
  const { is_bot } = from;
  const { id } = chat;

  const intervalId = `int_${id}`;
  const countString = text
    .replace(new RegExp(`\/${COUNTDOWN_CANCEL_COMMAND}`, 'img'), '')
    .trim();

  let count = Number(countString);

  if (is_bot) {
    log.info('this bot does not listen to other bots', is_bot);
    return;
  }

  if (typeof state.intervals[intervalId] !== 'undefined') {
    log.info(`finished countdown because $/{COUNTDOWN_CANCEL_COMMAND} in chat`, id);
    clearInterval(state.intervals[intervalId]);
    delete state.intervals[intervalId];
    ctx.reply('the countdown has been canceled');
    return;
  }

  log.info('there is no active countdown on this group', id);
}));

module.exports = bot;
