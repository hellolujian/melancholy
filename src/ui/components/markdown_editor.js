import React from 'react';
import {Tooltip, Button, Space, Row, Col } from 'antd';

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

import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';
import 'ui/style/markdown_editor.css'

// 注册插件（如果有的话）
// MdEditor.use(YOUR_PLUGINS_HERE);

// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);

class MarkdowonEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleSaveClick = () => {

    }

    handleAddDescriptionClick = () => {
        this.setState({mdEditorShow: true});
    }

    handleCancelClick = () => {
        this.setState({mdEditorShow: false});
    }

    render() {
        return (
            <MdEditor
                    markdownClass="description-md-editor"
                    config={{view: {menu: false, html: false}}}
                    placeholder={DESCRIPTION_TIPS}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={this.handleEditorChange}
                />
        )
    }
}

export default MarkdowonEditor;







