import Sequelize from "sequelize";
import { Helpers } from "../util/helpers.util";
import { GroupRole, MemberStatus } from "../util/enum.util";

export = {
    up: (queryInterface: Sequelize.QueryInterface) => {
        return queryInterface.createTable("group_users", {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.BIGINT
            },
            group_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "groups",
                    key: "id"
                },
                onDelete: "cascade"
            },
            member_id: {
                allowNull: false,
                type: Sequelize.BIGINT,
                references: {
                    model: "users",
                    key: "id"
                },
                onDelete: "cascade"
            },
            role: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: Helpers.iterateEnum(GroupRole)
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM,
                values: Helpers.iterateEnum(MemberStatus),
                defaultValue: MemberStatus.PENDING
            },
            createdAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },

    down: (queryInterface: Sequelize.QueryInterface) => {
        return queryInterface.dropTable("group_users");
    }
};
