export const domain =
  {
    dev: "dev.spine.lukger.dev",
    prod: "spine.lukger.dev",
  }[$app.stage] ?? `${$app.stage}.spine.lukger.dev`;

export const zone = cloudflare.getZoneOutput({
  name: "lukger.dev",
});
