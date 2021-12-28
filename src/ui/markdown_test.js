// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm'
// import MdEditor, { Plugins } from 'react-markdown-editor-lite';

// import DescriptionEditor from 'ui/components/description_editor'
// import Editor from "rich-markdown-editor";
// import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
// import {dark, dracula, duotoneLight, materialLight} from 'react-syntax-highlighter/dist/esm/styles/prism'
// import {github, } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
// import 'react-markdown-editor-lite/lib/index.css';
// import { vs } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
// const PLUGINS = undefined;
// // const PLUGINS = ['header', 'divider', 'image', 'divider', 'font-bold', 'full-screen'];

// // MdEditor.use(Plugins.AutoResize, {
// //   min: 200,
// //   max: 800
// // });

// MdEditor.use(Plugins.TabInsert, {
//   tabMapValue: 1, // note that 1 means a '\t' instead of ' '.
// });

// class Home extends React.Component {
//   mdEditor = undefined;

//   constructor(props) {
//     super(props);
//     this.renderHTML = this.renderHTML.bind(this);
//     this.state = {
//       value: "# Hello",
//     };
//   }

//   handleEditorChange = (it, event) => {
//     // console.log('handleEditorChange', it.text, it.html, event);
//     this.setState({
//       value: it.text,
//     });
//   };

//   handleImageUpload = (file) => {
//     return new Promise(resolve => {
//       const reader = new FileReader();
//       reader.onload = data => {
//         resolve(data.target.result);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   onCustomImageUpload = (event) => {
//     console.log('onCustomImageUpload', event);
//     return new Promise((resolve, reject) => {
//       const result = window.prompt('Please enter image url here...');
//       resolve({ url: result });
//       // custom confirm message pseudo code
//       // YourCustomDialog.open(() => {
//       //   setTimeout(() => {
//       //     // setTimeout 模拟oss异步上传图片
//       //     // 当oss异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
//       //     const url = 'https://avatars0.githubusercontent.com/u/21263805?s=80&v=4'
//       //     resolve({url: url, name: 'pic'})
//       //   }, 1000)
//       // })
//     });
//   };

//   handleGetMdValue = () => {
//     if (this.mdEditor) {
//       alert(this.mdEditor.getMdValue());
//     }
//   };

//   handleGetHtmlValue = () => {
//     if (this.mdEditor) {
//       alert(this.mdEditor.getHtmlValue());
//     }
//   };

//   handleSetValue = () => {
//     const text = window.prompt('Content');
//     this.setState({
//       value: text,
//     });
//   };

//   renderHTML(text) {
//     return React.createElement(ReactMarkdown, {
//       source: text,
//     });
//   }

//   render() {
//     const markdown = `A paragraph with *emphasis* and **strong importance**.

// > A block quote with ~strikethrough~ and a URL: https://reactjs.org.

// * Lists
// * [ ] todo
// * [x] done

// A table:

// | a | b |
// | - | - |


// **sdf**


// \`\`\`js
// let a = 0;
// \`\`\`
// `
//     return (

// <div>

// <DescriptionEditor 
//                       // value={description}
//                       // defaultValue={description}
//                       // onSave={this.handleDescSave}
//                       // onChange={this.handleDescChange}
//                     />


// <Editor
//   defaultValue={markdown}
// />

//       <ReactMarkdown children={markdown} 
//       remarkPlugins={[remarkGfm]} 
//       components={{
//         code({node, inline, className, children, ...props}) {
//           const match = /language-(\w+)/.exec(className || '')
//           return !inline && match ? (
//             <SyntaxHighlighter
//               children={String(children).replace(/\n$/, '')}
//               style={materialLight}
//               language={match[1]}
//               PreTag="div"
//               {...props}
//             />
//           ) : (
//             <code className={className} {...props}>
//               {children}
//             </code>
//           )
//         }
//       }}
//       />
// </div>

//       // <div className="demo-wrap">
//       //   <h3>react-markdown-editor-lite demo</h3>
//       //   <nav className="nav">
//       //     <button onClick={this.handleGetMdValue}>getMdValue</button>
//       //     <button onClick={this.handleGetHtmlValue}>getHtmlValue</button>
//       //     <button onClick={this.handleSetValue}>setValue</button>
//       //   </nav>
//       //   <div className="editor-wrap" style={{ marginTop: '30px' }}>
//       //     <MdEditor
//       //       ref={node => (this.mdEditor = node || undefined)}
//       //       value={this.state.value}
//       //       style={{ height: '500px', width: '100%' }}
//       //       renderHTML={(text) => <ReactMarkdown source={text} />}
//       //       plugins={PLUGINS}
//       //       config={{
//       //         view: {
//       //           menu: true,
//       //           md: true,
//       //           html: true,
//       //           fullScreen: true,
//       //           hideMenu: true,
//       //         },
//       //         table: {
//       //           maxRow: 5,
//       //           maxCol: 6,
//       //         },
//       //         imageUrl: 'https://octodex.github.com/images/minion.png',
//       //         syncScrollMode: ['leftFollowRight', 'rightFollowLeft'],
//       //       }}
//       //       onChange={this.handleEditorChange}
//       //       onImageUpload={this.handleImageUpload}
//       //       onFocus={e => console.log('focus', e)}
//       //       onBlur={e => console.log('blur', e)}
//       //       // onCustomImageUpload={this.onCustomImageUpload}
//       //     />
//       //     <MdEditor
//       //       style={{ height: '500px', width: '100%' }}
//       //       renderHTML={(text) => <ReactMarkdown source={text} />}
//       //     />
//       //   </div>
        
//       // </div>
//     );
//   }
// }

// export default Home;




