const fs = require("fs");
const { birthdayMsg } = require("../ui/messages");

const path = "birthdays/birthdays.json";

const BirthdayCheck = (client) => {
    if (fs.existsSync(path)) {
        //birthdays file exists
        fs.readFile(path, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            const today = new Date();
            const bdayArr = JSON.parse(data).birthdays.map((x) => {
                x.birthday = new Date(x.birthday);
                return x;
            });
            const todaysBDays = bdayArr.filter(
                (b) =>
                    today.getDate() === b.birthday.getDate() &&
                    today.getMonth() === b.birthday.getMonth()
            );

            sendMessages(client, todaysBDays);
        });
    } else {
        console.log("birthdays.json does not exist");
    }
};

const sendMessages = async (client, bdays) => {
    for (b of bdays) {
        console.log(`${b.name}'s birthday!`);
        await client.chat.postMessage(birthdayMsg(b.name, b.birthday));
    }
};

module.exports = { BirthdayCheck };
