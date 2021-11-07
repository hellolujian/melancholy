import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver"
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"
import beautify from "ace-builds/src-noconflict/ext-beautify"

import simpleBeautiful from 'simply-beautiful';

class JsonEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount = () => {
  }

    handleChange = (value) => {
        this.props.onChange(value)
    }

    handleBlur = (e) => {
        this.props.onBlur(e)
    }
    
    handleBeautify = () => {
        
      
        const {mode} = this.props;
        switch (mode) {
            case 'json': 
                this.props.onChange(simpleBeautiful.json(JSON.stringify(JSON.parse(this.props.value))));
                break;
            case 'html': 
                this.props.onChange(simpleBeautiful.html(this.props.value));
                break;
            case 'js':
                this.props.onChange(simpleBeautiful.js(this.props.value)); 
                break;
            case 'css': 
                this.props.onChange(simpleBeautiful.css(this.props.value));
                break;
            default: 
                let editorSession = this.editorRef.editor.session;
                beautify.beautify(editorSession)
                break;
        }
        
    }

    onRef = (ref) => {
        if (ref) this.editorRef = ref
    }

    render() {
     
        const {value, mode = 'json'} = this.props;
        return (
            <>
            <AceEditor
                style={{border: '1px solid lightgray', width: '100%', height: 300,}}
                ref={this.onRef}
                mode={mode}
                theme="tomorrow"
                name="blah2"
                onLoad={this.onLoad}
                
                // fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={value}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    useWorker: true,
                }}
            />
            </>
            
        )
    }
}

export default JsonEditor;

JsonEditor.defaultProps = {
    onChange: () => {},
    onBlur: () => {},
}







