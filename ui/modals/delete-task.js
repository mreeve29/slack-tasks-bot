const { Modal, Blocks, Elements } = require("slack-block-builder");
const { DateTime } = require("luxon");

module.exports = (taskTitle, taskID) => {
    return Modal({
        title: "Delete task?",
        submit: "Delete",
        callbackId: "delete-task-modal",
    })
        .blocks(
            Blocks.Header({
                text: `Are you sure you want to delete ${taskTitle}?`,
            })
        )
        .privateMetaData(taskID)
        .buildToJSON();
};
