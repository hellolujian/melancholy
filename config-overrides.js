
const { 
  fixBabelImports,
  addLessLoader,override, addWebpackAlias } = require('customize-cra');
const path = require("path");
 
module.exports = override(
  fixBabelImports('import', { //配置按需加载
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: {
    //   '@primary-color': '#1DA57A'
    // }
  }),
    addWebpackAlias({
      "@": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, 'src/components'),
      utils: path.resolve(__dirname, 'src/utils'),
      ui: path.resolve(__dirname, 'src/ui')
    }),
);