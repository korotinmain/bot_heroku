const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '688096498:AAHqicTaHnylwGBsRZEKlHIEOMtn-rc0ME8';

const bot = new TelegramBot(TOKEN, {polling: true});

bot.on('message', msg => {
    bot.sendMessage(msg.chat.id, `Hello from Heroku`);
})