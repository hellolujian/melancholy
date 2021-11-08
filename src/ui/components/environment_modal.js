import React from 'react';
import {Input, Alert, Button, Form, Modal, Typography, List, Space, Upload, Select } from 'antd';
import {
    ENVIRONMENT_TIPS,
    VARIABLE_VALUE_TIPS,
    ENVIRONMENT_EXT_TIPS,
    GLOBALS_TIPS
} from 'ui/constants/tips'
import {
    SHARE_COLLECTION_ICON, ELLIPSIS_ICON, RENAME_ICON, EDIT_ICON, CREATE_FORK_ICON, 
    MERGE_CHANGES_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, 
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, 
} from '@/ui/constants/icons'

import TooltipButton from './tooltip_button';
import DropdownTooltip from './dropdown_tooltip'

import {queryEnvironmentMeta, updateEnvironmentMeta, insertEnvironmentMeta} from '@/database/environment_meta'
import {queryCommonMeta, updateCommonMeta, queryCommonMetaByType} from '@/database/common_meta'

import {UUID, compareObjectIgnoreEmpty} from '@/utils/global_utils'
import VariablesTable from './variables_table';
import ButtonModal from './button_modal'
import CommonSelectFile from './common_select_file'

import {CommonValueType} from '@/enums'
import 'ui/style/environment_modal.css'

const { Link, Text, Paragraph } = Typography;
const { Option } = Select;
class EnvironmentModal extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            environments: [],
            scene: 'view'
        }
    }

    refreshData = async (extra) => {
        let environments = await queryEnvironmentMeta();
        this.setState({ environments: environments || [] , ...extra});
    }

    componentDidMount = async () => {
        await this.refreshData();
      
    }

    handleOk = () => {}

    handleModalCancel = () => {
        this.props.onVisibleChange(false);
        this.setState({scene: 'view'})
    }

    handleEnvironmentItemClick = (item) => {
        this.setState({scene: 'update', editValues: item, variable: item.variable})
    }

    handleFormFinish = async (values) => {
        const {variable} = this.state;
        const {id, name} = values;
        if (id) {
            await updateEnvironmentMeta(id, {$set: {name: name, variable: variable}})
        } else {
            await insertEnvironmentMeta(
                {
                    id: UUID(),
                    name: name,
                    variable: variable
                }
            )
        }
        await this.refreshData({scene: 'view'})
    }

    handleAddClick = () => {
        const {scene} = this.state;
        if (scene === 'add') {
            this.formRef.current.submit()  
        } else {
            this.setState({scene: 'add', editValues: {}})
        }
    }

    handleImportClick = () => {
        this.setState({scene: 'import'})
    }

    handleCancelClick = () => {
        this.setState({scene: 'view'})
    }

    handleSaveClick = async () => {
        const {variable} = this.state;
        await updateCommonMeta({type: CommonValueType.GLOBALS.name()}, {type: CommonValueType.GLOBALS.name(), value: variable}, {upsert: true})
        this.setState({scene: 'view', variable: []})
    }

    handleUpdateClick = () => {
        this.formRef.current.submit()  
    }

    handleGlobalClick = async () => {
        let globalVariable = await queryCommonMetaByType( CommonValueType.GLOBALS.name()) || {}
        this.setState({scene: 'global', variable: globalVariable.value, globalVariableChange: false})
    }

    handleDuplicateClick = async (item) => {
        const {name, variable} = item;
        await insertEnvironmentMeta({
            id: UUID(),
            name: name + " Copy",
            variable: variable,
        })
        await this.refreshData();
    } 

    handleMoreActionClick = async (key, item) => {
        const {id} = item;
        await updateEnvironmentMeta(id, {$set: {deleted: true}})
        await this.refreshData();
    }

    handleVariableChange = (value) => {
        let updateObj = {variable: value,}
        if (this.state.scene === 'global') {
            updateObj.globalVariableChange = true;
        }
        this.setState(updateObj);
    }

    writeFileSync = (filePath, fileContent) => {
        const fs = window.require('fs');
        
        fs.writeFileSync(  
            filePath,
            fileContent, 
            (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('写入成功')
                }
        });
    }

    handleDownloadEnvironmentSelect = (filePath, item) => {
        const {id, variable = [], name} = item
        let fileJson = {
            id: id,
            values: variable.map(v => {
                return {
                    key: v.name, 
                    value: v.initialValue || '', 
                    enabled: v.disabled ? false : true
                }
            }),
            name: name + ".postman_environment.json",
            "_postman_variable_scope": "environment",
            "_postman_exported_at": "2021-11-08T07:40:26.168Z",
            "_postman_exported_using": "Postman/7.3.6"
        }
        this.writeFileSync(filePath, JSON.stringify(fileJson, "", "\t"))
    }

    handleDownloadGlobalSelect = (filePath) => {
        const {globalVariableChange,} = this.state;
        
        let fileJson = {
            id: '234saf',
            values: [
                {key: '234', value: 'sdf', enabled: true}
            ],
            name: "测试私有个人工作空间 globals",
            "_postman_variable_scope": "globals",
            "_postman_exported_at": "2021-11-08T07:40:26.168Z",
            "_postman_exported_using": "Postman/7.3.6"
        }
        this.writeFileSync(filePath, JSON.stringify(fileJson, "", "\t"))

        if (globalVariableChange) {
            this.handleSaveClick()
        }
    }

    handleImportSelect = (selectFiles) => {
        if (selectFiles && selectFiles.length > 0) {
            
        }
    }

    render() {
     
        const {workspaceId, collectionId, folderId, visible} = this.props;
        const { environments, scene, editValues, variable, globalVariableChange} = this.state;

        let variableAndTips = (
            <>
                <div style={{maxHeight: 350, overflow: 'auto'}}>
                    <VariablesTable 
                        value={variable}
                        onChange={this.handleVariableChange}
                    />
                </div>
                                
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
                                <CommonSelectFile 
                                    label={(globalVariableChange ? "Save and " : "") + "Download as JSON"}
                                    mode="save"
                                    title="Select path to save file"
                                    defaultPath="测试私有个人工作空间.postman_globals.json"
                                    onSelect={this.handleDownloadGlobalSelect}
                                    buttonProps={{type: 'text', className: 'postman-button-class'}}
                                />
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
                destroyOnClose
                onOk={this.handleOk} 
                onCancel={this.handleModalCancel}>
                {
                    scene === 'import' && (
                        <div direction="vertical">
                            <Paragraph strong>Import Environment</Paragraph>

                            <Paragraph>Select environment files from your computer</Paragraph>
                            
                            <CommonSelectFile 
                                multiple
                                label="Select File"
                                onSelect={this.handleImportSelect}
                                buttonProps={{type: 'text', className: 'postman-button-class'}}
                            />

                        </div>
                    )
                }

                {
                    scene === 'global' && (
                        <Space direction="vertical" size="large">
                            {GLOBALS_TIPS}
                            <Space direction="vertical">
                                <Text strong>Globals</Text>
                                {variableAndTips}
                            </Space>
                        </Space>
                    )
                }
                
                {
                    scene === 'view' && (
                        <Space direction="vertical" size="large">
                            <Space direction="vertical" size="large">
                                {ENVIRONMENT_TIPS}
                                {
                                    environments.length === 0 && (
                                        <Paragraph>
                                            {ENVIRONMENT_EXT_TIPS}
                                            <Link onClick={this.handleAddClick}>Create an environment</Link> to get started.
                                        </Paragraph>
                                    )
                                }
                                
                            </Space>
                            
                            {
                                environments.length > 0 && (
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
                                                        label="share"
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
                                                    <span>
                                                        <TooltipButton 
                                                            onClick={() => this.handleDuplicateClick(item)}
                                                            tooltipProps={{title: 'Duplicate Environment'}}
                                                            buttonProps={{icon: DUPLICATE_ICON, type: 'text', className: 'postman-button-class'}}
                                                        />

                                                        <CommonSelectFile 
                                                            mode="save"
                                                            title="Select path to save file"
                                                            defaultPath={item.name + ".postman_environment.json"}
                                                            onSelect={(filePath) => this.handleDownloadEnvironmentSelect(filePath, item)}
                                                            tooltipProps={{title: 'Download Environment'}}
                                                            buttonProps={{icon: EXPORT_ICON, type: 'text', className: 'postman-button-class'}}
                                                        />
                                                        {/* <TooltipButton 
                                                            onClick={() => this.handleDownloadClick(item)}
                                                            tooltipProps={{title: 'Download Environment'}}
                                                            buttonProps={{icon: EXPORT_ICON, type: 'text', className: 'postman-button-class'}}
                                                        /> */}
                                                        <DropdownTooltip 
                                                            trigger="click"
                                                            overlayMenu={{
                                                                menuProps: {
                                                                    onClick: ({key}) => this.handleMoreActionClick(key, item)
                                                                },
                                                                items: [
                                                                    {label: 'Delete', value: 'delete'},
                                                                    {label: 'Remove from workspace', value: 'remove'}
                                                                ]
                                                            }}
                                                            title="View more actions"
                                                            type="text" 
                                                            onClick={this.handleOpenNewBtnClick} 
                                                            buttonProps={{className: "postman-button-class", icon: ELLIPSIS_ICON}} 
                                                        />
                                                    </span>
                                                </Space>
                                                
                                            )
                                        ]}>
                                            <Button type="text" size="small" onClick={() => this.handleEnvironmentItemClick(item)}>{item.name}</Button>
                                        </List.Item>
                                    )}
                                />
                                )
                            }
                                
                        </Space>
                    )
                }
                {
                    (scene === 'update' || scene === 'add') && (
                        <>
                            <Form
                                layout="vertical"
                                preserve={false}
                                ref={this.formRef}
                                initialValues={editValues}
                                onFinish={this.handleFormFinish}
                                >
                                <Form.Item name="id" hidden />
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

                            {variableAndTips}
                            
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






