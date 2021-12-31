
const { 
  fixBabelImports, addWebpackResolve,
  addLessLoader,override, addWebpackAlias } = require('customize-cra');
const path = require("path");
 
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
  // /monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/,
  //       __dirname
  ));

  config.plugins.push(new NodePolyfillPlugin())
  return config;
}

module.exports = override(
  // fixBabelImports('import', { //配置按需加载
  //   libraryName: 'antd',
  //   libraryDirectory: 'es',
  //   style: true,
  // }),
  // addLessLoader({
  //   javascriptEnabled: true,
  //   // modifyVars: {
  //   //   '@primary-color': '#1DA57A'
  //   // }
  // }),
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