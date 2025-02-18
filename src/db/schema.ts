import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const bookTable = sqliteTable("books", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  subtitle: text(),
  publisher: text(),
  publishedDate: text(),
  description: text(),
  isbn: text().notNull(),
  pageCount: int(),
  mainCategory: text(),
  averageRating: real(),
  thumbnailUrl: text(),
});

export const authorTable = sqliteTable("authors", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const bookAuthorTable = sqliteTable("book_authors", {
  bookId: int()
    .notNull()
    .references(() => bookTable.id),
  authorId: int()
    .notNull()
    .references(() => authorTable.id),
});

export const categoryTable = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const bookCategoryTable = sqliteTable("book_categories", {
  bookId: int()
    .notNull()
    .references(() => bookTable.id),
  categoryId: int()
    .notNull()
    .references(() => categoryTable.id),
});
