const main_conv_id = require('../global-env').MAIN_CONV_ID;

const mongoose = require("mongoose");

const text_forms = ['день', 'дня', 'дней'];

const getDayString = (n) => {
    n = Math.abs(n) % 100; var n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}

const dateCountHandler = (bot, query) => {

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
    const Person = mongoose.model("person");
    const person = new Person({
        Name: query.from.first_name,
        Identificator: query.from.id
    });

    const current_date = new Date();
    const modelDate = mongoose.model("get_date");
    const date = new modelDate({
        getDate: current_date.toLocaleDateString(),
        year: current_date.getFullYear()
    });

    const get_model_date = modelDate
        .find()
        .then(dates => {
            const dayCountString = getDayString(dates.length);
            bot.sendMessage(query.chat.id, `Этот бот уже работает ${dates.length} ${dayCountString}`);
        })
        .catch(e => {
            console.log(e);
        });
}

module.exports = dateCountHandler;