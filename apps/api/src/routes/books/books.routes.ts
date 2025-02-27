import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { bookSchema } from "./books.schema";

const tags = ["Tasks"];

export const query = createRoute({
  path: "/books/query",
  method: "get",
  tags,
  request: {
    query: z.object({
      q: z.string().optional(),
      isbn: z.string().optional(),
      lang: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(bookSchema), "The list of books"),
  },
});

export type QueryRoute = typeof query;
