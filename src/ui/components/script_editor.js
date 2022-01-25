import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-curly";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-ocaml";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-powershell";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-objectivec";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-snippets";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-text";
import 'ace-builds/src-noconflict/theme-chrome';
import "ace-builds/src-noconflict/ext-language_tools"


import {getCurrentTheme, getEditIcon} from '@/utils/style_utils'

import {subscribeThemeChange} from '@/utils/event_utils'

class ScriptEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           value: props.value,
           currentTheme:  getCurrentTheme()
        }
    }


    handleChangeTheme = (theme, data) => {
        this.setState({currentTheme: data})
    }
    
    componentDidMount() {
      
        subscribeThemeChange(this.handleChangeTheme)
    }

    handleChange = (newValue) => {
        this.setState({ value: newValue})
        this.props.onChange(newValue);
    }

    handleBlur = (e) => {
        this.props.onBlur(e)
    }

    insertAtCursor = (text) => {
        let currentCursor = this.editorRef.editor.selection.getCursor();
        const {row} = currentCursor;
        let {value} = this.props;
        let oldTextArr = value ? value.split('\n') : [];
        let insertTextArr = text.split('\n');
        let newTextArr = [...oldTextArr.slice(0, (row + 1)), ...insertTextArr, ...oldTextArr.slice((row + 1))]
        this.props.onChange(newTextArr.join('\n'), () => {
            this.editorRef.editor.moveCursorTo(row + insertTextArr.length, insertTextArr[insertTextArr.length - 1].length);
            this.editorRef.editor.focus()
        });
        
    }

    handleCursorChange = (selection, e) => {
    }

    onRef = (ref) => {
        if (ref) this.editorRef = ref
    }

    render() {
     
        let {aceEditorProps = {}, height = '360px', value = '', mode = 'javascript'} = this.props;
        let {currentTheme} = this.state

        const {styleProps = {}} = aceEditorProps;
        return (
            <>
                <AceEditor
                    ref={this.onRef}
                    height={height}
                    mode={mode}
                    theme={currentTheme === 'dark' ? "terminal" : "chrome"}
                    name="script_editor"
                    onLoad={this.onLoad}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    // fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={value}
                    onCursorChange={this.handleCursorChange}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true
                    }}
                    {...aceEditorProps}
                    style={{
                        border: '1px solid var(--common-border-color, lightgray)', 
                        width: '100%', 
                        ...styleProps
                    }}
                />
            </>
            
        )
    }
}

export default ScriptEditor;

ScriptEditor.defaultProps = {
    onChange: () => {},
    onBlur: () => {},
}







