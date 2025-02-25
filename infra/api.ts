export const api = new sst.cloudflare.Worker("apiWorker", {
  url: true,
  handler: "./apps/api/src/index.ts",
});
