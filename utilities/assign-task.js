const { Task } = require("../models");

module.exports = async (taskID, body, client) => {
    try {
        let task = await Task.findOne({ where: { id: taskID } });
        task.assignedTo = body.user.id;
        await task.save();
        // delete message
        await client.chat.delete({ channel: "C058WL28V8D", ts: task.msg });
        task.msg = null;
        await task.save();
    } catch (error) {
        console.log(error);
    }
};
