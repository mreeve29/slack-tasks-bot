const { Message } = require("slack-block-builder");

// from: https://stackoverflow.com/a/15397495
const nth = function (d) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

const determineAge = (date) => {
    const today = new Date();
    const diffYears = today.getFullYear() - date.getFullYear();
    return `${diffYears}${nth(diffYears)}`;
};

module.exports = (name, bday) =>
    Message({
        channel: process.env.BDAY_CHANNEL,
        text: `:birthday: Happy ${determineAge(
            bday
        )} Birthday ${name}! :partying_face:`,
    }).buildToObject();
