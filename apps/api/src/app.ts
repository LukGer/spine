import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import books from "@/routes/books/books.index";

const app = createApp();

configureOpenAPI(app);

const routes = [books] as const;
type Routes = typeof routes;
export type AppType = Routes[number];

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
