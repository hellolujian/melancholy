import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import 'ace-builds/src-noconflict/theme-chrome';
import "ace-builds/src-noconflict/ext-language_tools"

class ScriptEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleChange = (newValue) => {
        console.log(newValue);
        this.props.onChange(newValue);
    }

    render() {
     
        let {value, aceEditorProps, height = '360px'} = this.props;
        return (
            <AceEditor
                style={{
                    border: '1px solid lightgray', 
                    width: '100%', 
                    // height: '300px',
                }}
                height={height}
                mode="javascript"
                theme="chrome"
                name="script_editor"
                onLoad={this.onLoad}
                onChange={this.handleChange}
                // fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                value={value}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true
                }}
                {...aceEditorProps}
            />
        )
    }
}

export default ScriptEditor;

ScriptEditor.defaultProps = {
    onChange: () => {},
}







