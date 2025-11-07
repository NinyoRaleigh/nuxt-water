import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const fruitsTable = mysqlTable('fruits', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
});
