// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  plugins: ["@tanstack/query"],
  ignorePatterns: ["/dist/*", "/node_modules/*", "/ios/*"],
  rules: {
    "import/no-unresolved": "off",
    "react/no-unknown-property": "off",
  },
};
