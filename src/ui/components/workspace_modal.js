import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography} from 'antd';

import ScriptEditor from './script_editor'
class RequestModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // isModalVisible: false
        }
    }

    componentWillReceiveProps (nextProps) {
        const { isModalVisible: newVisibleValue } = nextProps;
        const { lastPropsVisible } = this.state;
        if (lastPropsVisible !== newVisibleValue) {
            this.setState({isModalVisible: newVisibleValue, lastPropsVisible: newVisibleValue})
        } 
    }

    componentDidMount() {
      
    }

    handleOk = () => {}

    handleCancel = () => {
        this.setState({isModalVisible: false})
    }

    render() {
     
        const {workspaceId, collectionId, folderId} = this.props;
        const {isModalVisible} = this.state
        return (
            <Modal 
                title="CREATE NEW WORKSPACE" 
                zIndex={999999}
                centered
                // bodyStyle={{ height: 600}}
                okButtonProps={{}}
                okText="Create Workspace"
                // width={800}
                visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                <Form
                layout="vertical"
                //   onFinish={onFinish}
                //   onFinishFailed={onFinishFailed}
                >
                <Form.Item
                    label="Name"
                    rules={[{ required: true, message: 'Please input name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Summary">
                    
                    <Input />
                        
                </Form.Item>

                <ScriptEditor />
                
                </Form>
            </Modal>
        );
    }
}

export default RequestModal;







