const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const tenants = sequelize.define(
    'tenants',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
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

  tenants.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.tenants.hasMany(db.users, {
      as: 'users_tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.tenants.hasMany(db.exhibitions, {
      as: 'exhibitions_tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.tenants.hasMany(db.messages, {
      as: 'messages_tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.tenants.hasMany(db.pages, {
      as: 'pages_tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.tenants.hasMany(db.portfolios, {
      as: 'portfolios_tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.tenants.hasMany(db.profiles, {
      as: 'profiles_tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.tenants.hasMany(db.settings, {
      as: 'settings_tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    //end loop

    db.tenants.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.tenants.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return tenants;
};
