import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography} from 'antd';

import ScriptEditor from './script_editor'
import DAPTVSettingTabs from './DAPTV_setting_tabs'
import {TabIconType, TabType, AuthSceneType} from '@/enums'
import {insertWorkspaceMeta, updateWorkspaceMeta} from '@/database/workspace_meta'
import {UUID} from '@/utils/global_utils'
class WorkspaceModal extends React.Component {

    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            // isModalVisible: false
            workspaceSettings: props.initialValues ? {...props.initialValues} : {}
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

    handleFormFinish = async (values) => {
        
        const {workspaceSettings} = this.state;
        const {description, auth, test, prerequest, variable} = workspaceSettings;
        const {id, name} = values;
        let data = {
            id: id || UUID(),
            name: name,
            description: description,
            auth: auth,
            test: test,
            prerequest: prerequest,
            variable: variable,
        }
        if (id) {
            await updateWorkspaceMeta(id, {$set: data})
        } else {
            await insertWorkspaceMeta(data)
        }
        this.handleModalCancel();
        this.props.onSave();
    }

    handleDAPTVSettingChange = (value) => {
        const {workspaceSettings} = this.state;
        this.setState({
            workspaceSettings: {
                ...workspaceSettings,
                ...value
            }
        })
    }


    render() {
     
        const {workspaceId, folderId, visible, initialValues} = this.props;
        const {workspaceSettings} = this.state
        return (
            <Modal 
                title="CREATE NEW WORKSPACE" 
                zIndex={999999}
                centered
                destroyOnClose
                bodyStyle={{ height: 600}}
                okButtonProps={{}}
                okText="Create Workspace"
                width={800}
                visible={visible} 
                onOk={this.handleModalOk} 
                onCancel={this.handleModalCancel}>
                <Form
                    layout="vertical"
                    preserve={false}
                    ref={this.formRef}
                    initialValues={initialValues}
                    onFinish={this.handleFormFinish}
                >
                    <Form.Item name="id" hidden />
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input name!' }]}
                    >
                        <Input />
                    </Form.Item>
                
                </Form>
                <DAPTVSettingTabs 
                    scene={AuthSceneType.WORKSPACE.name()}
                    // parentId={parentId}
                    // activeKey={extend.activeKey}
                    value={workspaceSettings} 
                    onChange={this.handleDAPTVSettingChange} 
                />
            </Modal>
        );
    }
}

export default WorkspaceModal;







