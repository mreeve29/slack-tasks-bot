const { reloadAppHome, completeTask, assignTask } = require("../../utilities");
const { editTask, deleteTask } = require("../../ui/modals");
const { Task } = require("../../models");

const openTaskCheckboxClickedCallback = async ({
    ack,
    action,
    client,
    body,
}) => {
    await ack();
    if (action.selected_option) {
        const type = action.selected_option.value.split("-")[0];

        if (type === "complete") {
            await completeTask(
                action.selected_option.value.split("-")[2],
                body,
                client
            );
            await reloadAppHome(client, body.user.id, body.team.id);
        } else if (type === "edit") {
            //get task from DB

            const task = await Task.findOne({
                where: { id: action.selected_option.value.split("-")[2] },
            });

            await client.views.open({
                trigger_id: body.trigger_id,
                view: editTask(
                    task,
                    action.selected_option.value.split("-")[2]
                ),
            });
        } else if (type === "delete") {
            const task = await Task.findOne({
                where: { id: action.selected_option.value.split("-")[2] },
            });
            await client.views.open({
                trigger_id: body.trigger_id,
                view: deleteTask(
                    task.title,
                    action.selected_option.value.split("-")[2]
                ),
            });
        } else if (type === "assign") {
            await assignTask(
                action.selected_option.value.split("-")[2],
                body,
                client
            );
            await reloadAppHome(client, body.user.id, body.team.id);
        }
    }
};

// TODO: reformat action_ids to all be snake cased
module.exports = {
    openTaskCheckboxClickedCallback,
};
