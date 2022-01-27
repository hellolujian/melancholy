import React from 'react';
import {Popover, Button, Typography, Table, Space, Alert} from 'antd';
import TooltipButton from './tooltip_button'
import {
    GLOBAL_TEXT_TIPS,
    VARIABLE_VALUE_TIPS,
    ENVIRONMENT_TEXT_TIPS,
    ENVIRONMENT_LINK_TIPS,
    NO_ENVIRONMENT_VARIABLES_TIPS,
    NO_GLOBAL_VARIABLES_TIPS,
    NO_ENVIRONMENT_TIPS,
    GLOBAL_LINK_TIPS
} from 'ui/constants/tips'
import { EyeOutlined } from '@ant-design/icons';
import {queryEnvironmentMetaById, updateEnvironmentMeta} from '@/database/environment_meta'
import {getCurrentWorkspace} from '@/utils/store_utils';
import {
    publishEnvironmentOpen
} from '@/utils/event_utils'
import {updateWorkspaceMeta} from '@/database/workspace_meta'
import EditableText from './editable_text'


class EnvironmentDetailCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
       
        }
    }

    componentDidMount() {
      
    }

    handlePopoverVisibleChange = async (visible) => {
        if (visible) {
            const {currentEnvironmentId} = this.props;
            let currentEnvironment = currentEnvironmentId ? await queryEnvironmentMetaById(currentEnvironmentId) : {};
            let currentWorkspace = await getCurrentWorkspace();
            this.setState({popoverVisible: true, currentEnvironment: currentEnvironment, currentWorkspace: currentWorkspace})
        } else {
            this.setState({popoverVisible: false})
        }
    }

    handleCurrentEnvironmentSave = () => {
        this.setState({popoverVisible: false})
        const {currentEnvironmentId} = this.props;
        const {currentEnvironment} = this.state;
        if (currentEnvironmentId) {
            publishEnvironmentOpen({scene: 'update', envData: currentEnvironment})
        } else {
            publishEnvironmentOpen({scene: 'add'})
        }
        
    }

    handleEditGlobalClick = () => {
        this.setState({popoverVisible: false})
        publishEnvironmentOpen({scene: 'global'})
    }

    handleCurrentValueSave = (variableId, value, scope) => {
        let {currentEnvironment = {}, currentWorkspace = {},} = this.state;
        if (scope === 'env') {
            let {id: envId, variable: currentEnvironmentVariable = []} = currentEnvironment;
            let targetVariable = currentEnvironmentVariable.find(item => item.id === variableId);
            targetVariable.currentValue = value;
            updateEnvironmentMeta(envId, {$set: {variable: currentEnvironmentVariable}})
        } else if (scope === 'workspace') {
            let {id: workspaceId, variable: globalVariable = []} = currentWorkspace;
            let targetVariable = globalVariable.find(item => item.id === variableId);
            targetVariable.currentValue = value;
            updateWorkspaceMeta(workspaceId, {$set: {variable: globalVariable}})
        }
    }

    render() {
     
        let {currentEnvironment = {}, currentWorkspace = {}, popoverVisible} = this.state;
        let {variable: currentEnvironmentVariable = [], name: currentEnvironmentName} = currentEnvironment;
        let {variable: globalVariable = []} = currentWorkspace;
        let enableEnvironmentVariable = currentEnvironmentVariable.filter(variable => !variable.disabled)
        let enableGlobalVariable = globalVariable.filter(variable => !variable.disabled)
        let {currentEnvironmentId} = this.props;
      
        let columns = (scope) => [
            {
                title: "VARIABLE", 
                dataIndex: 'key',
            },
            {
                title: "INITIAL VALUE", 
                dataIndex: 'initialValue',
            },
            {
                title: "CURRENT VALUE", 
                dataIndex: 'currentValue',
                render: (text = '', record, index) => {
                    return (
                        <EditableText 
                            defaultValue={text}
                            // editIconClass={sourceRequestExist ? "request-intro-edit-icon" : 'request-intro-edit-icon-none'}
                            onSave={(value) => this.handleCurrentValueSave(record.id, value, scope)}
                            // onChange={this.handleNameChange}
                        />
                    )
                }
            },
        ]

        let cardContent = (
            <Space direction="vertical">
                <Space direction="vertical" className="full-width">
                    <div className="justify-content-space-between vertical-center">
                        <Typography.Text strong>{currentEnvironmentName || 'Environment'}</Typography.Text>
                        <Button type="link" onClick={this.handleCurrentEnvironmentSave}>{currentEnvironmentId ? 'Edit' : 'Add'}</Button>
                    </div>

                    {
                        enableEnvironmentVariable.length > 0 ? (
                            <Table 
                                rowKey="id"
                                tableLayout="fixed"
                                columns={columns('env')} 
                                dataSource={enableEnvironmentVariable} 
                                pagination={false} 
                            />
                        ) : (
                            <Space direction="vertical" align="center" className="full-width">
                                {currentEnvironmentId ? NO_ENVIRONMENT_VARIABLES_TIPS : NO_ENVIRONMENT_TIPS}
                                {ENVIRONMENT_TEXT_TIPS}
                                {ENVIRONMENT_LINK_TIPS}
                            </Space>
                        )
                    }

                    
                </Space>

                <Space direction="vertical" className="full-width" style={{marginBottom: 20}}>
                    <div className="justify-content-space-between vertical-center">
                        <Typography.Text strong>Globals</Typography.Text>
                        <Button type="link" onClick={this.handleEditGlobalClick}>Edit</Button>
                    </div>
                    {
                        enableGlobalVariable.length > 0 ? (
                            <Table 
                                rowKey="id"
                                tableLayout="fixed"
                                columns={columns('workspace')} 
                                dataSource={enableGlobalVariable} 
                                pagination={false} 
                            />
                        ) : (
                            <Space direction="vertical" align="center" className="full-width">
                                {NO_GLOBAL_VARIABLES_TIPS}
                                {GLOBAL_TEXT_TIPS}
                                {GLOBAL_LINK_TIPS}
                            </Space>
                        )
                    }
                    
                </Space>

                <Alert
                    // style={{position: 'absolute', bottom: 70}}
                    description={VARIABLE_VALUE_TIPS}
                    type="info"
                    showIcon
                    closable
                    onClose={this.handleVariableValuesTipClose}
                />
                
            </Space>
            
        );
        return (
            <Popover 
                content={cardContent} 
                overlayStyle={{width: 800}} 
                trigger="click"
                visible={popoverVisible}
                arrowPointAtCenter
                onVisibleChange={this.handlePopoverVisibleChange}
            >
                <TooltipButton title="Environment quick look"
                    buttonProps={{type: 'default', icon: <EyeOutlined />}}
                />
            </Popover>
        )
    }
}

export default EnvironmentDetailCard;







