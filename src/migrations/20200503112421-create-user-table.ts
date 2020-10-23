import Sequelize from "sequelize";
import { Helpers } from "../util/helpers.util";
import { GroupRole } from "../util/enum.util";

export = {
  up: (queryInterface: Sequelize.QueryInterface) => {
    return queryInterface.createTable("users", {
      id           : {
        allowNull    : false,
        primaryKey   : true,
        autoIncrement: true,
        type         : Sequelize.BIGINT
      },
      google_id   : {
        allowNull: false,
        type     : Sequelize.STRING
      },
      name   : {
        allowNull: false,
        type     : Sequelize.STRING
      },
      email        : {
        allowNull: false,
        type     : Sequelize.STRING
      },
      profile_pic_url        : {
        allowNull: true,
        type     : Sequelize.STRING
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
    return queryInterface.dropTable("users");
  }
};
