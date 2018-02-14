const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    script:"./src/js/script.js",
    perlin:"./src/js/perlin.js"
  },
  output:{
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  devServer:{
    contentBase: path.resolve(__dirname, "dist"),
    inline: true,
    stats: "errors-only"
  },
  devtool: 'inline-source-map',
  plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html"),
        hash: true,
      })
    ],
}
