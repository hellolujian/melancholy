
const { 
  fixBabelImports, addWebpackResolve,
  addLessLoader,override, addWebpackAlias } = require('customize-cra');
const path = require("path");

// 删除打包后的map文件
process.env.GENERATE_SOURCEMAP = "false"
// 打包到指定目录
const paths = require('react-scripts/config/paths');
paths.appBuild = path.join(path.dirname(paths.appBuild), '/electron/build');
 
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const alter_config = () => (config) => {
  config.plugins.push(new MonacoWebpackPlugin(
    // {
    //   languages: ['json', 'javascript', 'markdown'],
    //   features: [

    //     ['accessibilityHelp', 'bracketMatching', 'caretOperations', 'clipboard', 'codeAction', 'codelens', 'colorDetector', 'comment', 'contextmenu', 'coreCommands', 'cursorUndo', 'dnd', 'find', 'folding', 'fontZoom', 'format', 'gotoError', 'gotoLine', 'gotoSymbol', 'hover', 'iPadShowKeyboard', 'inPlaceReplace', 'inspectTokens', 'linesOperations', 'links', 'multicursor', 'parameterHints', 'quickCommand', 'quickOutline', 'referenceSearch', 'rename', 'smartSelect', 'snippets', 'suggest', 'toggleHighContrast', 'toggleTabFocusMode', 'transpose', 'wordHighlighter', 'wordOperations', 'wordPartOperations']
    //   ]
    // }
  ));

  config.plugins.push(new NodePolyfillPlugin())
  return config;
}

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd", 
    libraryDirectory: "es", 
    style: "css" // change importing css to less
  }),
  addLessLoader({
    lessOptions:{
      javascriptEnabled:true ,
      ModifyVars:{  '@primary-color':'#eee'  } 
  }
  }),
    addWebpackAlias({
      "@": path.resolve(__dirname, "src"),
      components: path.resolve(__dirname, 'src/components'),
      utils: path.resolve(__dirname, 'src/utils'),
      ui: path.resolve(__dirname, 'src/ui'),
      database: path.resolve(__dirname, 'src/database'),
      enums: path.resolve(__dirname, 'src/enums'),
    }),
    alter_config()
);