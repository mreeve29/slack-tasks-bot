const { Task } = require("../../models");
const { reloadAppHome } = require("../../utilities");

const reopenTaskCallback = async ({ ack, action, client, body }) => {
    await ack();

    let task = await Task.findOne({ where: { id: action.value } });

    task.status = "OPEN";
    task.completedDate = null;
    task.completedBy = null;
    await task.save();

    await reloadAppHome(client, body.user.id, body.team.id, "completed");
};

module.exports = {
    reopenTaskCallback,
};
