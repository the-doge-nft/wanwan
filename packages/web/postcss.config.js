module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Ensures the default variables are available
    "postcss-custom-properties-fallback": {
      importFrom: require.resolve("react-spring-bottom-sheet/defaults.json"),
    },
  },
};
