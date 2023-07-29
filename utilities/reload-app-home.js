const {
    openTasksView,
    completedTasksView,
    noAccessView,
} = require("../ui/dashboard");
const { Task } = require("../models");

const { ids } = require("../slackIDs.json", { throws: true });

module.exports = async (client, slackUserID, slackWorkspaceID, navTab) => {
    // check if user has access to bot
    if (ids) {
        if (!ids.includes(slackUserID)) {
            // user does not have access to tasks page
            // show them a default view
            try {
                await client.views.publish({
                    user_id: slackUserID,
                    view: noAccessView(),
                });
                return;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
            }
        }
    }

    try {
        if (navTab === "completed") {
            const recentlyCompletedTasks = await Task.findAll({
                where: { status: "CLOSED" },
            });

            await client.views.publish({
                user_id: slackUserID,
                view: completedTasksView(recentlyCompletedTasks),
            });
            return;
        }

        const openTasks = await Task.findAll({
            where: {
                status: "OPEN",
            },
            order: [["dueDate", "ASC"]],
        });

        const tasks = await addNamesToTasks(openTasks, client);

        await client.views.publish({
            user_id: slackUserID,
            view: openTasksView(tasks),
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

const addNamesToTasks = async (arr, client) => {
    new_arr = [];
    for (t of arr) {
        const userId = t.assignedTo;
        if (userId == null) {
            new_arr.push([t, null]);
        } else {
            try {
                // Call the users.info method using the WebClient
                const result = await client.users.info({
                    user: userId,
                });

                new_arr.push([t, result.user.real_name]);
            } catch (error) {
                console.error(error);
                new_arr.push([t, "error getting name"]);
            }
        }
    }
    return new_arr;
};
