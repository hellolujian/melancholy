import React from 'react';
import { Layout, 
    Menu, 
    Space,
    Tabs,
    Button, 
    Dropdown,
    Tooltip
} from 'antd';
import { 
    UserOutlined, CaretDownFilled, PlusSquareFilled,SyncOutlined,
    ReadOutlined, ToolFilled ,NotificationFilled , EnvironmentFilled ,
    FolderViewOutlined ,DatabaseOutlined  , PullRequestOutlined  
} from '@ant-design/icons';

import {SQUARE_PLUS_ICON, ADD_REQUEST_ICON, COLLECTION_ICON, ENVIRONMENT_ICON,
    MOCK_COLLECTION, MONITOR_COLLECTION_ICON, DOCUMENTATION_ICON, OPEN_NEW_ICON
} from 'ui/constants/icons';
import {
    publishNewTabOpen
} from '@/utils/event_utils'
  
import ImportModal from './import_modal'
import TooltipButton from './tooltip_button'
import DropdownTooltip from './dropdown_tooltip'
import NewButtonModal from './new_button_modal'

import SettingsModal from './settings_modal'
import WorkspaceCard from './workspace_card'

import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
const { Header,} = Layout;

class LayoutHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleNewMenuClick = ({key}) => {
        this.setState({visibleModal: key})
    }

    handleOpenNewBtnClick = ({key}) => {
        if (key === 'tab') {
            publishNewTabOpen()
        }
    }

    render() {
     
        const {visibleModal, workspaceList} = this.state;
        return (
            <div class="header">
                <Space>
                    <NewButtonModal />
                    <ImportModal />
                    <TooltipButton title={RUNNER_TITLE} label="Runner" />
                 
                    <DropdownTooltip 
                        trigger="click"
                        overlay={
                            <Menu mode="horizontal" onClick={this.handleOpenNewBtnClick}>
                                <Menu.ItemGroup title="OPEN NEW">
                                    <Menu.Item key="tab">Tab</Menu.Item>
                                    <Menu.Item key="melancholywindow">Melancholy Window</Menu.Item>
                                    <Menu.Item key="runnerwindow">Runner Window</Menu.Item>
                                </Menu.ItemGroup>
                            </Menu>
                        }
                        title="Open New"
                        type="primary" 
                        onClick={this.handleOpenNewBtnClick} 
                        buttonProps={{className: "open-new-button"}} 
                        label={<>{OPEN_NEW_ICON} <CaretDownFilled /></>}
                    />
                </Space>
                <Space>
                    <WorkspaceCard />
                </Space>
                <Space>
                    <TooltipButton shape="circle" title={SYNC_DATA_TITLE} icon={<SyncOutlined />} />
                    <SettingsModal />
                    <TooltipButton shape="circle" title={NOTIFICATIONS_TITLE} icon={<NotificationFilled  />} />
                    <TooltipButton shape="circle" icon={<UserOutlined />} title={ACCOUNT_TITLE} />
                    <Button type="primary">Upgrade</Button>
                </Space>
            </div>

        )
    }
}

export default LayoutHeader;







