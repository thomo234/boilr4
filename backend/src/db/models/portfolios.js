const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const portfolios = sequelize.define(
    'portfolios',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      description: {
        type: DataTypes.TEXT,
      },

      price: {
        type: DataTypes.DECIMAL,
      },

      issue_number: {
        type: DataTypes.INTEGER,
      },

      dimensions: {
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

  portfolios.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.portfolios.belongsTo(db.profiles, {
      as: 'profile',
      foreignKey: {
        name: 'profileId',
      },
      constraints: false,
    });

    db.portfolios.belongsTo(db.tenants, {
      as: 'tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.portfolios.hasMany(db.file, {
      as: 'images',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.portfolios.getTableName(),
        belongsToColumn: 'images',
      },
    });

    db.portfolios.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.portfolios.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return portfolios;
};
