import { useQuery } from "@tanstack/react-query";
import { db } from "../db";

export const useBooksQuery = () => {
  const query = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  return query;
};

export const getBooks = async () => {
  return await db.query.books.findMany({
    with: {
      categories: {
        with: { category: true },
      },
    },
  });
};
