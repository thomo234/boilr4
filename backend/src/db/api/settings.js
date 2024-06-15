const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class SettingsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const settings = await db.settings.create(
      {
        id: data.id || undefined,

        dark_mode: data.dark_mode || false,

        custom_css: data.custom_css || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await settings.setUser(data.user || null, {
      transaction,
    });

    await settings.setTenant(data.tenant || null, {
      transaction,
    });

    return settings;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const settingsData = data.map((item, index) => ({
      id: item.id || undefined,

      dark_mode: item.dark_mode || false,

      custom_css: item.custom_css || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const settings = await db.settings.bulkCreate(settingsData, {
      transaction,
    });

    // For each item created, replace relation files

    return settings;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const settings = await db.settings.findByPk(id, {}, { transaction });

    await settings.update(
      {
        dark_mode: data.dark_mode || false,

        custom_css: data.custom_css || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await settings.setUser(data.user || null, {
      transaction,
    });

    await settings.setTenant(data.tenant || null, {
      transaction,
    });

    return settings;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const settings = await db.settings.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of settings) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of settings) {
        await record.destroy({ transaction });
      }
    });

    return settings;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const settings = await db.settings.findByPk(id, options);

    await settings.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await settings.destroy({
      transaction,
    });

    return settings;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const settings = await db.settings.findOne({ where }, { transaction });

    if (!settings) {
      return settings;
    }

    const output = settings.get({ plain: true });

    output.user = await settings.getUser({
      transaction,
    });

    output.tenant = await settings.getTenant({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'user',
      },

      {
        model: db.tenants,
        as: 'tenant',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.custom_css) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('settings', 'custom_css', filter.custom_css),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.dark_mode) {
        where = {
          ...where,
          dark_mode: filter.dark_mode,
        };
      }

      if (filter.user) {
        var listItems = filter.user.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          userId: { [Op.or]: listItems },
        };
      }

      if (filter.tenant) {
        var listItems = filter.tenant.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          tenantId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.settings.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.settings.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('settings', 'dark_mode', query),
        ],
      };
    }

    const records = await db.settings.findAll({
      attributes: ['id', 'dark_mode'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['dark_mode', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.dark_mode,
    }));
  }
};
