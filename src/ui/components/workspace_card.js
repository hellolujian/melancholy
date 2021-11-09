import React from 'react';
import {Popover, Button, List, Tabs, Menu, Dropdown, Space, Row, Col, Divider, Typography} from 'antd';
import TooltipButton from 'ui/components/tooltip_button'
import { UserOutlined, AppstoreFilled , PlusOutlined, CaretDownFilled, } from '@ant-design/icons';

import {stopClickPropagation} from '@/utils/global_utils';
import RequiredInput from './required_input'
import RenameInput from './rename_input'
import WorkspaceModal from './workspace_modal'
import Ellipsis from 'react-ellipsis-component';
import {ELLIPSIS_ICON, GOU_ICON} from '@/ui/constants/icons'
import {queryWorkspaceMeta, updateWorkspaceMeta} from '@/database/workspace_meta'
import 'ui/style/workspace_card.css'
const { TabPane } = Tabs;
class WorkspaceCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            workspaceList: [],
            workspaceId: 2
        }
    }

    refreshData = async (extend = {}) => {
        let workspaceList = await queryWorkspaceMeta();
        this.setState({workspaceList: workspaceList, ...extend});
    }

    componentDidMount() {

        this.refreshData()
      
    }

    deleteWorkspace = async (target) => {
        const {id} = target;
        await updateWorkspaceMeta(id, {$set: {deleted: true }})
        this.refreshData()
    }

    handleCreateBtnClick = (workspaceInfo = {}) => {
        this.setState({modalVisible: true, workspaceInfo: workspaceInfo});
    }

    showRenameInput = (item) => {
        const {id} = item;
        this.setState({editingId: id})
    }

    menus = [
        {label: "View Details", key: 'viewdetails', event: () => {}},
        {label: 'Rename', key: 'rename', event: this.showRenameInput},
        {label: 'Edit Workspace', key: 'editworkspace', event: (item) => this.handleCreateBtnClick(item)},
        {label: 'Delete', key: 'delete', event: this.deleteWorkspace}
    ]

    handleWorkspaceItemMenuClick = (key, item, domEvent) => {
        stopClickPropagation(domEvent)
        const operate = this.menus.find(menu => menu.key === key);
        operate.event(item)
    }

    handleSwitchWorkspace = (id) => {
    
        console.log(id+ "sdfsdf")
        this.setState({workspaceId: id})
    }

    handleModalVisibleChange = (visible) => {
        this.setState({modalVisible: visible})
    }

    saveWorkspaceName = async (value, item) => {
        await updateWorkspaceMeta(item.id, {$set: {name: value}});
        this.refreshData({editingId: null});
    }

    render() {
     
        
        const {workspaceList, editingId, modalVisible, workspaceId, workspaceInfo} = this.state;
        return (
            <>
            
            <Popover 
                title={null} 
                trigger="click"
                content={(
                    <Tabs 
                        defaultActiveKey="1" 
                        className="workspace-card-tab"
                        onChange={this.callback} 
                        tabBarExtraContent={(
                            <Space split={<Divider type="vertical" />} size={0} style={{marginLeft: 0}}>
                                <Typography.Link onClick={this.handleCreateBtnClick}>
                                    Create New
                                </Typography.Link>
                                <Typography.Link>All workspaces</Typography.Link>
                            </Space>
                            
                        )}
                    >
                        <TabPane tab="Personal" key="personal">
                            <List
                                className="workspace-card-list"
                                itemLayout="horizontal"
                                dataSource={workspaceList}
                                renderItem={item => (
                                    <List.Item
                                        className="workspace-card-list-item"
                                        key={item.id}
                                        onClick={() => this.handleSwitchWorkspace(item.id)}
                                    >

                                        <Row align="middle" gutter={[6]} style={{flexFlow: 'row nowrap'}} className="full-width">
                                
                                            <Col flex="none" className={workspaceId === item.id ? "visibility-visible" : "visibility-hidden"}>
                                                {GOU_ICON}
                                            </Col>
                                            <Col flex="auto">
                                                {
                                                    editingId === item.id ? (
                                                        <RequiredInput 
                                                            defaultValue={item.name}
                                                            onSave={(value) => this.saveWorkspaceName(value, item)}
                                                        />
                                                    ) : (
                                                        <Space align="center" style={{border: '1px solid rgba(255,255,255, 0)'}}>
                                                            <Ellipsis text={item.name} maxLine={1}  />
                                                            
                                                        </Space>
                                                    )
                                                }
                                            </Col>
                                            <Col flex="none">
                                                <Dropdown overlay={
                                                    <Menu onClick={({key, domEvent}) => this.handleWorkspaceItemMenuClick(key, item, domEvent)}>
                                                        {
                                                            this.menus.map(menu => (
                                                                <Menu.Item key={menu.key}>
                                                                    {menu.label}
                                                                </Menu.Item>
                                                            ))
                                                        }
                                                    
                                                    </Menu>
                                                } 
                                                
                                                    trigger="click">
                                                    <TooltipButton 
                                                        type="text" 
                                                        title="View more actions" 
                                                        icon={ELLIPSIS_ICON} 
                                                        buttonProps={{className: "workspace-item-more-action-display", size: 'small'}}
                                                        onClick={stopClickPropagation} 
                                                    />
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    
                                    </List.Item>
                                )
                            }
                            />
                        </TabPane>
                        <TabPane tab="Team" key="team" disabled >
                        Content of Tab Pane 2
                        </TabPane>
                    
                    </Tabs>
                )}
            >
                <Button type="text" style={{color: 'white'}} icon={<AppstoreFilled />}>My Workspace <CaretDownFilled /></Button>
            </Popover>

            {
                modalVisible && (
                    <WorkspaceModal 
                        visible={modalVisible} 
                        initialValues={workspaceInfo}
                        onSave={this.refreshData}
                        onVisibleChange={this.handleModalVisibleChange} 
                    />
                )
            }
            </>
        )
    }
}

export default WorkspaceCard;







