const main_conv_id = require('../global-env').MAIN_CONV_ID;

const mongoose = require("mongoose");

const regHandler = (bot, query) => {
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

    const wasCreated = `Вы уже были зарегистрированы в этой игре.`;
    const willBeCreate = `Я тебя запомнил, Гусяра - ${query.from.first_name}`;

    const Person = mongoose.model("person");
    const person = new Person({
        Name: query.from.first_name,
        Identificator: query.from.id,
        Counter_Goose: 0,
        Group_id: query.chat.id
    });

    const getPerson = Person.find({
        Identificator: {
            $in: [query.from.id]
        }
    })
        .then(persons => {
            if (query.from.id == persons[0].Identificator) {
                bot.sendMessage(query.chat.id, wasCreated);
            }
        })
        .catch(e => {
            person.save();
            bot.sendMessage(query.chat.id, willBeCreate);
        });
}

module.exports = regHandler;