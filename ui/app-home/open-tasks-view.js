const {
    HomeTab,
    Header,
    Divider,
    Section,
    Actions,
    Elements,
    Input,
    Bits,
} = require("slack-block-builder");
const pluralize = require("pluralize");
const { DateTime } = require("luxon");

module.exports = (openTasks) => {
    const homeTab = HomeTab({
        callbackId: "tasks-home",
        privateMetaData: "open",
    }).blocks(
        Header({ text: "CORE Tasks Dashboard" }),
        Actions({ blockId: "task-creation-actions" }).elements(
            Elements.Button({ text: "Open tasks" })
                .value("app-home-nav-open")
                .actionId("app-home-nav-open")
                .primary(true),
            Elements.Button({ text: "Completed tasks" })
                .value("app-home-nav-completed")
                .actionId("app-home-nav-completed"),
            Elements.Button({ text: "Create a task" })
                .value("app-home-nav-create-a-task")
                .actionId("app-home-nav-create-a-task")
        )
    );

    if (openTasks.length === 0) {
        homeTab.blocks(
            Header({ text: "No open tasks" }),
            Divider(),
            Section({ text: "Looks like you've got nothing to do." })
        );
        return homeTab.buildToJSON();
    }

    const tasksInputsArray = [];

    for (const [task, name] of openTasks) {
        const date = DateTime.fromJSDate(task.dueDate).toFormat("ccc LLL d t");
        const sectionNameText = name ? name : "No assigned person";

        const option = name
            ? Bits.Option({
                  text: ":white_check_mark: Mark as completed",
                  value: `complete-task-${task.id}`,
                  emoji: "true",
              })
            : Bits.Option({
                  text: ":man-raising-hand: Take on Task",
                  value: `assign-task-${task.id}`,
                  emoji: "true",
              });

        tasksInputsArray.push(
            Header({ text: `${task.title}` }),
            Section({
                type: "mrkdwn",
                text: `${sectionNameText}\nDue: *${date}*`,
            }).accessory(
                Elements.OverflowMenu()
                    .actionId("blockOpenTaskCheckboxClicked")
                    .options([
                        option,
                        Bits.Option({
                            text: ":memo: Edit task",
                            value: `edit-task-${task.id}`,
                            emoji: "true",
                        }),
                        Bits.Option({
                            text: ":wastebasket: Delete task",
                            value: `delete-task-${task.id}`,
                            emoji: "true",
                        }),
                    ])
            ),
            Divider()
        );
    }

    homeTab.blocks(
        Header({
            text: `${openTasks.length} open ${pluralize(
                "task",
                openTasks.length
            )}`,
        }),
        Divider(),
        tasksInputsArray.slice(0, -1)
    );
    return homeTab.buildToJSON();
};
