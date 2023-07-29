const { HomeTab, Header, Section } = require("slack-block-builder");

module.exports = () => {
    const homeTab = HomeTab({
        callbackId: "no-access-home",
    }).blocks(
        Header({ text: "You do not have access to the Tasks Bot" }),
        Section().text(
            `If you believe this is incorrect contact ${process.env.CONTACT_NAME}`
        )
    );

    return homeTab.buildToJSON();
};
