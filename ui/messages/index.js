/* eslint-disable global-require */

const { taskMessage, taskBlocks } = require("./task-msg");

module.exports = {
    taskMessage: taskMessage,
    taskBlocks: taskBlocks,
    birthdayMsg: require("./birthday-msg"),
};
