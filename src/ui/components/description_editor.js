import React from 'react';
import {Typography, Button, Space, Row, Col } from 'antd';

import {DESCRIPTION_MARKDOWN_TIPS,} from 'ui/constants/tips'

import MonacoEditor from "react-monaco-editor";

import {getCurrentTheme, getEditIcon} from '@/utils/style_utils'

import {subscribeThemeChange} from '@/utils/event_utils'

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js';
import MdLiteEditor from 'react-markdown-editor-lite'

// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/atom-one-light.css'
import 'ui/style/markdown_editor.css'

// 初始化Markdown解析器
const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        console.log(lang);
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {}
        }
        return ''; // 使用额外的默认转义
    }
})

const {Link} = Typography;

class DescriptionEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mdEditorShow: props.mdEditorShow,
            currentTheme:  getCurrentTheme(),
            value: props.defaultValue
        }
    }

    handleChangeTheme = (theme, data) => {
        this.setState({currentTheme: data})
    }

    componentDidMount() {
        // console.log('compondiount:=========');
        // console.log(this.props.defaultValue);
        if (this.props.defaultValue) {
            this.setState({value: this.props.defaultValue});
        }

        subscribeThemeChange(this.handleChangeTheme)
    }

    componentWillReceiveProps(nextProps) {
        // console.log('nextprops===========')
        // console.log(nextProps.value);
        if (nextProps.hasOwnProperty('value')) {
            this.setState({value: nextProps.value})
        }
    }

    handleSaveClick = () => {
        const {value} = this.state;
        this.props.onSave(value);
        this.setState({mdEditorShow: false});
    }

    handleCancelClick = () => {
        const {preValue} = this.state;
        this.setState({mdEditorShow: false, value: preValue});
        this.props.onChange(preValue)
    }

    handleEditClick = () => {
        const {value} = this.state;
        // let preValue = this.props.hasOwnProperty('value') ? this.props.value : value;
        this.setState({mdEditorShow: true, preValue: value}, () => {

            // 自动聚焦到末尾
            // let mdDom = document.querySelector('.description-md-editor');
            // if (!mdDom) {
            //     return;
            // }
            // mdDom.focus();
            // mdDom.selectionStart = value ? value.length : 0;
            // this.refreshDescHeight(2)
            // document.getElementById("description-md-editor-id_md").addEventListener("input", function(e) {
            //     this.style.height = "inherit";
            //     this.style.height = `${this.scrollHeight}px`;
            //   });
        });
    }

    editorDidMount = (editor, monaco) => {
        const {autoFocus} = this.props;
        if (autoFocus) editor.focus();
    };

    handleMonacoEditorChange = (newValue, e) => {
        this.setState({value: newValue})
        this.props.onChange(newValue);
    }

    render() {
        const {mdEditorShow, value, currentTheme} = this.state;
        const {mdEditorProps = {}, scene = "single"} = this.props;

        let editIcon = getEditIcon()

        const options = {
            minimap: {
                enabled: false
            },
            folding: false,
            lineNumbers: 'off',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            // editorClassName: 'editor-class-name',
            extraEditorClassName: 'add-placeholder-class',
            autoClosingBrackets: "always",
            autoClosingDelete: 'always',
            autoClosingQuotes: 'always',
            autoClosingOvertype: "always"
          };

        return mdEditorShow ? (
            <>
                <div style={{border: '1px solid var(--common-border-color, lightgray)'}}>
                    <MonacoEditor
                        height="300"
                        language="markdown"
                        theme={currentTheme === 'dark' ? "hc-black" : "vs-light"}
                        value={value}
                        options={options}
                        onChange={this.handleMonacoEditorChange}
                        editorDidMount={this.editorDidMount}
                        {...mdEditorProps}
                    />
                </div>
                    
                <div className="justify-content-space-between description-md-editor-footer">
                    <span style={{fontSize: 12}}>{DESCRIPTION_MARKDOWN_TIPS}</span>
                    {
                        scene === 'single' && (
                            <span>
                                <Button type="link" onClick={this.handleCancelClick}>Cancel</Button>
                                <Button type="primary" onClick={this.handleSaveClick}>Save</Button>
                            </span>
                        )
                    }
                </div>
                
            </>
        ) : (
            value ? (
                <Row wrap={false} className="description-editor-container-class">
                    <Col flex="none">
                        <MdLiteEditor
                            view={{menu: false, html: true, md: false}}
                            htmlClass="custom-html-style description-editor-html-class"
                            renderHTML={(text) => mdParser.render(text)}
                            value={value}
                        />
                    </Col>
                    <Col className='description-editor-not-edit-class'>
                        <Link onClick={this.handleEditClick}>{editIcon}</Link>
                    </Col>
                </Row>
            ) : (
                <Button 
                    size="small" 
                    type="link" 
                    onClick={this.handleEditClick}>
                    Add a description
                </Button>
            )
            
        )
    }
}

export default DescriptionEditor;

DescriptionEditor.defaultProps = {
    onChange: () => {},
    onSave: () => {},
}







