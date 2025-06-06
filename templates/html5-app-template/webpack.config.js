const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // ⬅️ ADD THIS

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    target: "node",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, "src/images"), to: "images" },
                { from: path.resolve(__dirname, "src/videos"), to: "videos" },
                { from: path.resolve(__dirname, "src/fonts"), to: "fonts" },
            ],
        }),
    ],
    externals: ({ request }, callback) => {
        if (/^@brightsign\//.test(request)) {
            return callback(null, "commonjs " + request);
        }
        callback();
    },
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "eval-source-map",
};
