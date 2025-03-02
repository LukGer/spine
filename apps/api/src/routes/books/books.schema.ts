import z from "zod";

export const bookVolumeSchema = z.object({
  id: z.string(),
  volumeInfo: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    publisher: z.string(),
    publishedDate: z.string(),
    description: z.string(),
    industryIdentifiers: z.array(
      z.object({
        type: z.string(),
        identifier: z.string(),
      })
    ),
    pageCount: z.number().int(),
    categories: z.array(z.string()),
    averageRating: z.number().optional(),
    ratingsCount: z.number().optional(),
    language: z.string(),
  }),
});

export const googleBooksSchema = z.object({
  totalItems: z.number().int(),
  items: z.array(z.any()),
});

export const bookSchema = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  publisher: z.string(),
  publishedDate: z.string().optional(),
  description: z.string().optional(),
  isbn: z.string(),
  pageCount: z.number().int(),
  categories: z.array(z.string()),
  averageRating: z.number().optional(),
  ratingsCount: z.number().optional(),
  language: z.string(),
  coverImageUrl: z.string(),
});

export type BookResponse = z.infer<typeof bookSchema>;
