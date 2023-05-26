const { modals } = require("../../ui");
const { reloadAppHome, deleteTask } = require("../../utilities");

const deleteTaskModalCallback = async ({ ack, view, body, client }) => {
    try {
        await deleteTask(view.private_metadata, client);

        await ack();

        await reloadAppHome(client, body.user.id, body.team.id);
    } catch (error) {
        await ack({
            response_action: "update",
            view: modals.taskCreationError("", "deleting task"),
        });
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { deleteTaskModalCallback };
