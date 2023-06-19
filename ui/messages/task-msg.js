const {
    Message,
    Section,
    Button,
    Header,
    Actions,
} = require("slack-block-builder");

const taskMessage = (taskTitle, priority, dueDate, taskID) =>
    Message({
        channel: process.env.TODO_CHANNEL,
        text: `A todo needs a do-er!`,
    })
        .blocks(taskBlocks(taskTitle, priority, dueDate, taskID))
        .asUser(true)
        .buildToObject();

const taskBlocks = (taskTitle, priority, dueDate, taskID) => {
    let headerText = taskTitle;
    if (priority == "HIGH") {
        headerText += " :red_circle:";
    }
    return [
        Header({ text: `A todo needs a do-er:` }),
        Section({
            type: "mrkdwn",
            text: `*${headerText}*\nDue Date: ${dueDate}`,
        }),
        Actions({ blockId: "button-assign-task" }).elements(
            Button({
                text: "Take on Task",
                value: `assign-task-${taskID}`,
                actionId: "button-assign-task",
            }).primary(true)
        ),
    ];
};

module.exports = {
    taskMessage,
    taskBlocks,
};
