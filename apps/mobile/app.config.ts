import { IOSIcons } from "@expo/config-types";
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

const getAppScheme = () => {
  if (IS_DEV) {
    return "spine-dev";
  }

  if (IS_PREVIEW) {
    return "spine-pre";
  }

  return "spine-app";
};

const getAppIcons = (): IOSIcons => {
  if (IS_DEV) {
    return {
      dark: "./assets/icons/dev/ios-dark.png",
      light: "./assets/icons/dev/ios-light.png",
      tinted: "./assets/icons/dev/ios-tinted.png",
    };
  }

  if (IS_PREVIEW) {
    return {
      dark: "./assets/icons/pre/ios-dark.png",
      light: "./assets/icons/pre/ios-light.png",
      tinted: "./assets/icons/pre/ios-tinted.png",
    };
  }

  return {
    dark: "./assets/icons/ios-dark.png",
    light: "./assets/icons/ios-light.png",
    tinted: "./assets/icons/ios-tinted.png",
  };
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "spine",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: getAppScheme(),
  userInterfaceStyle: "light",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueBundleId(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    icon: getAppIcons(),
  },
  web: {
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/icons/splash-icon-dark.png",
        backgroundColor: "#ffffff",
        imageWidth: 200,
        resizeMode: "contain",
        dark: {
          image: "./assets/icons/splash-icon-light.png",
          backgroundColor: "#000000",
        },
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
