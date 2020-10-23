import Sequelize from "sequelize";

export = {
    up: (queryInterface: Sequelize.QueryInterface) => {
        return queryInterface.createTable("groups", {
            id           : {
                allowNull    : false,
                primaryKey   : true,
                autoIncrement: true,
                type         : Sequelize.BIGINT
            },
            name   : {
                allowNull: false,
                type     : Sequelize.STRING
            },
            admin_id    : {
                allowNull: false,
                type     : Sequelize.BIGINT,
                references   : {
                    model: "users",
                    key: "id"
                },
                onDelete: "cascade"
            },
            code: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt    : {
                allowNull: true,
                type     : Sequelize.DATE
            },
            updatedAt    : {
                allowNull: true,
                type     : Sequelize.DATE
            },
            deletedAt    : {
                allowNull: true,
                type     : Sequelize.DATE
            }
        });
    },

    down: (queryInterface: Sequelize.QueryInterface) => {
        return queryInterface.dropTable("groups");
    }
};
