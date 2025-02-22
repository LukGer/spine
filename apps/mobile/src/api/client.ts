import type { AppType } from "@repo/api";

const { hc } = require("hono/dist/client") as typeof import("hono/client");

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;

export const client = hc<AppType>(API_BASE_URL);
