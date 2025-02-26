import { useQuery } from "@tanstack/react-query";
import { db } from "../db";

export const useBooksQuery = () => {
  const query = useQuery({
    queryKey: ["books"],
    queryFn: async () =>
      await db.query.books.findMany({
        with: {
          categories: {
            with: { category: true },
          },
        },
      }),
  });

  return query;
};

export const useBookByIsbnQuery = (isbn: string) => {
  const query = useQuery({
    queryKey: ["books", isbn],
    queryFn: async () => {
      console.log("FETCHING BOOK", isbn);
      return (
        (await db.query.books.findFirst({
          where: (books, { eq }) => eq(books.isbn, isbn),
        })) ?? null
      );
    },
  });

  return query;
};
