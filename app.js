require("dotenv").config();

const { App, LogLevel } = require("@slack/bolt");

const { Sequelize } = require("sequelize");

const { registerListeners } = require("./listeners");

const { BirthdayCheck } = require("./birthdays/birthdayCheck");

const { CronJob } = require("cron");

const sequelize = new Sequelize(process.env.DB_URI);

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    loglevel: LogLevel.INFO,
});

registerListeners(app);
(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        // eslint-disable-next-line no-console
        console.log("All models were synchronized successfully.");
        // eslint-disable-next-line no-console
        console.log("Connection has been established successfully.");
        // Start app
        await app.start();

        // creates a job to check for birthdays at 9:30am every day
        var birthdayJob = new CronJob(
            // syntax: second minute hour day month year, * = any
            "00 30 9 * * *",
            function () {
                BirthdayCheck(app.client);
            },
            null,
            true,
            "America/New_York"
        );

        // TODO: add daily message to to-do channel for tasks due that day
        // creates a job to send tasks for the day at 9:30am every day
        // var birthdayJob = new CronJob(
        //     // syntax: second minute hour day month year, * = any
        //     "00 30 9 * * *",
        //     function () {
        //         // add task message sender
        //     },
        //     null,
        //     true,
        //     "America/New_York"
        // );

        // eslint-disable-next-line no-console
        console.log("⚡️ Tasks app is running!");
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Unable to start App", error);
        process.exit(1);
    }
})();
