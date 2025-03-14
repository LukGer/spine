const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

const monorepoPackages = {
  "@repo/api": path.resolve(monorepoRoot, "apps/api"),
};

config.watchFolders = [projectRoot, ...Object.values(monorepoPackages)];

config.resolver.extraNodeModules = monorepoPackages;
config.resolver.unstable_enableSymlinks = true;

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

config.resolver.sourceExts.push("sql");

config.resolver.assetExts.push("obj");
config.resolver.assetExts.push("glb");

module.exports = withNativeWind(config, { input: "./global.css" });
