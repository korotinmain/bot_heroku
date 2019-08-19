const main_conv_id = require('../global-env').MAIN_CONV_ID;

const mongoose = require("mongoose");

const meHandler = (bot, query) => {
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
        Identificator: {
            $in: [query.from.id]
        }
    })
        .then(person => {
            let stat = `Статистика по пользователю ${
                query.from.first_name != undefined ? query.from.first_name : ""
                } ${
                query.from.last_name != undefined ? query.from.last_name : ""
                }:\nВы были ${person[0].Counter_Goose} раз(а) Гусем`;

            if (person[0].Name != query.from.first_name || person[0].Surname != query.from.last_name) {

                Person.update({
                    Identificator: person[0].Identificator
                }, {
                        Name: query.from.first_name,
                        Surname: query.from.last_name
                    },
                    err => {
                    }
                );

            }
            bot.sendMessage(query.chat.id, stat);
        })
        .catch(e => {
            bot.sendMessage(
                query.chat.id,
                `
            Вы не зарегистрированы, воспользуйтесь командой /reg, чтобы зарегестрироваться
        `
            );
        });
}

module.exports = meHandler;