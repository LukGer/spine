import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ReadStates = ["to_read", "reading", "read"] as const;

export type ReadState = (typeof ReadStates)[number];

export const books = sqliteTable("books", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  subtitle: text(),
  authors: text(),
  publisher: text(),
  publishedDate: text(),
  description: text(),
  isbn: text().notNull(),
  pageCount: int(),
  mainCategory: text(),
  averageRating: real(),
  thumbnailUrl: text(),
  state: text({ enum: ReadStates }).notNull(),
});

export type DbBook = typeof books.$inferSelect;

export const booksRelations = relations(books, ({ many }) => ({
  categories: many(booksToCategories),
}));

export const categories = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export type DbCategory = typeof categories.$inferSelect;

export const categoriesRelations = relations(categories, ({ many }) => ({
  books: many(booksToCategories),
}));

export const booksToCategories = sqliteTable("book_categories", {
  bookId: int()
    .notNull()
    .references(() => books.id),
  categoryId: int()
    .notNull()
    .references(() => categories.id),
});

export const booksToCategoriesRelations = relations(
  booksToCategories,
  ({ one }) => ({
    book: one(books, {
      fields: [booksToCategories.bookId],
      references: [books.id],
    }),
    category: one(categories, {
      fields: [booksToCategories.categoryId],
      references: [categories.id],
    }),
  })
);
