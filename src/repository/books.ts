import { db } from "../db";

export const getBooks = async () => {
  return await db.query.bookTable.findMany();
};
