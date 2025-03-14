import type { AppRouteHandler } from "@/lib/types";
import { env } from "hono/adapter";
import type { QueryRoute } from "./books.routes";
import {
  BookResponse,
  bookVolumeSchema,
  googleBooksSchema,
} from "./books.schema";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

function normalizeIsbn(
  isbn: string | undefined | null
): string | undefined | null {
  if (!isbn) return isbn;

  return isbn.replace(/-/g, "");
}

export const query: AppRouteHandler<QueryRoute> = async (c) => {
  const { GOOGLE_API_KEY } = env<{ GOOGLE_API_KEY: string }>(c);

  const { q: query, isbn, lang } = c.req.valid("query");

  if (!query && !isbn) {
    throw new Error("No query or ISBN provided");
  }

  const normalizedIsbn = isbn ? normalizeIsbn(isbn) : undefined;

  const searchQuery = normalizedIsbn ? `isbn:${normalizedIsbn}` : query;

  const response = await fetch(
    `${GOOGLE_BOOKS_API}?q=${searchQuery}&langRestrict=${lang}&key=${GOOGLE_API_KEY}`
  )
    .then((res) => res.json())
    .then((res) => googleBooksSchema.parse(res));

  const books: BookResponse[] = [];
  for (const item of response.items) {
    const { success, data, error } = bookVolumeSchema.safeParse(item);

    if (!success) {
      console.error(error);
      continue;
    }

    const isbn = data?.volumeInfo.industryIdentifiers?.find(
      (identifier) => identifier.type === "ISBN_13"
    )?.identifier;

    if (!isbn) {
      console.error("No ISBN found");
      continue;
    }

    const coverImageResponse = await fetch(
      `https://bookcover.longitood.com/bookcover/${isbn}`
    ).then((res) => res.json());

    books.push({
      title: data.volumeInfo.title,
      authors: data.volumeInfo.authors,
      publisher: data.volumeInfo.publisher,
      publishedDate: data.volumeInfo.publishedDate,
      description: data.volumeInfo.description,
      isbn,
      pageCount: data.volumeInfo.pageCount,
      categories: data.volumeInfo.categories,
      averageRating: data.volumeInfo.averageRating,
      ratingsCount: data.volumeInfo.ratingsCount,
      language: data.volumeInfo.language,
      coverImageUrl: coverImageResponse.url,
    });
  }

  return c.json(books);
};
