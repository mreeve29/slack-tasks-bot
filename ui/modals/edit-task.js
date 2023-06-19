const { Modal, Blocks, Elements, Bits } = require("slack-block-builder");
const { DateTime } = require("luxon");

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

module.exports = (task, taskID) => {
    const date = new Date(task.dueDate);

    const userSelectElt = task.assignedTo
        ? Elements.UserSelect({ actionId: "taskAssignUser" }).initialUser(
              task.assignedTo
          )
        : Elements.UserSelect({ actionId: "taskAssignUser" });

    let currentPriority = null;

    switch (task.priority) {
        case "NORMAL":
            currentPriority = priorityOptions[0];
            break;
        case "HIGH":
            currentPriority = priorityOptions[1];
            break;
    }

    return Modal({
        title: "Edit task",
        submit: "Save Changes",
        callbackId: "edit-task-modal",
    })
        .blocks(
            Blocks.Input({ label: "Task Name", blockId: "taskTitle" }).element(
                Elements.TextInput({
                    placeholder: "Task Name",
                    actionId: "taskTitle",
                    initialValue: task.title,
                })
            ),
            Blocks.Input({
                label: "Assign user",
                blockId: "taskAssignUser",
                optional: true,
            }).element(userSelectElt),
            Blocks.Input({ label: "Due date", blockId: "taskDueDate" }).element(
                Elements.DatePicker({
                    actionId: "taskDueDate",
                }).initialDate(date)
            ),
            Blocks.Input({ label: "Time", blockId: "taskDueTime" }).element(
                Elements.TimePicker({
                    actionId: "taskDueTime",
                }).initialTime(DateTime.fromJSDate(date).toFormat("HH:mm"))
            ),
            Blocks.Input({
                label: "Priority",
                blockId: "taskPriority",
            }).element(
                Elements.StaticSelect({
                    actionId: "taskPriority",
                })
                    .options(priorityOptions)
                    .initialOption(currentPriority)
            )
        )
        .privateMetaData(taskID)
        .buildToJSON();
};
