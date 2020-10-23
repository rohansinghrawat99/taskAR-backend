import Sequelize from "sequelize";
import { Helpers } from "../util/helpers.util";
import { TaskStatus } from "../util/enum.util";

export = {
    up: (queryInterface: Sequelize.QueryInterface) => {
        return queryInterface.createTable("tasks", {
            id           : {
                allowNull    : false,
                primaryKey   : true,
                autoIncrement: true,
                type         : Sequelize.BIGINT
            },
            title    : {
                allowNull: false,
                type     : Sequelize.STRING,
            },
            description    : {
                allowNull: false,
                type     : Sequelize.STRING,
            },
            group_id    : {
                allowNull: true,
                type     : Sequelize.BIGINT,
                references   : {
                    model: "groups",
                    key: "id"
                },
                onDelete: "cascade"
            },
            assigned_to_id    : {
                allowNull: true,
                type     : Sequelize.BIGINT,
                references   : {
                    model: "users",
                    key: "id"
                },
                onDelete: "cascade"
            },
            due_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM,
                values: Helpers.iterateEnum(TaskStatus),
                allowNull: false
            },
            creator_id: {
                type: Sequelize.BIGINT,
                references   : {
                    model: "users",
                    key: "id"
                },
                onDelete: "cascade"
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
        return queryInterface.dropTable("tasks");
    }
};
