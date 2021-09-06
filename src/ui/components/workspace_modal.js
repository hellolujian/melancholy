import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography} from 'antd';

import ScriptEditor from './script_editor'
import DAPTVSettingTabs from './DAPTV_setting_tabs'
class WorkspaceModal extends React.Component {

    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            // isModalVisible: false
        }
    }

    componentWillReceiveProps (nextProps) {
      
    }

    componentDidMount() {
      
    }

    handleModalCancel = () => {
        this.props.onVisibleChange(false);
    }

    handleModalOk = () => {
        this.formRef.current.submit()   
    }

    handleFormFinish = (values) => {
        this.handleModalCancel()
    }


    render() {
     
        const {workspaceId, collectionId, folderId, visible, initialValues} = this.props;
        const {isModalVisible} = this.state
        return (
            <Modal 
                title="CREATE NEW WORKSPACE" 
                zIndex={999999}
                centered
                bodyStyle={{ height: 600}}
                okButtonProps={{}}
                okText="Create Workspace"
                width={800}
                visible={visible} 
                onOk={this.handleModalOk} 
                onCancel={this.handleModalCancel}>
                <Form
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={this.handleFormFinish}
                >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input name!' }]}
                >
                    <Input />
                </Form.Item>

                
                </Form>
                <DAPTVSettingTabs />
            </Modal>
        );
    }
}

export default WorkspaceModal;







