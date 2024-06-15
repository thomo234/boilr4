const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const profiles = sequelize.define(
    'profiles',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      location: {
        type: DataTypes.TEXT,
      },

      about: {
        type: DataTypes.TEXT,
      },

      subdomain: {
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

  profiles.associate = (db) => {
    db.profiles.belongsToMany(db.pages, {
      as: 'pages',
      foreignKey: {
        name: 'profiles_pagesId',
      },
      constraints: false,
      through: 'profilesPagesPages',
    });

    db.profiles.belongsToMany(db.portfolios, {
      as: 'portfolios',
      foreignKey: {
        name: 'profiles_portfoliosId',
      },
      constraints: false,
      through: 'profilesPortfoliosPortfolios',
    });

    db.profiles.belongsToMany(db.exhibitions, {
      as: 'exhibitions',
      foreignKey: {
        name: 'profiles_exhibitionsId',
      },
      constraints: false,
      through: 'profilesExhibitionsExhibitions',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.profiles.hasMany(db.exhibitions, {
      as: 'exhibitions_profile',
      foreignKey: {
        name: 'profileId',
      },
      constraints: false,
    });

    db.profiles.hasMany(db.pages, {
      as: 'pages_profile',
      foreignKey: {
        name: 'profileId',
      },
      constraints: false,
    });

    db.profiles.hasMany(db.portfolios, {
      as: 'portfolios_profile',
      foreignKey: {
        name: 'profileId',
      },
      constraints: false,
    });

    //end loop

    db.profiles.belongsTo(db.tenants, {
      as: 'tenant',
      foreignKey: {
        name: 'tenantId',
      },
      constraints: false,
    });

    db.profiles.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.profiles.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return profiles;
};
