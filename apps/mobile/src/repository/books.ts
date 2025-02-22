import { db } from "../db";

export const getBooks = async () => {
  return await db.query.books.findMany({
    with: {
      authors: {
        with: { author: true },
      },
      categories: {
        with: { category: true },
      },
    },
  });
};
