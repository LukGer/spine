import { domain } from "./dns";

export const api = new sst.cloudflare.Worker("apiWorker", {
  url: true,
  handler: "./apps/api/src/index.ts",
  environment: {
    LOG_LEVEL: "info",
    GOOGLE_API_KEY: "AIzaSyB4Lop47yW2Y7dOkqvHY_MLeZeejbGEOdw",
  },
  domain,
});
