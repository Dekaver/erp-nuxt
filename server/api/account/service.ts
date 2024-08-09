import { SQL, and, eq, getTableColumns, gt, gte, ilike, inArray, like, lt, lte, ne, or, sql } from "drizzle-orm";
import { type NewAccount, type Account, account, UpdateAccount } from "@/databases/account/schema";
import { alias } from "drizzle-orm/pg-core";


export const getAccount = async (tx = db) => {
    // const data = await tx.select().from(account).orderBy(account.id);
    const {rows} = await tx.execute(sql`  
		WITH RECURSIVE account_tree AS (
		SELECT
			a.id,
			a.code,
			a.name,
			a.level,
			a.parent,
			a.is_cash,
			
			a.is_active,
			a.id_category,
			0 AS depth,
			'[]'::jsonb AS children
		FROM
			account a
		WHERE
			a.parent IS NULL

		UNION ALL

		SELECT
			a.id,
			a.code,
			a.name,
			a.level,
			a.parent,
			a.is_cash,
			
			a.is_active,
			a.id_category,
			at.depth + 1 AS depth,
			'[]'::jsonb AS children
		FROM
			account a
		JOIN
			account_tree at ON a.parent = at.id
		)
		SELECT
			at.id as key,
			jsonb_build_object(
			'id', at.id,
			'code', at.code,
			'name', at.name,
			'depth', at.depth,
			'level', at.level,
			'parent', at.parent,
			'is_cash', at.is_cash,
			'is_active', at.is_active,
			'id_category', at.id_category
			) as data,
			(
			SELECT
				COALESCE(jsonb_agg(
				jsonb_build_object(
					'key', c.id,
					'data', jsonb_build_object(
					'id', c.id,
					'code', c.code,
					'name', c.name,
					'depth', c.depth,
					'level', c.level,
					'parent', c.parent,
					'is_cash', c.is_cash,
					'is_active', c.is_active,
					'id_category', c.id_category
					),
					'children', (
					SELECT
						COALESCE(jsonb_agg(
						jsonb_build_object(
							'key', cc.id,
							'data', jsonb_build_object(
							'id', cc.id,
							'code', cc.code,
							'name', cc.name,
							'depth', cc.depth,
							'level', cc.level,
							'parent', cc.parent,
							'is_cash', cc.is_cash,
							'is_active', cc.is_active,
							'id_category', cc.id_category
							),
							'children', '[]'::jsonb
						)
						), '[]'::jsonb)
					FROM
						account_tree cc
					WHERE
						cc.parent = c.id
					)
				)
				), '[]'::jsonb)
			FROM
				account_tree c
			WHERE
				c.parent = at.id
			) as children
		FROM
		account_tree at
		WHERE
		at.depth = 0  -- Hanya root
		ORDER BY
		at.id;
		`);
    return rows;
};

export const getAccountById = async (params: Account["id"], tx = db) => {
    const data = await tx.select().from(account).where(eq(account.id, params));
    return data[0];
};

export const getAccountOption = async (params: any, tx = db) => {
    const data = tx.select().from(account);
    

    const condition: SQL[] = [];
    if (params.min && params.max) {
        condition.push(gte(sql`REPLACE(account.code, '-', '')`, params.min))
        condition.push(lte(sql`REPLACE(account.code, '-', '')`, params.max));
    } else if (params.parent) {
        const parent = alias(account, "parent");
        data.innerJoin(parent, eq(parent.id, account.parent));
        condition.push(eq(parent.code, params.parent));
    } else if (params.head) {
        condition.push(eq(sql`SUBSTRING(account.code FROM 1 FOR 1)`, params.head));
    } else if (params.cashable) {
        condition.push(eq(account.is_cash, sql.raw(`${params.cashable}`)));
    }
    if (params.level) {
        condition.push(eq(account.level, params.level));
    }
    if (params.search) {
        condition.push(or(ilike(account.code, `%${params.search}%`), ilike(account.name, `%${params.search}%`)) as SQL<unknown>);
        // condition.push()
    }
    if (params.orderBy) {
        data.orderBy(account[params.orderBy as 'code'])
    }else{
        data.orderBy(account.name)
    }
    return await data.where(and(eq(account.is_active, true), ...condition));
};

export const getAccountByCode = async (params: Account["code"], tx = db) => {
    const data = await tx.select().from(account).where(eq(account.code, params));
    return data[0];
};

export const getAccountCashAble = async (tx = db) => {
    const data = await tx
        .select()
        .from(account)
        .where(and(eq(account.is_active, true), eq(account.is_cash, true), eq(account.level, 4)));
    return data;
};

export const getAccountTransaction = async (tx = db) => {
    const data = await tx
        .select()
        .from(account)
        .where(and(eq(account.is_active, true), eq(account.level, 4)));
    return data;
};

export const getAccountByOption = async (query: any, params: any, tx = db) => {
    let data = [];
    switch (query) {
        case "klasifikasi":
            data = await getAccountKlasifikasi();
            break;

        case "subklasifikasi":
            data = await getAccountSubKlasifikasi(params);
            break;

        case "master":
            data = await getAccountMaster(params);
            break;

        default:
            return await getAccount();
    }
    return data;
};

export const getAccountKlasifikasi = async (tx = db) => {
    let query = tx.select().from(account).where(lt(account.id, 10));
    const data = await query;
    return data;
};
export const getAccountSubKlasifikasi = async (params: Account["id"], tx = db) => {
    let query = tx
        .select()
        .from(account)
        .where(and(eq(account.id_category, params), gt(account.id, 9), eq(account.level, 3), eq(account.is_active, true)))
        .orderBy(account.id);
    const data = await query;
    return data;
};
export const getAccountMaster = async (code: any, tx = db) => {
    const subklasifikasi = alias(account, "subklasifikasi");
    const Columns = getTableColumns(account);

    const condition: SQL[] = [];
    let query = tx
        .select({
            ...Columns,
            subklasifikasi: subklasifikasi.name,
        })
        .from(account)
        .leftJoin(subklasifikasi, eq(account.parent, subklasifikasi.id));

    if (code != 'null' && code != "undefined") {
        condition.push(ilike(account.code, `${code}%`));
    }
    condition.push(eq(account.level, 4));
    query.where(and(...condition));

    const data = await query;
    return data;
};

export const getAccountByCategory = async (params: Account["id_category"][], tx = db) => {
    return tx
        .select()
        .from(account)
        .where(and(inArray(account.id_category, params), eq(account.level, 4)))
        .orderBy(account.id);
};

export const getAccountByLevel = async (params: Account["level"], tx = db) => {
    const data = tx.select().from(account).where(eq(account.level, params)).orderBy(account.id);
    return data;
};

export const createAccount = async (form: NewAccount, tx = db) => {
    return await tx.transaction(async (trx) => {
        const [check] = await trx
            .select()
            .from(account)
            .where(and(eq(account.name, form.name), eq(account.level, form.level)));
        if (check) {
            throw ValidationError("Account already exists");
        }
        const [data] = await trx.insert(account).values(form).returning();
        return data;
    });
};

export const updateAccount = async (params: Account["id"], form: UpdateAccount, tx = db) => {
    const data = await tx
        .update(account)
        .set({ ...form })
        .where(eq(account.id, params as number))
        .returning();
    return data[0];
};

export const deleteAccount = async (params: Account["id"], tx = db) => {
    const data = await tx.delete(account).where(eq(account.id, params)).returning();
    return data[0];
};

export const generateAccountCode = async (parent: Account["parent"], parent_level: Account["level"], grandparent: Account["parent"], tx = db) => {
    const data = await tx.transaction(async (trx) => {
        let codeFix = "";
        if (parent) {
            if (parent_level === 1) {
                codeFix = await nomorAccountLevel2(parent as number, trx);
            } else if (parent_level === 2) {
                codeFix = await nomorAccountLevel3(parent as number, trx);
            } else if (grandparent && grandparent < 10 && parent_level === 3) {
                const check = await getAccountById(parent as number, trx);
                if (!check) {
                    throw ValidationError("Parent Account is not found");
                }
                const levelUp = await updateAccount(parent, { ...check, level: 2 }, trx);
                if (!levelUp) {
                    throw ValidationError("Failed to update parent account");
                }
                codeFix = await nomorAccountLevel3(parent as number, trx);
            } else {
                codeFix = await nomorMasterAccount(parent as number, trx);
            }
        } else {
            throw ValidationError("Parent Account is required");
        }
        return codeFix;
    });
    return data;
};

export const nomorAccountLevel2 = async (parent_id: Account["id"], tx = db) => {
    // FIXME: Review this code broo
    const [data] : any = await tx.execute(sql`
    WITH ParentCode AS (
      SELECT
        code AS parent_code
      FROM
        account
      WHERE
        id = ${parent_id}
    ),
    LastLevel2Code AS (
      SELECT
        MAX(CAST(RIGHT(code, 3) AS INTEGER)) AS last_code
      FROM
        account
      WHERE
        LENGTH(code) = 4 AND level = 2 AND LEFT(code, 1) = (SELECT parent_code FROM ParentCode)
    )
    SELECT
      (SELECT parent_code FROM ParentCode) || COALESCE(TO_CHAR(COALESCE(last_code + 100, 0), 'FM000'), '000') AS next_code
    FROM
      LastLevel2Code;
  `);
    return data.next_code as string;
};

export const nomorAccountLevel3 = async (parent_id: Account["id"], tx = db) => {
    // FIXME: Review this code broo
    const [data] : any = await tx.execute(sql`
  WITH ParentCode AS (
    SELECT
      code AS parent_code
    FROM
      account
    WHERE
      id = ${parent_id}  -- Replace with the actual parent account ID
  ),
  LastLevel3Code AS (
    SELECT
      CASE
        WHEN MAX(code::integer) IS NULL THEN (SELECT parent_code FROM ParentCode)::integer + 1
        ELSE (COALESCE(MAX(code::integer), 0) + 1)
      END::text AS last_code
    FROM
      account AS a1
    WHERE
      LENGTH(code) = 4  -- Assuming level 3 codes have a length of 4 characters
      AND level = 3
      AND EXISTS (
        SELECT 1
        FROM account AS a2
        WHERE a2.id = a1.parent  -- Match the parent ID of level 3 accounts
        AND a2.code = (SELECT parent_code FROM ParentCode)
      )
  )
  SELECT last_code as next_code FROM LastLevel3Code;
  `);
    return data.next_code as string;
};

export const nomorMasterAccount = async (parent_id: Account["id"], tx = db) => {
    // FIXME: Review this code broo
    const [data]: any = await tx.execute(sql`
    WITH ParentCode AS (
      SELECT
        MAX(LEFT(code, 4)) AS parent_code
      FROM
        account
      WHERE
        LENGTH(code) >= 4 AND level = 3 AND id = ${parent_id}
    ),
    LastFiveDigits AS (
      SELECT
        CASE
          WHEN code ~ '[0-9]{5}$' THEN CAST(SUBSTR(code, LENGTH(code) - 4, 5) AS integer)
          ELSE 0  -- Use a default value (0) for cases where extraction fails
        END AS last_digits
      FROM
        account
      WHERE
        LENGTH(code) >= 5  -- Adjust the condition as needed
    )
    SELECT
      (SELECT parent_code FROM ParentCode) || '-00-' || TO_CHAR(COALESCE(MAX(last_digits),0) + 1, 'FM00000') AS next_code
    FROM
      LastFiveDigits;
      `);
    return data.next_code as string;
};