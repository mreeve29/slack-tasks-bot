const { modals } = require("../../ui");

const appDashboardCreateATaskCallback = async ({ body, ack, client }) => {
    try {
        await ack();
        await client.views.open({
            trigger_id: body.trigger_id,
            view: modals.newTask(null, body.user.id),
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = {
    appDashboardCreateATaskCallback,
};
