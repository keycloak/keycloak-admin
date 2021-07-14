module.exports = {
  extends: "@snowpack/app-scripts-react",
  proxy: {
    "/auth/admin": "http://localhost:8180/auth/admin/",
  },
  plugins: [
    "@snowpack/plugin-postcss",
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-typescript",
  ],
  buildOptions: {
    baseUrl: "./",
    clean: true,
  },
  devOptions: {
    out: "build/src/main/resources/admin/resources", // For snowpack 3, "out" goes under buildOptions.
  },
};
