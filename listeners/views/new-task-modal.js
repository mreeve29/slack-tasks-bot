const { DateTime } = require("luxon");

const { User, Task } = require("../../models");
const { modals } = require("../../ui");
const { taskMsg } = require("../../ui/messages");
const { reloadAppHome } = require("../../utilities");

const newTaskModalCallback = async ({ ack, view, body, client }) => {
    const providedValues = view.state.values;

    const taskTitle = providedValues.taskTitle.taskTitle.value;

    const selectedDate = providedValues.taskDueDate.taskDueDate.selected_date;
    const selectedTime = providedValues.taskDueTime.taskDueTime.selected_time;

    const selectedUser =
        providedValues.taskAssignUser.taskAssignUser.selected_user;

    const priority =
        providedValues.taskPriority.taskPriority.selected_option.value;

    const task = Task.build({ title: taskTitle, priority: priority });

    const taskDueDate = DateTime.fromISO(`${selectedDate}T${selectedTime}`);
    const diffInDays = taskDueDate.diffNow("days").toObject().days;
    // Task due date is in the past, so reject
    if (diffInDays < 0) {
        await ack({
            response_action: "errors",
            errors: {
                taskDueDate: "Please select a due date in the future",
                taskDueTime: "Please select a time in the future",
            },
        });
        return;
    }
    task.dueDate = taskDueDate;

    if (selectedUser) {
        task.assignedTo = selectedUser;
    }

    try {
        await task.save();

        if (selectedUser == null) {
            // send message and then save it's timestamp in the db
            const messageResponse = await client.chat.postMessage(
                taskMsg(taskTitle, taskDueDate.toFormat("ccc LLL d t"), task.id)
            );
            if (messageResponse.ok) {
                task.msg = messageResponse.ts;
                await task.save();
            }
        }

        await ack({
            response_action: "update",
            view: modals.taskCreated(taskTitle, "created"),
        });

        await reloadAppHome(client, body.user.id, body.team.id);
    } catch (error) {
        await ack({
            response_action: "update",
            view: modals.taskError(taskTitle, "creating"),
        });
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { newTaskModalCallback };
