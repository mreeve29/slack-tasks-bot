const { Modal, Blocks } = require("slack-block-builder");

module.exports = (taskTitle, type) =>
    Modal({
        title: "Something went wrong",
        callbackId: "task-creation-error-modal",
    })
        .blocks(
            Blocks.Section({
                text: `Error while ${type} ${taskTitle}`,
            })
        )
        .buildToJSON();
