const path = require("path");
// const CracoLessPlugin = require('craco-less');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const SimpleProgressWebpackPlugin = require( 'simple-progress-webpack-plugin' )
// const { getThemeVariables } = require('antd/dist/theme');
// const AntDesignThemePlugin = require('antd-theme-webpack-plugin');

// 删除打包后的map文件
process.env.GENERATE_SOURCEMAP = "false"

// const options = {
//   antDir: path.join(__dirname, './node_modules/antd'),
//   stylesDir: path.join(__dirname, './src/styles'),
//   varFile: path.join(__dirname, './src/styles/variables.less'),
//   mainLessFile: path.join(__dirname, './src/styles/index.less'),
//   themeVariables: ['@primary-color'], // ['@primary-color', '@secondry-color', '@text-color-secondary', '@text-color', '@processing-color', '@layout-header-background', '@heading-color', '@btn-primary-bg'],
//   indexFileName: 'index.html',
//   generateOnce: false
// }


// const themePlugin = new AntDesignThemePlugin(options);


module.exports = {
  plugins: [
    // {
    //   plugin: CracoLessPlugin,
    //   options: {
    //     lessLoaderOptions: {
    //       lessOptions: {
    //         // modifyVars: { '@primary-color': '#1DA57A' },
    //         // modifyVars: getThemeVariables({
    //         //   dark: true
    //         // }),
    //         javascriptEnabled: true,
    //       },
    //     },
    //   },
    // },
    {
      plugin: new MonacoWebpackPlugin()
    }
  ],
  babel:{  
    plugins: [
      // [   
      //   "import", 
      //   {
      //     "libraryName": "antd",
      //     "libraryDirectory": "es",
      //       "style": true //设置为true即是less
      //     }
      // ]
    ]
  },
  webpack: {
    plugins: [
      new SimpleProgressWebpackPlugin(),
      // new AntDesignThemePlugin(options)
    ],
    alias: {
      "@": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, 'src/components'),
      utils: path.resolve(__dirname, 'src/utils'),
      ui: path.resolve(__dirname, 'src/ui'),
      database: path.resolve(__dirname, 'src/database'),
      enums: path.resolve(__dirname, 'src/enums'),
      styles: path.resolve(__dirname, 'src/styles'),
    },

    configure: (webpackConfig, {env, paths}) => {
      paths.appBuild = path.join(path.dirname(paths.appBuild), '/electron/build');;
      webpackConfig.output = {
        ...webpackConfig.output,
        path: path.resolve(__dirname, 'electron/build'),
      }

      return webpackConfig
    }
  }
};
