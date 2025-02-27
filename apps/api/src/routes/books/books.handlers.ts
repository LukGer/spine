import env from "@/env";
import type { AppRouteHandler } from "@/lib/types";
import type { QueryRoute } from "./books.routes";
import { BookResponse, googleBooksSchema } from "./books.schema";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

const API_KEY = env.GOOGLE_API_KEY;

export const query: AppRouteHandler<QueryRoute> = async (c) => {
  const { q: query, isbn, lang } = c.req.valid("query");

  if (!query && !isbn) {
    return c.json([]);
  }

  const searchQuery = isbn ? `isbn:${isbn}` : query;

  const response = await fetch(
    `${GOOGLE_BOOKS_API}?q=${searchQuery}&langRestrict=${lang}&key=${API_KEY}`
  )
    .then((res) => res.json())
    .then((res) => googleBooksSchema.parse(res));

  const books: BookResponse[] = [];
  for (const item of response.items) {
    const coverImageUrl = `https://books.google.com/books/content?id=${item.id}&printsec=frontcover&img=1&zoom=2`;

    books.push({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publisher: item.volumeInfo.publisher,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      isbn: item.volumeInfo.industryIdentifiers[0]!.identifier,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories,
      averageRating: item.volumeInfo.averageRating,
      ratingsCount: item.volumeInfo.ratingsCount,
      language: item.volumeInfo.language,
      coverImageUrl,
    });
  }

  return c.json(books);
};
