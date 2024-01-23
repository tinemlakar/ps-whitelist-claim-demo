import { ethAddressValidator, presenceValidator } from '@rawmodel/validators';
import {
  PopulateStrategy,
  SerializedStrategy,
  SystemErrorCode,
  ValidatorErrorCode,
} from '../config/values';
import { uniqueFieldValue } from '../lib/validators';
import { BaseSqlModel, prop } from './base-sql-model';
import { stringLowerCaseParser } from '../lib/parsers';
import { stringParser } from '@rawmodel/parsers';
import { Context } from '../context';
import { SqlError } from '../lib/errors';
import { getQueryParams, selectAndCountQuery } from '../lib/sql-utils';

export class User extends BaseSqlModel {
  protected _tableName = 'user';

  /**
   * wallet
   */
  @prop({
    parser: { resolver: stringLowerCaseParser() },
    validators: [
      {
        resolver: presenceValidator(),
        code: ValidatorErrorCode.PROFILE_WALLET_NOT_PRESENT,
      },
      {
        resolver: ethAddressValidator(),
        code: ValidatorErrorCode.PROFILE_WALLET_NOT_VALID,
      },
      {
        resolver: uniqueFieldValue('user', 'wallet'),
        code: ValidatorErrorCode.PROFILE_WALLET_ALREADY_TAKEN,
      },
    ],
    populatable: [PopulateStrategy.DB, PopulateStrategy.ADMIN],
    serializable: [SerializedStrategy.DB, SerializedStrategy.PROFILE, SerializedStrategy.ADMIN],
    fakeValue: '0x375207c35e670bdF4d2bC45d182117F2f67618B1',
  })
  public wallet: string;

  /**
   * signature
   */
  @prop({
    parser: { resolver: stringParser() },
    populatable: [PopulateStrategy.DB],
    serializable: [SerializedStrategy.DB, SerializedStrategy.PROFILE, SerializedStrategy.ADMIN],
    fakeValue: null,
  })
  public signature: string;

  /**
   * Class constructor.
   * @param data Input data.
   * @param context Context.
   */
  public constructor(data?: any, context?: Context) {
    super(data, { context });
  }

  public async create() {
    const conn = await this.db().start();

    try {
      await this.insert(SerializedStrategy.DB, conn);
      await this.db().commit(conn);
    } catch (err) {
      await this.db().rollback(conn);
      throw new SqlError(err, this.getContext(), SystemErrorCode.DATABASE_ERROR, 'user/create');
    }
  }

  public async populateByWallet(wallet: string) {
    const data = await this.db().paramQuery(
      `
      SELECT * FROM ${this._tableName}
      WHERE wallet = @wallet
    `,
      { wallet: wallet.toLowerCase() }
    );

    if (data && data.length) {
      return this.populate(data[0], PopulateStrategy.DB);
    } else {
      return this.reset();
    }
  }

  /**
   * returns airdrop user statistics.
   */
  public async getStatistics() {
    const data = await this.db().paramQuery(
      `
      SELECT 
        count(*) as total,
        SUM(IF(signature IS NULL, 0, 1)) as generatedSignature
      FROM user;
    `
    );
    if (data && data.length) {
      return data[0];
    } else {
      throw new Error();
    }
  }

  /**
   * returns list of matched users
   * @param urlQuery search/paging/order parameters
   */
  public async getList(urlQuery) {
    // set default values or null for all params that we pass to sql query
    const defaultParams = {
      id: null,
      email: null,
      status: null,
    };

    // map url query with sql fields
    const fieldMap = {
      id: 'u.id',
      wallet: 'u.wallet',
      status: 'u.status',
    };
    const { params, filters } = getQueryParams(defaultParams, 'u', fieldMap, urlQuery);
    if (filters.limit === -1) {
      filters.limit = null;
    }

    let serializedStrategy = SerializedStrategy.ADMIN;
    const sqlQuery = {
      qSelect: `
        SELECT
          u.id,
          u.status,
          u.createTime, u.updateTime,
          u.signature, u.wallet
        `,
      qFrom: `
        FROM user u
        WHERE
          (@id IS NULL OR u.id = @id)
          AND (@wallet IS NULL OR u.wallet = @wallet)
          AND (@status IS NULL OR u.status = @status)
        `,
      qGroup: `
        `,
      qFilter: `
        ORDER BY ${
          filters.orderArr
            ? `${filters.orderArr.join(', ') || 'u.updateTime DESC'}`
            : 'u.updateTime DESC'
        }
        ${filters.limit !== null ? `LIMIT ${filters.limit} OFFSET ${filters.offset}` : ''};
      `,
    };

    const { items, total } = await selectAndCountQuery(this.db(), sqlQuery, params, 'u.id');
    const conn = await this.db().db.getConnection();
    try {
      const populatedItems = await Promise.all(
        items.map(async item => {
          const u = new User({}, this.getContext()).populate(item, PopulateStrategy.DB);
          return u.serialize(serializedStrategy);
        })
      );
      return { items: populatedItems, total };
    } catch (e) {
      throw e;
    } finally {
      await conn.release();
    }
  }
}
