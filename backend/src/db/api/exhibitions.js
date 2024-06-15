const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ExhibitionsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const exhibitions = await db.exhibitions.create(
      {
        id: data.id || undefined,

        title: data.title || null,
        gallery: data.gallery || null,
        credits: data.credits || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await exhibitions.setProfile(data.profile || null, {
      transaction,
    });

    await exhibitions.setTenant(data.tenant || null, {
      transaction,
    });

    return exhibitions;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const exhibitionsData = data.map((item, index) => ({
      id: item.id || undefined,

      title: item.title || null,
      gallery: item.gallery || null,
      credits: item.credits || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const exhibitions = await db.exhibitions.bulkCreate(exhibitionsData, {
      transaction,
    });

    // For each item created, replace relation files

    return exhibitions;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const exhibitions = await db.exhibitions.findByPk(id, {}, { transaction });

    await exhibitions.update(
      {
        title: data.title || null,
        gallery: data.gallery || null,
        credits: data.credits || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await exhibitions.setProfile(data.profile || null, {
      transaction,
    });

    await exhibitions.setTenant(data.tenant || null, {
      transaction,
    });

    return exhibitions;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const exhibitions = await db.exhibitions.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of exhibitions) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of exhibitions) {
        await record.destroy({ transaction });
      }
    });

    return exhibitions;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const exhibitions = await db.exhibitions.findByPk(id, options);

    await exhibitions.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await exhibitions.destroy({
      transaction,
    });

    return exhibitions;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const exhibitions = await db.exhibitions.findOne(
      { where },
      { transaction },
    );

    if (!exhibitions) {
      return exhibitions;
    }

    const output = exhibitions.get({ plain: true });

    output.profile = await exhibitions.getProfile({
      transaction,
    });

    output.tenant = await exhibitions.getTenant({
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
        model: db.profiles,
        as: 'profile',
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

      if (filter.title) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('exhibitions', 'title', filter.title),
        };
      }

      if (filter.gallery) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('exhibitions', 'gallery', filter.gallery),
        };
      }

      if (filter.creditsRange) {
        const [start, end] = filter.creditsRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            credits: {
              ...where.credits,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            credits: {
              ...where.credits,
              [Op.lte]: end,
            },
          };
        }
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

      if (filter.profile) {
        var listItems = filter.profile.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          profileId: { [Op.or]: listItems },
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
          count: await db.exhibitions.count({
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
      : await db.exhibitions.findAndCountAll({
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
          Utils.ilike('exhibitions', 'title', query),
        ],
      };
    }

    const records = await db.exhibitions.findAll({
      attributes: ['id', 'title'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['title', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }
};
