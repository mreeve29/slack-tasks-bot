module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Tasks", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.ENUM("OPEN", "CLOSED"),
            },
            priority: {
                type: Sequelize.ENUM("NORMAL", "HIGH"),
            },
            assignedTo: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            dueDate: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            msg: {
                allowNull: true,
                type: Sequelize.STRING,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("Tasks");
    },
};
