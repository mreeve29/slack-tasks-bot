const { DateTime } = require("luxon");
const { Task } = require("../models");

module.exports = async (taskID, body, client) => {
    try {
        let task = await Task.findOne({ where: { id: taskID } });
        // delete message if exists
        if (task.msg) {
            await client.chat.delete({
                channel: process.env.TODO_CHANNEL,
                ts: task.msg,
            });
        }
        task.status = "CLOSED";
        task.completedDate = DateTime.now();
        task.completedBy = body.user.id;
        task.msg = null;
        await task.save();
    } catch (error) {
        console.log(error);
    }
};
