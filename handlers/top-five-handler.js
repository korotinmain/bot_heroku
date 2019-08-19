const main_conv_id = require('../global-env').MAIN_CONV_ID;

const mongoose = require("mongoose");


const topFiveHandler = (bot, query) => {
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
    Person.find({
        Group_id: {
            $in: [query.chat.id]
        }
    })
        .sort({
            Counter_Goose: "desc"
        })
        .sort({
            Name: "asc"
        })
        .limit(5)
        .then(users => {
            let text_stat = "";
            for (let i = 0; i < users.length; i++) {
                text_stat += `${users[i].Name ? users[i].Name : ''} ${users[i].Surname ? users[i].Surname : ''} - ${users[i].Counter_Goose}\n`;
            }
            if (users.length < 5) {
                bot.sendMessage(
                    query.chat.id,
                    `Сейчас количество участников ${
                    users.length
                    }. Вот их результаты:\n${text_stat}`
                );
            } else {
                bot.sendMessage(query.chat.id, `Топ 5 Гусей:\n${text_stat}`);
            }
        });
}

module.exports = topFiveHandler;