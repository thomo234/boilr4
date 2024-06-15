const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const messages = sequelize.define(
    'messages',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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

  messages.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.messages.belongsTo(db.users, {
      as: 'sender',
      foreignKey: {
        name: 'senderId',
      },
      constraints: false,
    });

    db.messages.belongsTo(db.users, {
      as: 'receiver',
      foreignKey: {
        name: 'receiverId',
      },
      constraints: false,
    });

    db.messages.belongsTo(db.tenants, {
      as: 'tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.messages.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.messages.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return messages;
};
