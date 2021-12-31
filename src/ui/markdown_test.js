import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MonacoEditor, { MonacoDiffEditor } from "react-monaco-editor";


import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";


// import { PlusOutlined, SearchOutlined,} from '@ant-design/icons';
// import CollectionModal from 'ui/components/collection_modal'
// import TooltipButton from 'ui/components/tooltip_button';
// import LayoutHeader from 'ui/components/layout_header'
// import CollectionRCTree from 'ui/components/collection_rc_tree'
// import ResponseTab from 'ui/components/response_tab'

// import {Rnd} from 'react-rnd';
// import {ADD_ICON} from 'ui/constants/icons'
// import {publishCollectionModalOpen} from '@/utils/event_utils'
// import {getStoreValue} from '@/utils/store_utils'




class Home extends React.Component {
  mdEditor = undefined;

  constructor(props) {
    super(props);
    this.state = {
      value: "# Hello",
    };
  }

  handleEditorChange = (it, event) => {
    console.log('handleEditorChange', it.text, it.html, event);
    // this.setState({
    //   value: it.text,
    // });
  };

  handleImageUpload = (file) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = data => {
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  onCustomImageUpload = (event) => {
    console.log('onCustomImageUpload', event);
    return new Promise((resolve, reject) => {
      const result = window.prompt('Please enter image url here...');
      resolve({ url: result });
      // custom confirm message pseudo code
      // YourCustomDialog.open(() => {
      //   setTimeout(() => {
      //     // setTimeout 模拟oss异步上传图片
      //     // 当oss异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
      //     const url = 'https://avatars0.githubusercontent.com/u/21263805?s=80&v=4'
      //     resolve({url: url, name: 'pic'})
      //   }, 1000)
      // })
    });
  };

  handleGetMdValue = () => {
    if (this.mdEditor) {
      alert(this.mdEditor.getMdValue());
    }
  };

  handleGetHtmlValue = () => {
    if (this.mdEditor) {
      alert(this.mdEditor.getHtmlValue());
    }
  };

  handleSetValue = () => {
    const text = window.prompt('Content');
    this.setState({
      value: text,
    });
  };

  render() {

    return (

      <AceEditor
                    style={{
                        border: '1px solid lightgray', 
                        width: '100%', 
                        // height: '300px',
                    }}
                    // ref={this.onRef}
                    // height={height}
                    mode='javascript'
                    theme="chrome"
                    name="script_editorrwe"
                    onLoad={this.onLoad}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    // fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    // value={value}
                    onCursorChange={this.handleCursorChange}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true
                    }}
                    // {...aceEditorProps}
                />

        // <MonacoEditor
        // height="600"
        // language="javascript"
        // theme="vs-light"
        // // value={code}
        // // options={options}
        // onChange={this.handleEditorChange}
        //         />
    );
  }
}

export default Home;




