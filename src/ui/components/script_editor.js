import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"

class ScriptEditor extends React.Component {

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
                            style={{border: '1px solid lightgray', width: '100%', height: 400}}
                            mode="javascript"
                            theme="tomorrow"
                            name="blah2"
                            onLoad={this.onLoad}
                            onChange={this.onChange}
                            // fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={`console.log('sdfsd')`}
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

export default ScriptEditor;







