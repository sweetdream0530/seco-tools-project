const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: "development",
    devtool: "source-map",
    optimization: {
        minimize: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.SITE_HOSTNAME": JSON.stringify(process.env.SITE_HOSTNAME) ?? JSON.stringify("http://localhost:3000"),
            "process.env.WSB_API_URL": JSON.stringify(process.env.WSB_API_URL) ?? JSON.stringify("https://wsb-test2.secotools.net"),
            "process.env.WEB_API_URL": JSON.stringify(process.env.WEB_API_URL) ?? JSON.stringify("https://localhost:7089"),
            "process.env.API_AZURE_API": JSON.stringify(process.env.API_AZURE_API) ?? JSON.stringify("https://secotools-test.azure-api.net"),
            "process.env.API_AZURE_BLOB": JSON.stringify(process.env.API_AZURE_BLOB) ?? JSON.stringify("https://mypagesnestorage1.blob.core.windows.net/pictures"),
            "process.env.REACT_APP_VERSION": JSON.stringify(process.env.REACT_APP_VERSION) ?? JSON.stringify(process.env.npm_package_version),
        }),
    ],
});

module.exports = new Promise((resolve, reject) => {
    resolve(devWebpackConfig);
});
