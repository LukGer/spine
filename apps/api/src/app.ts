import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import books from "@/routes/books/books.index";
import index from "@/routes/index.route";
import { swaggerUI } from "@hono/swagger-ui";

const app = createApp();

configureOpenAPI(app);

const routes = [index, books] as const;
type Routes = typeof routes;
export type AppType = Routes[number];

routes.forEach((route) => {
  app.route("/", route);
});

app.get("/ui", swaggerUI({ url: "/doc" }));

export default app;
