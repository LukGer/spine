import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const books = sqliteTable("books", {
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
  state: text({ enum: ["to_read", "reading", "read"] }).notNull(),
});

export const booksRelations = relations(books, ({ many }) => ({
  authors: many(booksToAuthors),
  categories: many(booksToCategories),
}));

export const authors = sqliteTable("authors", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const authorsRelations = relations(authors, ({ many }) => ({
  books: many(booksToAuthors),
}));

export const booksToAuthors = sqliteTable("book_authors", {
  bookId: int()
    .notNull()
    .references(() => books.id),
  authorId: int()
    .notNull()
    .references(() => authors.id),
});

export const booksToAuthorsRelations = relations(booksToAuthors, ({ one }) => ({
  book: one(books, {
    fields: [booksToAuthors.bookId],
    references: [books.id],
  }),
  author: one(authors, {
    fields: [booksToAuthors.authorId],
    references: [authors.id],
  }),
}));

export const categories = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

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
