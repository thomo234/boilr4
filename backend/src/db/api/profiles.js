const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ProfilesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const profiles = await db.profiles.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        location: data.location || null,
        about: data.about || null,
        subdomain: data.subdomain || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await profiles.setTenant(data.tenant || null, {
      transaction,
    });

    await profiles.setPages(data.pages || [], {
      transaction,
    });

    await profiles.setPortfolios(data.portfolios || [], {
      transaction,
    });

    await profiles.setExhibitions(data.exhibitions || [], {
      transaction,
    });

    return profiles;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const profilesData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      location: item.location || null,
      about: item.about || null,
      subdomain: item.subdomain || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const profiles = await db.profiles.bulkCreate(profilesData, {
      transaction,
    });

    // For each item created, replace relation files

    return profiles;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const profiles = await db.profiles.findByPk(id, {}, { transaction });

    await profiles.update(
      {
        name: data.name || null,
        location: data.location || null,
        about: data.about || null,
        subdomain: data.subdomain || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await profiles.setTenant(data.tenant || null, {
      transaction,
    });

    await profiles.setPages(data.pages || [], {
      transaction,
    });

    await profiles.setPortfolios(data.portfolios || [], {
      transaction,
    });

    await profiles.setExhibitions(data.exhibitions || [], {
      transaction,
    });

    return profiles;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const profiles = await db.profiles.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of profiles) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of profiles) {
        await record.destroy({ transaction });
      }
    });

    return profiles;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const profiles = await db.profiles.findByPk(id, options);

    await profiles.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await profiles.destroy({
      transaction,
    });

    return profiles;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const profiles = await db.profiles.findOne({ where }, { transaction });

    if (!profiles) {
      return profiles;
    }

    const output = profiles.get({ plain: true });

    output.exhibitions_profile = await profiles.getExhibitions_profile({
      transaction,
    });

    output.pages_profile = await profiles.getPages_profile({
      transaction,
    });

    output.portfolios_profile = await profiles.getPortfolios_profile({
      transaction,
    });

    output.pages = await profiles.getPages({
      transaction,
    });

    output.portfolios = await profiles.getPortfolios({
      transaction,
    });

    output.exhibitions = await profiles.getExhibitions({
      transaction,
    });

    output.tenant = await profiles.getTenant({
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
        model: db.tenants,
        as: 'tenant',
      },

      {
        model: db.pages,
        as: 'pages',
        through: filter.pages
          ? {
              where: {
                [Op.or]: filter.pages.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.pages ? true : null,
      },

      {
        model: db.portfolios,
        as: 'portfolios',
        through: filter.portfolios
          ? {
              where: {
                [Op.or]: filter.portfolios.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.portfolios ? true : null,
      },

      {
        model: db.exhibitions,
        as: 'exhibitions',
        through: filter.exhibitions
          ? {
              where: {
                [Op.or]: filter.exhibitions.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.exhibitions ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('profiles', 'name', filter.name),
        };
      }

      if (filter.location) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('profiles', 'location', filter.location),
        };
      }

      if (filter.about) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('profiles', 'about', filter.about),
        };
      }

      if (filter.subdomain) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('profiles', 'subdomain', filter.subdomain),
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
          count: await db.profiles.count({
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
      : await db.profiles.findAndCountAll({
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
          Utils.ilike('profiles', 'name', query),
        ],
      };
    }

    const records = await db.profiles.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
