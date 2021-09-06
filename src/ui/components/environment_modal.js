import React from 'react';
import {Input, Alert, Button, Form, Modal, Typography, List, Space, Upload, Select } from 'antd';
import {
    ENVIRONMENT_TIPS,
    VARIABLE_VALUE_TIPS,
} from 'ui/constants/tips'
import {
    SHARE_COLLECTION_ICON, ELLIPSIS_ICON, RENAME_ICON, EDIT_ICON, CREATE_FORK_ICON, 
    MERGE_CHANGES_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, 
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, 
} from '@/ui/constants/icons'

import VariablesTable from './variables_table';
import ButtonModal from './button_modal'
import 'ui/style/environment_modal.css'

const { Link, Text, Paragraph } = Typography;
const { Option } = Select;
class EnvironmentModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            environments: [
                {id: 'qa', name: 'qa',},
                {id: 'qa1', name: 'qa1',},
            ],
            scene: 'view'
        }
    }

    componentDidMount() {
      
    }

    handleOk = () => {}

    handleModalCancel = () => {
        this.props.onVisibleChange(false);
    }

    handleEnvironmentItemClick = () => {
        this.setState({scene: 'update'})
    }

    handleAddClick = () => {
        this.setState({scene: 'add'})
    }

    handleImportClick = () => {
        this.setState({scene: 'import'})
    }

    handleCancelClick = () => {
        this.setState({scene: 'view'})
    }

    handleSaveClick = () => {
        this.setState({scene: 'view'})
    }

    handleUpdateClick = () => {
        this.setState({scene: 'view'})
    }

    handleGlobalClick = () => {
        this.setState({scene: 'global'})
    }

    render() {
     
        const {workspaceId, collectionId, folderId, visible} = this.props;
        const { environments, scene} = this.state;
        return (
            <Modal 
                title="MANAGE ENVIRONMENTS" 
                centered
                bodyStyle={{ height: 600}}
                okButtonProps={{}}
                footer={(
                    <div className="justify-content-flex-end">
                        {
                            scene === 'view' && (
                                <Button type="text" className="postman-button-class" onClick={this.handleGlobalClick}>Globals</Button>
                            )
                        }
                        {
                            scene === 'view' && (
                                <Button type="text" className="postman-button-class" onClick={this.handleImportClick}>Import</Button>
                            )
                        }
                        {
                            scene === 'global' && (
                                <Button type="text" className="postman-button-class" onClick={this.handleCancelClick}>Download as JSON</Button>
                            )
                        }
                        {
                            scene === 'global' && (
                                <Button type="link" onClick={this.handleCancelClick}>Cancel</Button>
                            )
                        }
                        {
                            (scene === 'import' || scene === 'add' || scene === 'update') && (
                                <Button type="text" className="postman-button-class" onClick={this.handleCancelClick}>Cancel</Button>
                            )
                        }
                        {
                            (scene === 'view' || scene === 'add') && (
                                <Button type="primary" onClick={this.handleAddClick}>Add</Button>
                            )
                        }
                        {
                            scene === 'global' && (
                                <Button type="primary" onClick={this.handleSaveClick}>Save</Button>
                            )
                        }
                        {
                            scene === 'update' && (
                                <Button type="primary" onClick={this.handleUpdateClick}>Update</Button>
                            )
                        }
                    </div>
                )}
                width={800}
                visible={visible} 
                onOk={this.handleOk} 
                onCancel={this.handleModalCancel}>
                {
                    scene === 'import' && (
                        <div direction="vertical">
                            <Paragraph strong>Import Environment</Paragraph>

                            <Paragraph>Select environment files from your computer</Paragraph>
                            
                            <Upload >
                                <Button>Select File</Button>
                            </Upload>

                        </div>
                    )
                }
                
                {
                    scene === 'view' && (
                        <>
                            {ENVIRONMENT_TIPS}
                            <List
                                className="environment_modal_list"
                                size="small"
                                //   header={<div>Header</div>}
                                //   footer={<div>Footer</div>}
                                //   bordered
                                dataSource={environments}
                                renderItem={item => (
                                    <List.Item actions={[
                                        (
                                            <Space>
                                                <ButtonModal 
                                                    buttonLabel="share"
                                                    buttonProps={{
                                                        className: "postman-button-class", type: "text", icon: SHARE_COLLECTION_ICON, 
                                                    }} 
                                                    modalProps={{
                                                        okText: 'Share', cancelText: 'Cancel', title: 'SHARE ENVIRONMENT'
                                                    }} 
                                                    modalContent={
                                                        <>
                                                            <p>Share in Workspace</p>
                                                            <Select defaultValue="lucy" style={{ width: '100%' }} onChange={this.handleChange}>
                                                                <Option value="jack">Jack</Option>
                                                                <Option value="lucy">Lucy</Option>
                                                                <Option value="disabled" disabled>
                                                                    Disabled
                                                                </Option>
                                                                <Option value="Yiminghe">yiminghe</Option>
                                                            </Select>
                                                        </>
                                                    }
                                                />
                                                {/* <Button className="postman-button-class" type="text" icon={SHARE_COLLECTION_ICON}>share</Button> */}
                                                <span>
                                                    <Button type="text" icon={DUPLICATE_ICON} className="postman-button-class" />
                                                    <Button type="text" icon={EXPORT_ICON} className="postman-button-class" />
                                                    <Button type="text" icon={ELLIPSIS_ICON} className="postman-button-class" />
                                                </span>
                                            </Space>
                                            
                                        )
                                    ]}>
                                        <Button type="text" size="small" onClick={this.handleEnvironmentItemClick}>{item.id}</Button>
                                    </List.Item>
                                )}
                            />
                        </>
                    )
                }
                {
                    (scene === 'update' || scene === 'add') && (
                        <>
                            <Form
                                layout="vertical"
                                //   onFinish={onFinish}
                                //   onFinishFailed={onFinishFailed}
                                >
                                <Form.Item
                                    label="Add Environment"
                                    name="name"
                                    rules={[{ required: true, message: '' }]}
                                >
                                    <Input placeholder="Environment Name" />
                                </Form.Item>

                                {/* <Form.Item label="Summary">
                                    
                                    <Input />
                                        
                                </Form.Item> */}
                            
                            </Form>

                            <VariablesTable />
                            <Alert
                                style={{position: 'absolute', bottom: 70, left: 20, right: 20}}
                                description={VARIABLE_VALUE_TIPS}
                                type="info"
                                showIcon
                                closable
                                onClose={this.handleVariableValuesTipClose}
                            />
                        </>
                    )
                }
            </Modal>
        );
    }
}

export default EnvironmentModal;

EnvironmentModal.defaultProps = {
    onVisibleChange: () => {},
}






