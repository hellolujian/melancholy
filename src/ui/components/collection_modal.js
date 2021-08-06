import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import ScriptEditor from './script_editor'

import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';

import VariablesTable from './variables_table';
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
class CollectionModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
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
                bodyStyle={{ height: 600}}
                okButtonProps={{}}
                okText="Create"
                width={800}
                visible={visible} onOk={this.handleOk} onCancel={this.handleModalCancel}>
                <Form
                layout="vertical"
                //   onFinish={onFinish}
                //   onFinishFailed={onFinishFailed}
                >
                <Form.Item
                    label="Name"
                    rules={[{ required: true, message: 'Please input collection name!' }]}
                >
                    <Input placeholder="Collection Name" />
                </Form.Item>
                </Form>

                <Tabs defaultActiveKey="prerequestscripts" onChange={this.handleTabChange} style={{height: '100%', position: 'relative'}}>
                    <TabPane tab="Description" key="description">
                        <Space direction="vertical">
                        {COLLECTION_DESCRIPTION_TIPS}
                       

                        <MdEditor
                            style={{ height: "300px" }}
                            config={{view: {menu: false, html: false}}}
                            placeholder={DESCRIPTION_TIPS}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                        />
                        {DESCRIPTION_MARKDOWN_TIPS}
                        </Space>
                        
                    </TabPane>
                    <TabPane tab="Authorization" key="authorization">
                        {AUTHORIZATION_TIPS}
                    </TabPane>
                    <TabPane tab="Pre-request Scripts" key="prerequestscripts">
                        {PRE_REQUEST_SCRIPTS_TIPS}
                         <ScriptEditor />
                    </TabPane>
                    <TabPane tab="Tests" key="tests">
                        {TESTS_TIPS}
                    </TabPane>
                    <TabPane tab="Variables" key="variables">
                        <Space direction="vertical">
                            {VARIABLE_TIPS}
                            <VariablesTable />
                        </Space>
                        <Alert
                            style={{position: 'absolute', bottom: 70}}
                            description={VARIABLE_VALUE_TIPS}
                            type="info"
                            showIcon
                            closable
                            onClose={this.handleVariableValuesTipClose}
                        />
                    </TabPane>
                </Tabs>
                
                
            </Modal>
        );
    }
}

export default CollectionModal;

CollectionModal.defaultProps = {
    onVisibleChange: () => {},
}






