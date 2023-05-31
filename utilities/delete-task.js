const { Op } = require("sequelize");

const { Task } = require("../models");

module.exports = async (taskID, client) => {
    try {
        const task = await Task.findOne({ where: { id: taskID } });
        // delete message if exists
        if (task.msg) {
            await client.chat.delete({
                channel: process.env.TODO_CHANNEL,
                ts: task.msg,
            });
        }
        await Task.destroy({ where: { id: taskID } });
    } catch (error) {
        console.log(error);
    }
};
