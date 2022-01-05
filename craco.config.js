const path = require("path");
const CracoLessPlugin = require('craco-less');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

// 删除打包后的map文件
process.env.GENERATE_SOURCEMAP = "false"

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: new MonacoWebpackPlugin()
    }
  ],
  babel:{  
    plugins: [
      [   
        "import", 
        {
          "libraryName": "antd",
          "libraryDirectory": "es",
            "style": true //设置为true即是less
          }
      ]
    ]
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, 'src/components'),
      utils: path.resolve(__dirname, 'src/utils'),
      ui: path.resolve(__dirname, 'src/ui'),
      database: path.resolve(__dirname, 'src/database'),
      enums: path.resolve(__dirname, 'src/enums'),
    },

    configure: (webpackConfig, {env, paths}) => {
      console.log('===============================================');
      
      paths.appBuild = 'electron/build';
      console.log('打包路径：' + paths.appBuild);
      webpackConfig.output = {
        ...webpackConfig.output,
        // path: path.resolve(__dirname, 'build'),
        publicPath: '/'
      }

      return webpackConfig
    }
  }
};
