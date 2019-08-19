const main_conv_id = require('../global-env').MAIN_CONV_ID;

const helpHandler = (bot, query) => {
    if (query.chat.id != main_conv_id) {
        bot.sendMessage(query.chat.id, 'В этом чате нельзя использовать этого бота');
        return;
    }
    if (query.chat.type == "private") {
        bot.sendMessage(
            query.chat.id,
            "Меня можно использовать только в группах.\nДля этого создайте группу и добавьте меня в нее."
        );
        return;
    }
    bot.sendMessage(
        query.chat.id,
        `
    Вы можете воспользоваться такими командами:\n/me - Ваша статистика\n/reg - Зарегистрироваться в игре\n/top5 - Выводит Топ 5 Гусей\n/stat - Статистика по всем пользователям\n/help - Помощь по командам\n/gusi - Определить гуся
    `
    );
}

module.exports = helpHandler;