const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {}
    Task.init(
        {
            // Model attributes are defined here
            title: DataTypes.STRING,
            status: {
                type: DataTypes.ENUM,
                values: ["OPEN", "CLOSED"],
                defaultValue: "OPEN",
            },
            assignedTo: DataTypes.STRING,
            dueDate: DataTypes.DATE,
            msg: DataTypes.STRING,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Task",
        }
    );
    return Task;
};
