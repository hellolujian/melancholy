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

import {queryEnvironmentMeta, queryEnvironmentMetaById, insertEnvironmentMeta} from '@/database/environment_meta'
import {queryCommonMeta, updateCommonMeta, queryCommonMetaByType} from '@/database/common_meta'

import {UUID, writeJsonFileSync, getCurrentTimeISOString} from '@/utils/global_utils'
import {importFromFile, importFromFilePath} from '@/utils/business_utils'
import {getCopyMelancholyDBVariables} from '@/utils/common_utils'
import VariablesTable from './variables_table';
import ButtonModal from './button_modal'
import CommonSelectFile from './common_select_file'
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
class EnvironmentShareModal extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount = async () => {
      
    }

    handleShareWorkspaceChange = (value) => {
        this.setState({shareWorkspaceId: value});
    }

    handleShareWorkspace = async () => {
        const {shareWorkspaceId} = this.state;
        if (!shareWorkspaceId) {
            return;
        }
        console.log(shareWorkspaceId);
        const {environmentId} = this.props;
        const environmentMeta = await queryEnvironmentMetaById(environmentId);
        console.log(environmentMeta);
        if (!environmentMeta) return;
        const {name, variable} = environmentMeta;
        const shareEnvObj = {
            id: UUID(),
            name: name,
            workspaceId: shareWorkspaceId,
            variable: getCopyMelancholyDBVariables(variable)
        };
        insertEnvironmentMeta(shareEnvObj)
    }

    handleShareModalVisibleChange = async (visible) => {
        if (visible) {
            let currentWorkspaceId = await getCurrentWorkspaceId();
            let workspaceList = await queryWorkspaceMeta();
            let workspaceListButCurrent = workspaceList.filter(workspace => workspace.id !== currentWorkspaceId)
            this.setState({
                workspaceList: workspaceList, 
                currentWorkspaceId: currentWorkspaceId,
                shareWorkspaceId: workspaceListButCurrent.length > 0 ? workspaceListButCurrent[0].id : ''
            });
        }
    }

    render() {

        const {workspaceList = [], currentWorkspaceId, shareWorkspaceId} = this.state; 
        const shareWorkspaceList = workspaceList.filter(workspace => workspace.id !== currentWorkspaceId);
        return (
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
                        <Select 
                            style={{ width: '100%' }} 
                            options={shareWorkspaceList.map(workspace => {
                                return {
                                    label: workspace.name,
                                    value: workspace.id
                                }
                            })}
                            value={shareWorkspaceId}
                            onChange={this.handleShareWorkspaceChange}
                        />
                    </>
                }
                onVisibleChange={this.handleShareModalVisibleChange}
                onModalOk={this.handleShareWorkspace}
            />
        )
    }
}

export default EnvironmentShareModal;

EnvironmentShareModal.defaultProps = {
    onVisibleChange: () => {},
    onSave: () => {},
}






