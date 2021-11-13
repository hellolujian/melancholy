import React from 'react';
import {Popover, Button, Typography, Table, Space, Divider, Alert} from 'antd';
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
import { EyeOutlined, SettingFilled  } from '@ant-design/icons';
import {queryEnvironmentMetaById} from '@/database/environment_meta'
import {getCurrentWorkspace} from '@/utils/store_utils';
import {insertWorkspaceMeta, updateWorkspaceMeta} from '@/database/workspace_meta'
import EnvironmentModal from './environment_modal'


class EnvironmentDetailCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
       
        }
    }

    componentDidMount() {
      
    }

    columns: [
        {
            title: "VARIABLE", 
            dataIndex: 'variable',
        },
        {
            title: "INITIAL VALUE", 
            dataIndex: 'initialValue',
        },
        {
            title: "CURRENT VALUE", 
            dataIndex: 'currentValue',
        },
    ]

    handleVisibleChange = async (visible) => {
        if (visible) {
            const {currentEnvironmentId} = this.props;
            let currentEnvironment = currentEnvironmentId 
                ? await queryEnvironmentMetaById(currentEnvironmentId)
                : {};
            let currentWorkspace = await getCurrentWorkspace();
            this.setState({popoverVisible: true, currentEnvironment: currentEnvironment, currentWorkspace: currentWorkspace})
        } else {
            this.setState({popoverVisible: false})
        }
    }

    handleCurrentEnvironmentSave = () => {
        this.setState({environmentModalVisible: true, popoverVisible: false})
        const {currentEnvironmentId} = this.props;
        const {currentEnvironment} = this.state;
        if (currentEnvironmentId) {
            this.environmentModalRef.handleEnvironmentItemClick(currentEnvironment)
        } else {
            this.environmentModalRef.handleAddClick()
        }
        
    }

    handleEnvironmentModalVisible = (visible) => {
        this.setState({environmentModalVisible: visible});
    }

    handleEnvironmentModalRef = (ref) => {
        if (ref) {
            this.environmentModalRef = ref;
        }
    }

    handleEditGlobalClick = () => {
        this.setState({environmentModalVisible: true, popoverVisible: false})
        this.environmentModalRef.handleGlobalClick();
    }

    render() {
     
        let {currentEnvironment = {}, currentWorkspace = {}, environmentModalVisible, popoverVisible} = this.state;
        let {variable: currentEnvironmentVariable = [], name: currentEnvironmentName} = currentEnvironment;
        let {variable: globalVariable = []} = currentWorkspace;
        let enableEnvironmentVariable = currentEnvironmentVariable.filter(variable => !variable.disabled)
        let enableGlobalVariable = globalVariable.filter(variable => !variable.disabled)
        let {currentEnvironmentId} = this.props;
      
        let columns = [
            {
                title: "VARIABLE", 
                dataIndex: 'name',
            },
            {
                title: "INITIAL VALUE", 
                dataIndex: 'initialValue',
            },
            {
                title: "CURRENT VALUE", 
                dataIndex: 'currentValue',
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
                                columns={columns} 
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
                                columns={columns} 
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

                
            <EnvironmentModal 
                visible={environmentModalVisible} 
                ref={this.handleEnvironmentModalRef}
                onSave={this.props.onSave}
                onVisibleChange={this.handleEnvironmentModalVisible}
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
                onVisibleChange={this.handleVisibleChange}
            >
                <TooltipButton title="Environment quick look"
                    buttonProps={{type: 'default', icon: <EyeOutlined />}}
                />
            </Popover>
        )
    }
}

export default EnvironmentDetailCard;







