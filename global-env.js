const MAIN_CONV_ID = '-302362122'; //'-302362122'; //
const TOKEN = "479215318:AAENNSIFasERmQy5i4rve48latNkAPejOwo";
const MESSAGES = [
    ['Кто сегодня счастливчик?', 'Военный спутник запущен, коды доступа внутри...', 'Кто бы мог подумать, но гусь дня ты -'],
    ['Опять в эти ваши игрульки играете? Ну ладно...', 'Хм...', 'Ведётся захват подозреваемого...', 'Анализ завершен. Ты гусь,'],
    ['Итак... кто же сегодня гусь дня?', 'Где-же он...', 'Проверяю данные...', 'Ну ты и гусь,']
];

const PROD_URL = "https://prod-telegram-bot.herokuapp.com";

const CONNECT_STRING = "mongodb+srv://korotinbot:11223344q4@cluster0.jhmxc.mongodb.net/telegram_bot?retryWrites=true&w=majority";

module.exports.MAIN_CONV_ID = MAIN_CONV_ID;
module.exports.MESSAGES = MESSAGES;
module.exports.TOKEN = TOKEN;
module.exports.CONNECT_STRING = CONNECT_STRING;
module.exports.PROD_URL = PROD_URL;