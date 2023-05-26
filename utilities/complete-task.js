const { Op } = require("sequelize");

const { Task } = require("../models");

module.exports = async (taskID, client) => {
    try {
        let task = await Task.findOne({ where: { id: taskID } });
        // delete message if exists
        if (task.msg) {
            await client.chat.delete({ channel: "C058WL28V8D", ts: task.msg });
        }
        task.status = "CLOSED";
        task.msg = null;
        await task.save();
    } catch (error) {
        console.log(error);
    }
};
