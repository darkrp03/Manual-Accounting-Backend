const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: "node",
  externals: [nodeExternals()],
  externalsPresets: {
    node: true
  },
  mode: "production",
  entry: "./src/app.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: path.resolve(__dirname, "src")
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js"
  }
};