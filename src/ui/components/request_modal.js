import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography} from 'antd';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"


import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';

import EditableTable from './editable_table';

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

// 注册插件（如果有的话）
// MdEditor.use(YOUR_PLUGINS_HERE);

// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);

const { TabPane } = Tabs;
const { Text, Link } = Typography;

const { TextArea } = Input;
class RequestModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // visible: props.visible
        }
    }

    componentDidMount() {
        
    }

    handleOk = () => {}

    handleModalCancel = () => {
        this.props.onVisibleChange(false);
    }

    render() {
     
        const {workspaceId, collectionId, folderId, visible} = this.props;
        return (
            <Modal 
                title="CREATE A NEW COLLECTION" 
                centered
                // bodyStyle={{ height: 600}}
                okButtonProps={{}}
                okText="Create"
                width={500}
                visible={visible} 
                onOk={this.handleOk} 
                onCancel={this.handleModalCancel}>
                <Form
                    layout="vertical"
                    //   onFinish={onFinish}
                    //   onFinishFailed={onFinishFailed}
                >
                <Form.Item
                    label="Request name"
                    rules={[{ required: true, message: 'Please input Request name!' }]}
                >
                    <Input placeholder="Request Name" />
                </Form.Item>

                <Form.Item label="Request description (Optional)" extra={DESCRIPTION_MARKDOWN_TIPS}>
                    
                    <MdEditor
                        style={{ height: "120px" }}
                        config={{view: {menu: false, html: false}}}
                        placeholder={DESCRIPTION_TIPS}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                    />
                        
                </Form.Item>

                <Form.Item label="Select a collection or folder to save to:">
                    
                
                </Form.Item>


                
                </Form>
            </Modal>
        );
    }
}

export default RequestModal;

RequestModal.defaultProps = {
    onVisibleChange: () => {},
}






