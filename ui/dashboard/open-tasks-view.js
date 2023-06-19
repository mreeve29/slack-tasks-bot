const {
    HomeTab,
    Header,
    Divider,
    Section,
    Actions,
    Elements,
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
                .value("dashboard-nav-open")
                .actionId("dashboard-nav-open")
                .primary(true),
            Elements.Button({ text: "Completed tasks" })
                .value("dashboard-nav-completed")
                .actionId("dashboard-nav-completed"),
            Elements.Button({ text: "Create a task" })
                .value("dashboard-nav-create-a-task")
                .actionId("dashboard-nav-create-a-task")
        )
    );

    if (openTasks.length === 0) {
        homeTab.blocks(Header({ text: "No open tasks" }), Divider());
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

        let headerText = task.title;
        if (task.priority == "HIGH") {
            headerText += " :red_circle:";
        }

        tasksInputsArray.push(
            Header({ text: `${headerText}` }),
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
