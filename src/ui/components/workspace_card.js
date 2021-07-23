import React from 'react';
import {Popover, Button, List, Tabs, Menu, Dropdown, Space} from 'antd';
import TooltipButton from 'ui/components/tooltip_button'
import { UserOutlined, AppstoreFilled , PlusOutlined, CaretDownFilled, } from '@ant-design/icons';

import {stopClickPropagation} from '@/utils/global_utils';
import RequiredInput from './required_input'
import WorkspaceModal from './workspace_modal'
import {ELLIPSIS_ICON, GOU_ICON} from '@/ui/constants/icons'
import 'ui/style/workspace_card.css'
const { TabPane } = Tabs;
class WorkspaceCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            workspaceList: [...new Array(5).keys()].map((item, index) => {
                return {
                    id: index, name: index + ""
                }
            }),
            workspaceId: 2
        }
    }

    componentDidMount() {
      
    }

    deleteWorkspace = (key) => {
        const {workspaceList} = this.state;
        this.setState({workspaceList: workspaceList.filter(item => item.id !== key)});
    }

    showEditModal = () => {
        this.setState({isModalVisible: true});
    }

    showRenameInput = (key) => {
        console.log(key)
        this.setState({editingId: key})
    }

    menus = [
        {label: "View Details", key: 'viewdetails', event: () => {}},
        {label: 'Rename', key: 'rename', event: this.showRenameInput},
        {label: 'Edit Workspace', key: 'editworkspace', event: this.showEditModal},
        {label: 'Delete', key: 'delete', event: this.deleteWorkspace}
    ]

    handleWorkspaceItemMenuClick = (key, id, domEvent) => {
        stopClickPropagation(domEvent)
        const operate = this.menus.find(menu => menu.key === key);
        operate.event(id)
    }

    handleSwitchWorkspace = (id) => {
    
        console.log(id+ "sdfsdf")
        this.setState({workspaceId: id})
    }

    render() {
     
        
        const {workspaceList, editingId, isModalVisible, workspaceId} = this.state;
        return (
            <>
            
            <Popover title={null} content={(
                <Tabs 
                    defaultActiveKey="1" 
                    className="workspace-card-tab"
                    onChange={this.callback} tabBarExtraContent={(
                    <Button type="link" onClick={this.showEditModal}>
                        Create New
                    </Button>
                )}>
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
                        actions={[
                            <Dropdown overlay={
                                <Menu onClick={({key, domEvent}) => this.handleWorkspaceItemMenuClick(key, item.id, domEvent)}>
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
                                <TooltipButton type="text" title="View more actions" icon={ELLIPSIS_ICON} onClick={stopClickPropagation} />
                              </Dropdown>
                        ]}
                    >
                        <Space>
                            <span style={{visibility: workspaceId === item.id ? 'visible' : 'hidden'}}>{GOU_ICON}</span>
                            <RequiredInput 
                                
                                size="small"
                                editing={editingId === item.id}
                                editIcon={null}
                                defaultValue={item.name}
                                onClick={stopClickPropagation} 
                            />
                        </Space>
                    </List.Item>
                    )}
                />
                </TabPane>
                <TabPane tab="Team" key="team" disabled >
                  Content of Tab Pane 2
                </TabPane>
               
              </Tabs>
            )}>
                <Button type="text" style={{color: 'white'}} icon={<AppstoreFilled />}>My Workspace <CaretDownFilled /></Button>
            </Popover>

            <WorkspaceModal isModalVisible={isModalVisible} />
            </>
        )
    }
}

export default WorkspaceCard;







