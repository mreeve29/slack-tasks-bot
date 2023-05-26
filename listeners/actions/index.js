const {
    appDashboardCompletedCallback,
} = require("./block_dashboard-nav-completed");
const {
    appDashboardCreateATaskCallback,
} = require("./block_dashboard-nav-create-a-task");
const { appDashboardOpenCallback } = require("./block_dashboard-nav-open");
const { buttonMarkAsDoneCallback } = require("./block_button-mark-as-done");
const { reopenTaskCallback } = require("./block_reopen-task");
const {
    openTaskCheckboxClickedCallback,
} = require("./block_open_task_list_home");
const { assignTask } = require("../../utilities");

module.exports.register = (app) => {
    app.action(
        { action_id: "dashboard-nav-completed", type: "block_actions" },
        appDashboardCompletedCallback
    );
    app.action("dashboard-nav-create-a-task", appDashboardCreateATaskCallback);
    app.action(
        { action_id: "dashboard-nav-open", type: "block_actions" },
        appDashboardOpenCallback
    );
    app.action(
        { action_id: "button-mark-as-done", type: "block_actions" },
        buttonMarkAsDoneCallback
    );
    app.action(
        { action_id: "reopen-task", type: "block_actions" },
        reopenTaskCallback
    );
    app.action(
        {
            action_id: "blockOpenTaskCheckboxClicked",
            type: "block_actions",
        },
        openTaskCheckboxClickedCallback
    );

    app.action(
        {
            action_id: "button-assign-task",
            type: "block_actions",
        },
        async ({ ack, action, client, body }) => {
            const type = action.value.split("-")[0];
            if (type === "assign") {
                await assignTask(action.value.split("-")[2], body, client);
            }
        }
    );
};
