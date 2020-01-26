const TelegramBot = require('node-telegram-bot-api');
var logger = require('winston');
var auth = require('./auth.json');
const { exec,spawn } = require('child_process');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

const bot = new TelegramBot(auth.token, {polling: true});

const options = {
  parse_mode: 'html'
}

bot.onText(/\/man (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const page = match[1]; // the captured page

  logger.info(msg.from.first_name + " " + msg.from.last_name + " requested a man call for " + page)

  // Linux magic
  exec('man ' + page, (err, stdout, stderr) => {
    if (stderr) {
      console.log(stderr)
      logger.error(stderr)
      bot.sendMessage(chatId, "<b>Your command received the following error:</b>\n<code>" + stderr + "</code>", options);
    } else {
      console.log(stdout)
      logger.info(msg.from.first_name + " " + msg.from.last_name + " received a man call for " + page)
      bot.sendMessage(chatId, stdout, options);
    }
  });
});