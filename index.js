const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "479215318:AAENNSIFasERmQy5i4rve48latNkAPejOwo";
const http = require('http');
const debug = require("./modules/helpers");
const mongoose = require("mongoose");
const hours = 13;
const minutes = 00;
mongoose
    .connect(
        "mongodb://KorotinDenysBot:11223344q4@ds113738.mlab.com:13738/telegram_bot"
    )
    .then(() => console.log("MongoDB has started"))
    .catch(e => console.log(e));

require("./models/person.model");
require("./models/date.model");

console.log("Bot has been started ...");

const bot = new TelegramBot(TOKEN, {
    polling: true
});

// const check_time = setInterval(function () {
//     let date = new Date();

//     if (date.getHours() == hours && date.getMinutes() == minutes) {
//         bot.sendMessage(
//             347135150,
//             "Если вы не выберите Гуся дня, то это сделаю я!"
//         );
//         clearThisInterval();
//     }
// }, 3000);

// clearThisInterval = () => {
//     return clearInterval(check_time);
// };

bot.onText(/\/gusi/, query => {
    if (query.chat.id != "-302362122") {
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
        Name         : query.from.first_name,
        Identificator: query.from.id
    });

    const current_date = new Date();
    const modelDate = mongoose.model("get_date");
    const date = new modelDate({
        getDate: current_date.toLocaleDateString(),
        year   : current_date.getFullYear()
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
                    console.log('users-level-1', users)
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
                    bot.sendMessage(
                        query.chat.id,
                        `Итак, поздравьте нашего Гуся дня - ${current_goose}`
                    );
                    var counter = 0;
                    const сurr_goose = new modelDate({
                        getDate      : current_date.toLocaleDateString(),
                        current_goose: current_goose,
                        year         : current_date.getFullYear()
                    });
                    const getPerson = Person.find({
                        Name: {
                            $in: [current_goose]
                        }
                    })
                        .then(get_person => {
                            console.log('get_person-level-1', get_person)
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
});
bot.onText(/\/reg/, query => {
    if (query.chat.id != "-302362122") {
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
        Name         : query.from.first_name,
        Identificator: query.from.id,
        Counter_Goose: 0,
        Group_id     : query.chat.id
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
});

bot.onText(/\/me/, query => {
    if (query.chat.id != "-302362122") {
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
                        Name   : query.from.first_name,
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
});

bot.onText(/\/stat/, query => {
    if (query.chat.id != "-302362122") {
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
        .then(users => {
            if (!users[0]) {
                bot.sendMessage(
                    query.chat.id,
                    "Нету еще зарегистрированных пользователей"
                );
            } else {
                let text_stat = "";
                for (let i = 0; i < users.length; i++) {
                    text_stat += `${users[i].Name ? users[i].Name : ''} ${users[i].Surname ? users[i].Surname : ''} - ${users[i].Counter_Goose}\n`;
                }
                bot.sendMessage(
                    query.chat.id,
                    `Вот статистика по всем пользователям:\n${text_stat}`
                );
            }
        })
        .catch(ex => {
            bot.sendMessage(
                query.chat.id,
                "Нету еще зарегистрированных пользователей"
            );
        });
});

bot.onText(/\/help/, query => {
    if (query.chat.id != "-302362122") {
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
});

bot.onText(/\/top5/, query => {
    if (query.chat.id != "-302362122") {
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
});
http.createServer().listen(process.env.PORT || 5000).on('request', (req, res) => {
    res.end('')
});