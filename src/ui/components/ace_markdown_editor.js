import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue'
import "ace-builds/src-noconflict/ext-language_tools"

class AceMarkdownEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           value: props.value
        }
    }

    componentDidMount() {
      
    }

    handleChange = (newValue) => {
        this.setState({ value: newValue})
        this.props.onChange(newValue);
    }

    onRef = (ref) => {
        if (ref) this.editorRef = ref
    }

    render() {
     
        let {aceEditorProps, height = '360px', value = ''} = this.props;

        return (
            <>
                <AceEditor
                    style={{
                        border: '1px solid lightgray', 
                        width: '100%', 
                        // height: '100px',
                    }}
                    ref={this.onRef}
                    // height={height}
                    mode='markdown'
                    theme="github"
                    // name="script_editor"
                    onChange={this.handleChange}
                    // fontSize={14}
                    showPrintMargin={false}
                    showGutter={false}
                    highlightActiveLine={false}
                    value={value}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: false
                    }}
                    {...aceEditorProps}
                />
            </>
            
        )
    }
}

export default AceMarkdownEditor;

AceMarkdownEditor.defaultProps = {
    onChange: () => {},
    onBlur: () => {},
}







