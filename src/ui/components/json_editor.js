import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver"
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"

class JsonEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleChange = (value) => {
        this.props.onChange(value)
    }

    handleBlur = (e) => {
        this.props.onBlur(e)
    }

    render() {
     
        const {value, mode = 'json'} = this.props;
        return (
            <AceEditor
                style={{border: '1px solid lightgray', width: '100%', height: 300,}}
                ref={ref => this.aceRef = ref}
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
                    showLineNumbers: true
                }}
            />
        )
    }
}

export default JsonEditor;

JsonEditor.defaultProps = {
    onChange: () => {},
    onBlur: () => {},
}







