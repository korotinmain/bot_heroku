const TelegramBot = require("node-telegram-bot-api");
const TOKEN = require('./global-env').TOKEN;
const CONNECT_STRING = require('./global-env').CONNECT_STRING;
const PROD_URL = require('./global-env').PROD_URL;
const https = require('https');
const http = require('http');
const mongoose = require("mongoose");
const topFiveModule = require('./handlers/top-five-handler');
const statModule = require('./handlers/stat-handler');
const dateCountModule = require('./handlers/date-count-handler');
const defaultBotChoiseModule = require('./handlers/default-bot-choise');
const helpModule = require('./handlers/help-handler');
const meModule = require('./handlers/me-handler');
const regModule = require('./handlers/reg-handler');
const gusiModule = require('./handlers/gusi-handler');


mongoose
    .connect(CONNECT_STRING)
    .then(() => console.log("MongoDB has started"))
    .catch(e => console.log(e));

require("./models/person.model");
require("./models/date.model");

console.log("Bot has been started ...");

const bot = new TelegramBot(TOKEN, {
    polling: true
});

setInterval(function () {
    https.get(PROD_URL);
}, 1200000);

setInterval(defaultBotChoiseModule.bind(this, bot), 60 * 60 * 1000 * 8);

bot.onText(/\/date_count/, dateCountModule.bind(this, bot));

bot.onText(/\/gusi/, gusiModule.bind(this, bot));

bot.onText(/\/reg/, regModule.bind(this, bot));

bot.onText(/\/me/, meModule.bind(this, bot));

bot.onText(/\/stat/, statModule.bind(this, bot));

bot.onText(/\/help/, helpModule.bind(this, bot));

bot.onText(/\/top5/, topFiveModule.bind(this, bot));

http.createServer().listen(process.env.PORT || 5000).on('request', (req, res) => {
    res.end('Server has started')
});
