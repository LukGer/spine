import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "dev";
const IS_PREVIEW = process.env.APP_VARIANT === "pre";

const getAppName = () => {
  if (IS_DEV) {
    return "Spine - DEV";
  }

  if (IS_PREVIEW) {
    return "Spine - PRE";
  }

  return "Spine";
};

const getUniqueBundleId = () => {
  if (IS_DEV) {
    return "dev.lukger.spine.dev";
  }

  if (IS_PREVIEW) {
    return "dev.lukger.spine.pre";
  }

  return "dev.lukger.spine";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "spine",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "spine-app",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueBundleId(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.lukger.spine",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-sqlite",
    "@bacons/apple-colors",
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "5d53001a-9d45-4dc7-9b4a-174d702f5a27",
    },
  },
});
