const { Modal, Blocks } = require("slack-block-builder");

module.exports = (taskTitle, type) =>
    Modal({ title: `Task ${type}`, callbackId: `task-${type}-modal` })
        .blocks(
            Blocks.Section({
                text: `${taskTitle} ${type}`,
            })
        )
        .buildToJSON();
