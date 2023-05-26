const {
    HomeTab,
    Header,
    Divider,
    Section,
    Actions,
    Elements,
} = require("slack-block-builder");
const pluralize = require("pluralize");

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
        homeTab.blocks(
            Header({ text: "No completed tasks" }),
            Divider(),
            Section({ text: "Looks like you've got nothing completed." })
        );
        return homeTab.buildToJSON();
    }

    const completedTaskList = recentlyCompletedTasks.map((task) =>
        Section({ text: `• ~${task.title}~` }).accessory(
            Elements.Button({ text: "Reopen" })
                .value(`${task.id}`)
                .actionId("reopen-task")
        )
    );

    homeTab.blocks(
        Header({
            text: `You have ${
                recentlyCompletedTasks.length
            } recently completed ${pluralize(
                "task",
                recentlyCompletedTasks.length
            )}`,
        }),
        Divider(),
        completedTaskList
    );

    return homeTab.buildToJSON();
};
