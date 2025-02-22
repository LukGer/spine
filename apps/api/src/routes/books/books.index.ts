import { createRouter } from "@/lib/create-app";

import * as handlers from "./books.handlers";
import * as routes from "./books.routes";

const router = createRouter().openapi(routes.query, handlers.query);

export default router;
