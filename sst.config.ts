/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "spine",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "local",
      providers: { cloudflare: "5.49.1" },
    };
  },
  async run() {
    const { domain, zone } = await import("./infra/dns");
    const { api } = await import("./infra/api");

    return {
      api: api.url,
      domain,
      zone,
    };
  },
});
