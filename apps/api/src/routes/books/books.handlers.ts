import type { AppRouteHandler } from "@/lib/types";

import type { QueryRoute } from "./books.routes";
import {
  bookDetailsSchema,
  BookResponse,
  booksSearchSchema,
  editionSchema,
  isbnSearchSchema,
} from "./books.schema";

export const query: AppRouteHandler<QueryRoute> = async (c) => {
  const { title, isbn, lang } = c.req.valid("query");

  if (isbn) {
    const key = `ISBN:${isbn}`;

    const response = await fetch(
      `http://openlibrary.org/api/books?bibkeys=${key}&format=json&jscmd=data`
    ).then((res) => res.json());

    const book = isbnSearchSchema.parse(response[key]);

    const bookDetails = await fetch(`http://openlibrary.org${book.key}.json`)
      .then((res) => res.json())
      .then((res) => bookDetailsSchema.parse(res));

    return c.json([
      {
        title: book.title,
        subtitle: bookDetails.subtitle,
        authors: book.authors.map((author) => author.name),
        publisher: bookDetails.publishers[0],
        publishedDate: book.publish_date,
        isbn: isbn,
        pageCount: bookDetails.number_of_pages,
        thumbnailUrl: book.cover.large,
      },
    ]);
  } else if (title) {
    const formattedTitle = title.replace(" ", "+");

    const response = await fetch(
      `http://openlibrary.org/search.json?q=title:${formattedTitle}&lang=${lang}&fields=key,title,author_name,editions`
    )
      .then((res) => res.json())
      .then((res) => booksSearchSchema.parse(res));

    const books: BookResponse[] = [];

    for (const doc of response.docs) {
      const editionInfo = doc.editions.docs[0];

      if (!editionInfo) continue;

      const edition = await fetch(
        `http://openlibrary.org${editionInfo.key}.json`
      )
        .then((res) => res.json())
        .then((res) => editionSchema.parse(res));

      if (!edition.isbn_13) continue;

      books.push({
        title: edition.title,
        subtitle: edition.subtitle,
        authors: doc.author_name ?? [],
        isbn: edition.isbn_13[0]!,
        pageCount: edition.number_of_pages,
        thumbnailUrl: `https://covers.openlibrary.org/b/isbn/${edition.isbn_13[0]}-L.jpg`,
      });
    }

    return c.json(books);
  }

  return c.json([]);
};
