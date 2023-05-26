require("dotenv").config();

const { App, LogLevel } = require("@slack/bolt");

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URI);

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    loglevel: LogLevel.INFO,
});

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

        // eslint-disable-next-line no-console
        console.log("⚡️ Tasks app is running!");
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Unable to start App", error);
        process.exit(1);
    }
})();
