const main_conv_id = require('../global-env').MAIN_CONV_ID;

const messages = require('../global-env').MESSAGES;

const mongoose = require("mongoose");

const gusiHandler = (bot, query) => {
    if (query.chat.id != main_conv_id) {
        bot.sendMessage(query.chat.id, 'В этом чате нельзя использовать этого бота');
        return;
    }
    if (query.chat.type == "private") {
        bot.sendMessage(
            query.chat.id,
            `Меня можно использовать только в группах.\nДля этого создайте группу и добавьте меня в нее.
        `
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
        .find({
            getDate: {
                $in: [current_date.toLocaleDateString()]
            }
        })
        .then(dates => {
            if (current_date.toLocaleDateString() == dates[0].getDate) {
                var curr_gus = "";
                modelDate.find(function (err, goose) {
                    bot.sendMessage(
                        query.chat.id,
                        `Сегодня уже определяли Гуся, это - ${dates[0].current_goose}`
                    );
                });
            }
        })
        .catch(e => {
            const person_array = [];
            Person.find({
                Group_id: {
                    $in: [query.chat.id]
                }
            })
                .then(users => {
                    if (!users[0]) {
                        bot.sendMessage(
                            query.chat.id,
                            "Нету зарегистрированных пользователей в этой группе."
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

                    function Queue() {
                        this.data = [];
                    }

                    Queue.prototype.add = function (record) {
                        this.data.unshift(record);
                    }
                    Queue.prototype.remove = function () {
                        this.data.pop();
                    }

                    Queue.prototype.first = function () {
                        return this.data[0];
                    }

                    const queue = new Queue();
                
                    const randomMessage = Math.floor(
                        Math.random() * messages.length
                    );

                    const delay = (duration) =>
                            new Promise(resolve => setTimeout(resolve, duration));

                    async function processArray(array) {
                        for(const [index, item] of array.entries()){
                            queue.add(item);
                            index === messages[randomMessage].length - 1
                             ? await bot.sendMessage(query.chat.id, `${queue.first()} ${current_goose}`)
                             : await bot.sendMessage(query.chat.id, queue.first())
                            queue.remove();
                            await delay(2000);
                        };
                    }

                    processArray(messages[randomMessage]);
                    var counter = 0;
                    const сurr_goose = new modelDate({
                        getDate: current_date.toLocaleDateString(),
                        current_goose: current_goose,
                        year: current_date.getFullYear()
                    });
                    const getPerson = Person.find({
                        Name: {
                            $in: [current_goose]
                        }
                    })
                        .then(get_person => {
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

                    сurr_goose.save();
                })
                .catch(e => {
                    console.log("Ошибка2 - ", e);
                });
        });
}

module.exports = gusiHandler;