const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const pages = sequelize.define(
    'pages',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      content: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  pages.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.pages.belongsTo(db.profiles, {
      as: 'profile',
      foreignKey: {
        name: 'profileId',
      },
      constraints: false,
    });

    db.pages.belongsTo(db.tenants, {
      as: 'tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.pages.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.pages.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return pages;
};
