import React from 'react';
import {Typography, Button, Space, Row, Col } from 'antd';

import {
    VARIABLE_TIPS,
    VARIABLE_VALUE_TIPS,
    COLLECTION_DESCRIPTION_TIPS,
    DESCRIPTION_TIPS,
    DESCRIPTION_MARKDOWN_TIPS,
    AUTHORIZATION_TIPS,
    PRE_REQUEST_SCRIPTS_TIPS,
    TESTS_TIPS
} from 'ui/constants/tips'

import hljs from 'highlight.js';

import 'highlight.js/styles/atom-one-light.css'

import { EDIT_ICON } from '@/ui/constants/icons'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'

// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';
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
              console.log(hljs.highlight(lang, str).value);
            return hljs.highlight(lang, str).value;
            // return '<pre class="hljs"><code>' +
            //    hljs.highlight(lang, str, true).value +
            //    '</code></pre>';
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
            mdEditorShow: props.mdEditorShow

        }
    }

    refreshDescHeight = () => {
        let textareaElement = document.getElementById("description-md-editor-id_md");
        if (!textareaElement) {
            return;
        }
        textareaElement.style.height = textareaElement.scrollHeight + "px";
    }

    componentDidMount() {
        if (this.props.defaultValue) {
            this.setState({value: this.props.defaultValue});
        }
        window.addEventListener('resize', this.refreshDescHeight)  
    }

    componentWillReceiveProps(nextProps) {
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

    handleEditorChange = ({text}) => {
        this.setState({value: text});
        this.props.onChange(text);
    }

    handleEditClick = () => {
        const {value} = this.state;
        // let preValue = this.props.hasOwnProperty('value') ? this.props.value : value;
        this.setState({mdEditorShow: true, preValue: value}, () => {

            // 自动聚焦到末尾
            let mdDom = document.querySelector('.description-md-editor');
            if (!mdDom) {
                return;
            }
            mdDom.focus();
            mdDom.selectionStart = value ? value.length : 0;
            this.refreshDescHeight(2)
            document.getElementById("description-md-editor-id_md").addEventListener("input", function(e) {
                this.style.height = "inherit";
                this.style.height = `${this.scrollHeight}px`;
              });
        });
    }

    handleImageUpload = (file) => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = data => {
                resolve(data.target.result);
            };
            reader.readAsDataURL(file);
        });
    };

    handleAceMarkdownChange = (value) => {
        this.setState({value: value});
        this.props.onChange(value);
    }

    render() {
        const {mdEditorShow, value} = this.state;
        const {mdEditorProps, scene = "single"} = this.props;
        let realValue = value;
        // if (this.props.hasOwnProperty('value')) {
        //     realValue = this.props.value;
        // }
        return mdEditorShow ? (
            <>
                <MdEditor
                    id="description-md-editor-id"
                    shortcuts={true}
                    markdownClass="description-md-editor"
                    config={{view: {menu: false, html: false}}}
                    placeholder={DESCRIPTION_TIPS}
                    renderHTML={(text) => mdParser.render(text)}
                    value={realValue}
                    // onImageUpload={this.handleImageUpload}
                    onChange={this.handleEditorChange}
                    {...mdEditorProps}
                />
                {/* <AceMarkdownEditor 
                    value={realValue}
                    onChange={this.handleAceMarkdownChange}
                /> */}
                    
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
            realValue ? (
                <Row wrap={false} className="description-editor-container-class">
                    <Col flex="none">
                        <MdEditor
                            // readOnly
                            view={{menu: false, html: true, md: false}}
                            htmlClass="description-editor-html-class custom-html-style"
                            renderHTML={(text) => mdParser.render(text)}
                            value={realValue}
                            
                        />

                    </Col>
                    <Col className='description-editor-not-edit-class'>
                        <Link onClick={this.handleEditClick}>{EDIT_ICON}</Link>
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







