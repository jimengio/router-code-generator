let path = require("path");
let fs = require("fs");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let TerserPlugin = require("terser-webpack-plugin");
let ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
let ProgressPlugin = require("@jimengio/ci-progress-webpack-plugin");
// let { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

let trackingCode = "";

module.exports = {
  mode: "production",
  entry: {
    vendor: ["react", "react-dom"],
    main: ["./src/main.tsx"],
  },
  output: {
    filename: "[name].[chunkhash:8].js",
    path: path.join(__dirname, "/dist"),
  },
  devtool: "none",
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: "cache-loader" },
          {
            loader: "thread-loader",
            options: {
              workers: require("os").cpus().length - 1,
            },
          },
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|jpg|png|woff2?|mp3)(\?.+)?$/,
        loader: "url-loader",
        query: {
          limit: 100,
          name: "assets/[hash:8].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  stats: {
    all: false,
    colors: true,
    errors: true,
    errorDetails: true,
    performance: true,
    reasons: true,
    timings: true,
    warnings: true,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({ async: false }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new TerserPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.ejs",
      trackingCode,
    }),
    new ProgressPlugin({ interval: 600 }),
    // new BundleAnalyzerPlugin(),
  ],
};
