const main_conv_id = require('../global-env').MAIN_CONV_ID;

const mongoose = require("mongoose");

const defaultBotChoiseHandler = (bot) => {
    const current_date = new Date();
    const modelDate = mongoose.model("get_date");
    const get_model_date = modelDate
        .find({
            getDate: {
                $in: [current_date.toLocaleDateString()]
            }
        })
        .then(dates => {
            if (!dates.length) {
                const Person = mongoose.model("person");
                const person_array = [];
                Person.find({
                    Group_id: {
                        $in: [main_conv_id]
                    }
                })
                    .then(users => {
                        if (!users[0]) {
                            bot.sendMessage(
                                main_conv_id,
                                "Зарегистрируйте пользователя, чтобы я могу выбрать Гуся."
                            );
                            return;
                        }
                        for (let i = 0; i < users.length; i++) {
                            person_array.push(`${users[i].Name}`);
                        }
                        const what_is_the_goose = Math.floor(
                            Math.random() * person_array.length
                        );
                        const current_goose = person_array[what_is_the_goose];
                        bot.sendMessage(
                            main_conv_id,
                            `Раз вы не хотите выбирать гуся - получайте, Гусь дня - ${current_goose}`
                        );
                        let counter = 0;
                        const curr_goose = new modelDate({
                            getDate: current_date.toLocaleDateString(),
                            current_goose: current_goose,
                            year: current_date.getFullYear()
                        });
                        const getPerson = Person.find({
                            Name: {
                                $in: [current_goose]
                            }
                        }).then(get_person => {
                            counter = get_person[0].Counter_Goose + 1;
                            Person.update({
                                Identificator: get_person[0].Identificator
                            }, {
                                    Counter_Goose: counter
                                },
                                err => {
                                }
                            );
                        })
                            .catch(err => {
                                console.log("Ошибка1 - ", err);
                            });

                        curr_goose.save();
                    })
                    .catch(e => {
                        console.log("Ошибка2 - ", e);
                    });
            }
        })
        .catch(e => {
            console.log(e);
        })
}

module.exports = defaultBotChoiseHandler;