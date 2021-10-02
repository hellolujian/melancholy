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

import { EDIT_ICON } from '@/ui/constants/icons'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';
import 'ui/style/markdown_editor.css'

// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);
const {Link} = Typography;

class DescriptionEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mdEditorShow: props.mdEditorShow,

        }
    }

    componentDidMount() {
      
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
        let preValue = this.props.hasOwnProperty('value') ? this.props.value : value;
        this.setState({mdEditorShow: true, preValue: preValue}, () => {

            // 自动聚焦到末尾
            let mdDom = document.querySelector('.description-md-editor');
            mdDom.focus();
            mdDom.selectionStart = preValue ? preValue.length : 0;
        });
    }

    render() {
        const {mdEditorShow, value} = this.state;
        const {mdEditorProps, scene = "single"} = this.props;
        let realValue = value;
        if (this.props.hasOwnProperty('value')) {
            realValue = this.props.value;
        }
        return mdEditorShow ? (
            <>
                <MdEditor
                    markdownClass="description-md-editor"
                    config={{view: {menu: false, html: false}}}
                    placeholder={DESCRIPTION_TIPS}
                    renderHTML={(text) => mdParser.render(text)}
                    value={realValue}
                    onChange={this.handleEditorChange}
                    {...mdEditorProps}
                />
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
                <Space>
                    <span>{realValue}</span>
                    <Link onClick={this.handleEditClick}>{EDIT_ICON}</Link>
                </Space>
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
}







