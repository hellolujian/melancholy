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

import {UUID, writeJsonFileSync, getCurrentTimeISOString} from '@/utils/global_utils'
import {importFromFile, importFromFilePath} from '@/utils/business_utils'
import {getVariableExportEnabledArr, getCopyMelancholyDBVariables} from '@/utils/common_utils'
import VariablesTable from './variables_table';
import ButtonModal from './button_modal'
import CommonSelectFile from './common_select_file'
import EnvironmentShareModal from './environment_share_modal'
import {queryWorkspaceMetaById, queryWorkspaceMeta, updateWorkspaceMeta} from '@/database/workspace_meta'
import {getCurrentWorkspaceId, getCurrentWorkspace} from '@/utils/store_utils';
import {ImportType, VariableScopeType} from '@/enums'

import PostmanSDK from 'postman-collection'
import { ToastContainer, toast } from 'react-toastify';

import {CommonValueType} from '@/enums'
import 'ui/style/environment_modal.css'

const { Link, Text, Paragraph } = Typography;
const { Option } = Select;
const {VariableScope} = PostmanSDK;
class EnvironmentModal extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            environments: [],
            scene: props.view || 'view'
        }
    }

    refreshData = async (extra, callback = () => {}) => {
        let environments = await queryEnvironmentMeta();
        this.setState({ environments: environments || [] , ...extra}, callback);
        
    }

    componentWillReceiveProps(nextProps) {
        const {scene} = nextProps;
        if (scene) {
            this.setState({scene: scene});
        }
    }

    componentDidMount = async () => {
        await this.refreshData();
      
    }

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
        this.props.onSave()
    }

    handleAddClick = () => {
        const {scene} = this.state;
        if (scene === 'add') {
            this.formRef.current.submit()  
        } else {
            this.setState({scene: 'add', editValues: {}, variable: []})
        }
    }

    handleImportClick = () => {
        this.setState({scene: 'import'})
    }

    handleCancelClick = () => {
        this.setState({scene: 'view'})
    }

    handleSaveGlobalClick = async () => {
        const {variable} = this.state;
        let currentWorkspaceId = await getCurrentWorkspaceId();
        await updateWorkspaceMeta(currentWorkspaceId, {$set: {variable: variable}})
        this.setState({scene: 'view', variable: []})
    }

    handleUpdateClick = () => {
        this.formRef.current.submit()  
    }

    handleGlobalClick = async () => {
        let currentWorkspace = await getCurrentWorkspace();
        let {variable = []} = currentWorkspace;
        this.setState({scene: 'global', variable: variable, globalVariableChange: false})
    }

    handleDuplicateClick = async (item) => {
        const {name, variable} = item;
        await insertEnvironmentMeta({
            id: UUID(),
            name: name + " Copy",
            variable: getCopyMelancholyDBVariables(variable),
        })
        await this.refreshData();
        this.props.onSave()
    } 

    handleDeleteEnvironmentMeta = async (id) => {
        await updateEnvironmentMeta(id, {$set: {deleted: true}})
        await this.refreshData();
        this.props.onSave()
    }

    handleMoreActionClick = async (key, item) => {

        // TODO: 这里的删除确认框可以封装个组件
        const {id} = item;
        if (key === 'delete') {
            Modal.confirm({
                title: 'DELETE ENVIRONMENT',
                icon: null,
                closable: true,
                width: 530,
                content: (
                    <>
                        <p>
                            Are you sure you want to delete this environment from this workspace?
                        </p>
                        <p>
                            Deleting this environment will also delete any monitors, mock servers and integrations using this environment from this workspace.
                        </p>
                    </>
                ),
                okText: 'Delete',
                cancelText: 'Cancel',
                onOk: () => this.handleDeleteEnvironmentMeta(id)
            });
        } else if (key === 'remove') {
            Modal.confirm({
                title: 'REMOVE ENVIRONMENT',
                icon: null,
                closable: true,
                width: 530,
                content: (
                    <>
                        <p>
                        Are you sure you want to remove this environment from this workspace?
                        </p>
                        <p>
                        Removing this environment will also remove any monitors, mock servers and integrations using this environment from this workspace.
                        </p>
                    </>
                ),
                okText: 'Remove',
                cancelText: 'Cancel',
                onOk: () => this.handleDeleteEnvironmentMeta(id)
            });
        }
    }

    handleVariableChange = (value) => {
        let updateObj = {variable: value,}
        if (this.state.scene === 'global') {
            updateObj.globalVariableChange = true;
        }
        this.setState(updateObj);
    }

    handleDownloadEnvironmentSelect = (filePath, item) => {
        const {id, variable, name} = item
        let fileJson = {
            id: id,
            name: name,
            values: getVariableExportEnabledArr(variable),
            _postman_variable_scope: VariableScopeType.ENVIRONMENT.code,
            _postman_exported_at: getCurrentTimeISOString()
        }
        writeJsonFileSync(filePath, fileJson);
        toast.success(`Your environment was exported successfully.`, {
            position: toast.POSITION.BOTTOM_RIGHT,
        })
    }

    handleDownloadGlobalSelect = async (filePath) => {
        const {globalVariableChange, variable} = this.state;
        const currentWorkspace = await getCurrentWorkspace() || {};
        const {id, name} = currentWorkspace;
        let fileJson = {
            id: id,
            name: `${name} Globals`,
            values: getVariableExportEnabledArr(variable),
            _postman_variable_scope: VariableScopeType.GLOBALS.code,
            _postman_exported_at: getCurrentTimeISOString()
        }

        writeJsonFileSync(filePath, fileJson)

        if (globalVariableChange) {
            this.handleSaveGlobalClick()
        }
        
        toast.success(`Your globals were exported successfully.`, {
            position: toast.POSITION.BOTTOM_RIGHT,
        })
    }

    handleImportSelect = async (targetFile) => {
        importFromFilePath(targetFile, ImportType.ENVIRONMENT.name(), () => this.refreshData({scene: 'view'}))
    }

    getDownloadGlobalPath = async () => {
        let currentWorkspace = await getCurrentWorkspace() || {};
        return `${currentWorkspace.name}.postman_globals.json`;
    }

    render() {
     
        const {visible} = this.props;
        const { environments, scene, editValues, variable, globalVariableChange, workspaceList = []} = this.state;

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
                                    defaultPath={this.getDownloadGlobalPath}
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
                                <Button type="primary" onClick={this.handleSaveGlobalClick}>Save</Button>
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
                                label="Select File"
                                multiple
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
                                                    <EnvironmentShareModal environmentId={item.id} />
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
                                    <Input autoFocus placeholder="Environment Name" />
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
    onSave: () => {},
}






