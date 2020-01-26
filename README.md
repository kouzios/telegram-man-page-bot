# Telegram Man Page Bot

This is a bot dedicated for the usage of the `man` command for linux! That way you can look up commands easily in your chat browser, for casual discussion, curiosity, or debate with a colleague.

## Commands
Currently there's only one command for the bot: `/man page [type]`

You specify the `page` as the manual page you want to persue. For example, `/man nohup` to get the nohup page.

You specify the `[type]`, which is optional, to indicate the type of result you want. You can use:
- `link`, which is the default, provides a link to the gnu docs. The gnu docs don't always have the page you want though!
- `-v`, or `--verbose` prints out the text version. For the sake of telegram's message size, you only get the NAME and SYNOPSIS sections of the man page. Sorry!

## Adding the bot
To add this bot to your server you can:
- Add a user via the Telegram link [here](http://t.me/Manual_Page_Bot)
- Add the bot under the alias @Manual_Page_Bot

Alternatively, you can host this bot for yourselves. This is done in two steps:
- Telegram Side
  - Add user @BotFather to your Telegram
  - type /newbot, and when prompted provide a bot name. Then provide the bot username
  - Copy the API token @BotFather outputs, you'll be needing it in our next step!

- Code side
  - Ensure you have Nodejs installed on your machine
  - Clone this repository
  - Copy the `copy.auth.json` file, and rename it as `auth.json`
  - Populate the `auth.json` file's `"BOT_AUTH_TOKEN"` section with the previously copied API token
  - Open up a console, within the project's cloned repository, and type `npm install`
  - Once fully finished, in the same console, type `npm start`
  
Congrats, you're up and running! If you are using our bot, you can just type away. If you're hosting your own bot, just add it to your server and it'll work just the same.
