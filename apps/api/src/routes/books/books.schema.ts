import z from "zod";

export const isbnSearchSchema = z.object({
  url: z.string(),
  key: z.string(),
  title: z.string(),
  authors: z.array(z.object({ name: z.string(), url: z.string() })),
  number_of_pages: z.number().int(),
  publish_date: z.string(),
  publishers: z.array(z.object({ name: z.string() })),
  cover: z.object({ small: z.string(), medium: z.string(), large: z.string() }),
});

export const bookDetailsSchema = z.object({
  works: z.array(z.object({ key: z.string() })),
  title: z.string(),
  publishers: z.array(z.string()),
  publish_date: z.string(),
  isbn_10: z.array(z.string()),
  subtitle: z.string().optional(),
  number_of_pages: z.number().int(),
});

export const booksSearchSchema = z.object({
  start: z.number().int(),
  num_found: z.number().int(),
  docs: z.array(
    z.object({
      key: z.string(),
      author_name: z.array(z.string()),
      title: z.string(),
      editions: z.object({
        numFound: z.number().int(),
        start: z.number().int(),
        numFoundExact: z.boolean(),
        docs: z.array(
          z.object({
            key: z.string(),
            title: z.string(),
          })
        ),
      }),
    })
  ),
});

export const editionSchema = z.object({
  key: z.string(),
  publishers: z.array(z.string()),
  number_of_pages: z.number().int().optional(),
  covers: z.array(z.number().int()).optional(),
  authors: z.array(z.object({ key: z.string() })).optional(),
  subjects: z.array(z.string()).optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  publish_date: z.string(),
  isbn_10: z.array(z.string()).optional(),
  isbn_13: z.array(z.string()).optional(),
});

export const bookSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  authors: z.array(z.string()),
  publisher: z.string().optional(),
  publishedDate: z.string().optional(),
  description: z.string().optional(),
  isbn: z.string(),
  pageCount: z.number().int().optional(),
  mainCategory: z.string().optional(),
  averageRating: z.number().optional(),
  thumbnailUrl: z.string().optional(),
});

export type BookResponse = z.infer<typeof bookSchema>;
