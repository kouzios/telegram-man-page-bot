const TelegramBot = require('node-telegram-bot-api');
var logger = require('winston');
var auth = require('./auth.json');
const { exec } = require('child_process');

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

// Accepts man requests and calls a request for the specified page
bot.onText(/man ([^\s]+)(?:\s(.+)){0,1}/, (msg, match) => {
  const chatId = msg.chat.id;
  const page = match[1]; // the captured page
  const type = match[2]; // the specified type (link or text)

  logger.info(msg.from.first_name + " " + msg.from.last_name + " requested a man call for " + page + " and type " + type)

  // Executes our linux command
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
	      bot.sendMessage(chatId, link).catch((error) => {
          logger.error(error)
          bot.sendMessage(chatId, "<b>Your command received the following error:</b>\n<code>" + error.response.body.description + "</code>", options)
        });
      } else if(type == "-v" || type == "—verbose" || type == "--verbose") {
        bot.sendMessage(chatId, filterMan(stdout)).catch((error) => {
          logger.error(error);
          bot.sendMessage(chatId, "<b>Your command received the following error:</b>\n<code>" + error.response.body.description + "</code>", options)
        });
      }
    }
  });
});

/**
 * Filters out the passed manpage contents, and returns in NAME/SYNOPSIS format
 * 
 * @param {*} stdout Man page contents
 */
function filterMan(stdout) {
  const regex = /NAME\n*(.+)\n*SYNOPSIS\n*(.+)\n*^(?:DESCRIPTION)/gms
  const results = regex.exec(stdout);
  const name = results[1];
  const synposis = results[2];
  return "NAME\n" + name + "SYNOPSIS\n" + synposis;
}
