const MAIN_CONV_ID = '-1001260986848'; //'-302362122'; //
const TOKEN = "976221027:AAFrvjiUKpS3_pI5vuCJJ1ooKb47mO66dp4";
const MESSAGES = [
    ['Кто сегодня счастливчик?', 'Военный спутник запущен, коды доступа внутри...', 'Кто бы мог подумать, но гусь дня ты -'],
    ['Опять в эти ваши игрульки играете? Ну ладно...', 'Хм...', 'Ведётся захват подозреваемого...', 'Анализ завершен. Ты гусь,'],
    ['Итак... кто же сегодня гусь дня?', 'Где-же он...', 'Проверяю данные...', 'Ну ты и гусь,']
];

const PROD_URL = "https://prod-telegram-bot.herokuapp.com";

const CONNECT_STRING = "mongodb://KorotinDenysBot:11223344q4@ds117158.mlab.com:17158/telegram_bot_testing";

module.exports.MAIN_CONV_ID = MAIN_CONV_ID;
module.exports.MESSAGES = MESSAGES;
module.exports.TOKEN = TOKEN;
module.exports.CONNECT_STRING = CONNECT_STRING;
module.exports.PROD_URL = PROD_URL;