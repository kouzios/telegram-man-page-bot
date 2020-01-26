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

bot.onText(/man ([^\s]+)(?:\s(.+)){0,1}/, (msg, match) => {
  const chatId = msg.chat.id;
  const page = match[1]; // the captured page
  const type = match[2]; // the specified type

  logger.info(msg.from.first_name + " " + msg.from.last_name + " requested a man call for " + page + " and type " + type)

  // Linux magic
  exec('man ' + page, (err, stdout, stderr) => {
    if (stderr) {
      logger.error(stderr)
      bot.sendMessage(chatId, "<b>Your command received the following error:</b>\n<code>" + stderr + "</code>", options).catch((error) => {
        logger.error(error)
        bot.sendMessage(chatId, "<b>Your command received the following error:</b>\n<code>" + error.response.body.description + "</code>", options)
      });;
    } else {
      if(type == undefined || type == "link") {
        const link = "http://www.gnu.org/software/coreutils/" + page
        logger.info(msg.from.first_name + " " + msg.from.last_name + " received a link man call for " + page)
        bot.send(chatId, link).catch((error) => {
          logger.error(error)
          bot.sendMessage(chatId, "<b>Your command received the following error:</b>\n<code>" + error.response.body.description + "</code>", options)
        });;
      } else if(type == "text") {
        logger.info(msg.from.first_name + " " + msg.from.last_name + " received a link man call for " + page)
        bot.sendMessage(chatId, filterMan(stdout)).catch((error) => {
          logger.error(error)
          bot.sendMessage(chatId, "<b>Your command received the following error:</b>\n<code>" + error.response.body.description + "</code>", options)
        });;
      }
    }
  });
});

function filterMan(stdout) {
  return stdoud
}
