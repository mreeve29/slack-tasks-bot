const {
    HomeTab,
    Header,
    Divider,
    Section,
    Actions,
    Elements,
} = require("slack-block-builder");
const pluralize = require("pluralize");
const { DateTime } = require("luxon");

module.exports = (recentlyCompletedTasks) => {
    const homeTab = HomeTab({
        callbackId: "tasks-home",
        privateMetaData: "completed",
    }).blocks(
        Header({ text: "CORE Tasks Dashboard" }),
        Actions({ blockId: "task-creation-actions" }).elements(
            Elements.Button({ text: "Open tasks" })
                .value("dashboard-nav-open")
                .actionId("dashboard-nav-open"),
            Elements.Button({ text: "Completed tasks" })
                .value("dashboard-nav-completed")
                .actionId("dashboard-nav-completed")
                .primary(true),
            Elements.Button({ text: "Create a task" })
                .value("dashboard-nav-create-a-task")
                .actionId("dashboard-nav-create-a-task")
        )
    );

    if (recentlyCompletedTasks.length === 0) {
        homeTab.blocks(Header({ text: "No completed tasks" }), Divider());
        return homeTab.buildToJSON();
    }

    var completedTaskList = [];

    recentlyCompletedTasks.forEach(([task, assignedName, completedName]) => {
        let headerText = task.title;
        if (task.priority == "HIGH") {
            headerText += " :red_circle:";
        }

        const date = DateTime.fromJSDate(task.completedDate).toFormat(
            "ccc LLL d t"
        );

        completedTaskList.push(
            Header({ type: "mrkdwn", text: `${headerText}` }),
            Section({
                text: `:bust_in_silhouette: ${assignedName}\n:white_check_mark: ${completedName} at *${date}*`,
            }).accessory(
                Elements.Button({ text: "Reopen" })
                    .value(`${task.id}`)
                    .actionId("reopen-task")
            ),
            Divider()
        );
    });

    homeTab.blocks(
        Header({
            text: `${
                recentlyCompletedTasks.length
            } recently completed ${pluralize(
                "task",
                recentlyCompletedTasks.length
            )}`,
        }),
        Divider(),
        completedTaskList.slice(0, -1)
    );

    return homeTab.buildToJSON();
};
