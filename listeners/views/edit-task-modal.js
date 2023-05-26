const { DateTime } = require("luxon");

const { User, Task } = require("../../models");
const { modals } = require("../../ui");
const { taskMsg } = require("../../ui/messages");
const { reloadAppHome } = require("../../utilities");

const editTaskModalCallback = async ({ ack, view, body, client }) => {
    const providedValues = view.state.values;

    const taskTitle = providedValues.taskTitle.taskTitle.value;

    const selectedDate = providedValues.taskDueDate.taskDueDate.selected_date;
    const selectedTime = providedValues.taskDueTime.taskDueTime.selected_time;

    const selectedUser =
        providedValues.taskAssignUser.taskAssignUser.selected_user;

    let task = await Task.findOne({ where: { id: view.private_metadata } });

    const previousAssigned = task.assignedTo;

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

    try {
        task.dueDate = taskDueDate;
        task.title = taskTitle;
        task.assignedTo = selectedUser;

        await task.save();

        // 3 cases:
        //   no user to start with, no user to end with
        //   no user to start with, user selected at end
        //   user to start with, no user to end with
        if (selectedUser == null && previousAssigned != null) {
            // no user to end with
            // send message and then save it's timestamp in the db
            const messageResponse = await client.chat.postMessage(
                taskMsg(taskTitle, taskDueDate.toFormat("ccc LLL d t"), task.id)
            );
            if (messageResponse.ok) {
                task.msg = messageResponse.ts;
                await task.save();
            }
        } else if (previousAssigned == null && selectedUser != null) {
            // delete msg if it exists
            if (task.msg) {
                try {
                    await client.chat.delete({
                        channel: "C058WL28V8D",
                        ts: task.msg,
                    });

                    task.msg = null;
                    await task.save();
                } catch (error) {
                    console.log(error);
                }
            }
        }

        await ack({
            response_action: "update",
            view: modals.taskCreated(taskTitle, "updated"),
        });

        await reloadAppHome(client, body.user.id, body.team.id);
    } catch (error) {
        await ack({
            response_action: "update",
            view: modals.taskCreationError(taskTitle, "updating"),
        });
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { editTaskModalCallback };
