// @ts-nocheck
import { dbSchema, IIterateTable } from "./type";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

/**The TS Ignore is to represent that the [item] is passed as arguments and the typescript is not not smart enough to understand that
 * the count func is not there.
 * soo make sure to add @ts-ignore to the db[item].count
 *
 */

export async function iterateTable({ tables = dbSchema }: IIterateTable) {
  let data = (
    (await Promise.all([...tables.map((item) => db[item].count())])) as (
      | number
      | null
    )[]
  ).filter(Boolean);
  return data.length > 0;
}
