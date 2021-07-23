import React from 'react';
import { Layout, 
    Menu, 
    Space,Popover, Col ,
    Tabs, Input,List,
    Button, Rate,Drawer,
    Dropdown } from 'antd';
import { UserOutlined, AppstoreFilled , PlusOutlined, CaretDownFilled, PlusSquareFilled,SyncOutlined,
  ReadOutlined, ToolFilled ,EllipsisOutlined,
                    SettingFilled,NotificationFilled , EnvironmentFilled ,FolderViewOutlined ,DatabaseOutlined  , PullRequestOutlined  } from '@ant-design/icons';

import TooltipButton from './tooltip_button'


import CollectionModal from './collection_modal'
import RequestModal from './request_modal'
import WorkspaceModal from './workspace_modal'
import WorkspaceCard from './workspace_card'
import EnvironmentModal from './environment_modal'

import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
const { Header, Content, Sider } = Layout;
const { TabPane } = Tabs;

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

    render() {
     
        const {visibleModal, workspaceList} = this.state;
        return (
            <Header className="header">
                <Space>
                    <Dropdown.Button 
                        overlay={
                            <Menu mode="horizontal" onClick={this.handleNewMenuClick}>
                                <Menu.ItemGroup title="BUILDING BLOCKS">
                                    <Menu.Item key="request" icon={<PullRequestOutlined />}>Request</Menu.Item>
                                    <Menu.Item key="collection" icon={<EnvironmentFilled />}>Collection</Menu.Item>
                                    <Menu.Item key="environment" icon={<EnvironmentFilled />}>Environment</Menu.Item>
                                </Menu.ItemGroup>
                                <Menu.ItemGroup title="ADVANCED">
                                    <Menu.Item key="documentation" icon={<ReadOutlined /> }>Documentation</Menu.Item>
                                    <Menu.Item key="mockServer" icon={<DatabaseOutlined />}>Mock Server</Menu.Item>
                                    <Menu.Item key="monitor" icon={<FolderViewOutlined />}>Monitor</Menu.Item>
                                </Menu.ItemGroup>
                            </Menu>
                        }
                        buttonsRender={([leftButton, rightButton]) => {
                            return [
                                <TooltipButton title={CREATE_NEW} key="leftButton" icon={<PlusSquareFilled />} label="New" />,
                                <Button type="primary" icon={<CaretDownFilled />} />
                            ]
                        }}
                    />
                    <TooltipButton title={IMPORT_TITLE} label="Import" />
                    <TooltipButton title={RUNNER_TITLE} label="Runner" />
                </Space>
                <Space>
                    <WorkspaceCard />
                </Space>
                <Space>
                    <TooltipButton shape="circle" title={SYNC_DATA_TITLE} icon={<SyncOutlined />} />
                    <TooltipButton shape="circle" title={SETTINGS_TITLE} icon={<ToolFilled  />} />
                    <TooltipButton shape="circle" title={NOTIFICATIONS_TITLE} icon={<NotificationFilled  />} />
                    <TooltipButton shape="circle" icon={<UserOutlined />} title={ACCOUNT_TITLE} />
                    <Button type="primary">Upgrade</Button>
                </Space>

                <RequestModal visible={visibleModal === 'request'} />
                <CollectionModal visible={visibleModal === 'collection'} />
                <EnvironmentModal visible={visibleModal === 'environment'} />
            </Header>

        )
    }
}

export default LayoutHeader;







