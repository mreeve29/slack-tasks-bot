const { Modal, Blocks, Elements, Bits } = require("slack-block-builder");

const priorityOptions = [
    Bits.Option({
        text: "Normal",
        value: "NORMAL",
    }),
    Bits.Option({
        text: "High",
        value: "HIGH",
    }),
];

module.exports = (prefilledTitle, currentUser) => {
    const textInput = (taskTitle) => {
        if (taskTitle) {
            return Elements.TextInput({
                placeholder: "Task Name",
                actionId: "taskTitle",
                initialValue: taskTitle,
            });
        }
        return Elements.TextInput({
            placeholder: "Task Name",
            actionId: "taskTitle",
        });
    };

    return Modal({
        title: "Create new task",
        submit: "Create",
        callbackId: "new-task-modal",
    })
        .blocks(
            Blocks.Input({ label: "New task", blockId: "taskTitle" }).element(
                textInput(prefilledTitle)
            ),
            Blocks.Input({
                label: "Assign user",
                blockId: "taskAssignUser",
                optional: true,
            }).element(
                Elements.UserSelect({
                    actionId: "taskAssignUser",
                }).initialUser(currentUser)
            ),
            Blocks.Input({ label: "Due date", blockId: "taskDueDate" }).element(
                Elements.DatePicker({
                    actionId: "taskDueDate",
                })
            ),
            Blocks.Input({ label: "Time", blockId: "taskDueTime" }).element(
                Elements.TimePicker({
                    actionId: "taskDueTime",
                })
            ),
            Blocks.Input({
                label: "Priority",
                blockId: "taskPriority",
            }).element(
                Elements.StaticSelect({
                    actionId: "taskPriority",
                })
                    .options(priorityOptions)
                    .initialOption(priorityOptions[0])
            )
        )
        .buildToJSON();
};
