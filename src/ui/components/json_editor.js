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

    render() {
     
        return (
            <AceEditor
                            style={{border: '1px solid lightgray', width: '100%', height: 300,}}
                            ref={ref => this.aceRef = ref}
                            mode="json"
                            theme="tomorrow"
                            name="blah2"
                            onLoad={this.onLoad}
                            
                            // fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={`console.log('sdfsd')`}
                            onChange={this.handleChange}
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







