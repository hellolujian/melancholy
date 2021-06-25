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

// 注册插件（如果有的话）
// MdEditor.use(YOUR_PLUGINS_HERE);

// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);

const { TabPane } = Tabs;
const { Text, Link } = Typography;

const { TextArea } = Input;
class EnvironmentModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            lastPropsVisible: false
        }
    }

    componentWillReceiveProps (nextProps) {
        const { visible: newVisibleValue } = nextProps;
        const { lastPropsVisible } = this.state;
        if (lastPropsVisible !== newVisibleValue) {
            this.setState({visible: newVisibleValue, lastPropsVisible: newVisibleValue})
        } 
    }

    componentDidMount() {
      
    }

    handleOk = () => {}

    handleModalCancel = () => {
        this.setState({visible: false, lastPropsVisible: false})
    }

    render() {
     
        const {workspaceId, collectionId, folderId} = this.props;
        const {visible} = this.state;
        return (
            <Modal 
                title="MANAGE ENVIRONMENTS" 
                centered
                // bodyStyle={{ height: 600}}
                okButtonProps={{}}
                okText="Create Workspace"
                // width={800}
                visible={visible} onOk={this.handleOk} onCancel={this.handleModalCancel}>
                <Form
                layout="vertical"
                //   onFinish={onFinish}
                //   onFinishFailed={onFinishFailed}
                >
                <Form.Item
                    label="Add Environment"
                    rules={[{ required: true, message: 'Please input name!' }]}
                >
                    <Input placeholder="Environment Name" />
                </Form.Item>

                <Form.Item label="Summary">
                    
                    <Input />
                        
                </Form.Item>


                
                </Form>
            </Modal>
        );
    }
}

export default EnvironmentModal;







