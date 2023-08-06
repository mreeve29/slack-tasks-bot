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
                order: [["completedDate", "DESC"]],
            });

            const tasks = await addNamesToClosedTasks(
                recentlyCompletedTasks,
                client
            );

            await client.views.publish({
                user_id: slackUserID,
                view: completedTasksView(tasks),
            });
            return;
        }

        const openTasks = await Task.findAll({
            where: {
                status: "OPEN",
            },
            order: [["dueDate", "ASC"]],
        });

        const tasks = await addNamesToOpenTasks(openTasks, client);

        await client.views.publish({
            user_id: slackUserID,
            view: openTasksView(tasks),
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

const addNamesToOpenTasks = async (arr, client) => {
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

const addNamesToClosedTasks = async (arr, client) => {
    new_arr = [];
    for (t of arr) {
        const assignedUserId = t.assignedTo;
        const completedUserId = t.completedBy;
        if (assignedUserId == null || completedUserId == null) {
            new_arr.push([t, null, null]);
        } else {
            try {
                // Call the users.info method using the WebClient

                let assignedName = "";
                let completedName = "";

                if (assignedUserId === completedUserId) {
                    const assignedResult = await client.users.info({
                        user: assignedUserId,
                    });
                    assignedName = assignedResult.user.real_name;
                    completedName = assignedName;
                } else {
                    const assignedResult = await client.users.info({
                        user: assignedUserId,
                    });

                    const completedResult = await client.users.info({
                        user: completedUserId,
                    });

                    assignedName = assignedResult.user.real_name;
                    completedName = completedResult.user.real_name;
                }

                new_arr.push([t, assignedName, completedName]);
            } catch (error) {
                console.error(error);
                new_arr.push([t, "error getting name", "error getting name"]);
            }
        }
    }
    return new_arr;
};
