import React from 'react';
import { Layout, 
    Menu, 
    Space,
    Tabs,
    Button, 
    Dropdown,
    Tooltip,
    Card,
    Typography,
    Row,
    Col,
    Checkbox
} from 'antd';
import { 
    UserOutlined, CaretDownFilled, PlusSquareFilled,SyncOutlined,
    ReadOutlined, ToolFilled ,NotificationFilled , EnvironmentFilled ,
    FolderViewOutlined ,DatabaseOutlined  , PullRequestOutlined  
} from '@ant-design/icons';

import Icon from '@ant-design/icons'

import {SQUARE_PLUS_ICON, ADD_REQUEST_ICON, ADD_REQUEST_ICON_48, COLLECTION_ICON, COLLECTION_ICON_48, ENVIRONMENT_ICON, ENVIRONMENT_ICON_48,
    MOCK_COLLECTION, MOCK_COLLECTION_48, MONITOR_COLLECTION_ICON, MONITOR_COLLECTION_ICON_48, DOCUMENTATION_ICON, DOCUMENTATION_ICON_48, CLOSE_SVG,CLOSE_ICON
} from 'ui/constants/icons';
import {POSTMAN_DOCS_TIPS} from 'ui/constants/tips'
import {OPEN_NEW_TAB_EVENT} from '@/ui/constants/events'
import ImportModal from './import_modal'
import TooltipButton from './tooltip_button'
import DropdownTooltip from './dropdown_tooltip'
import ButtonModal from './button_modal'

import CollectionModal from './collection_modal'
import RequestModal from './request_modal'
import WorkspaceCard from './workspace_card'
import EnvironmentModal from './environment_modal'
import DocumentationModal from './documentation_modal'

import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
import Pubsub from 'pubsub-js'
import {publishCollectionModalOpen, publishRequestModalOpen} from '@/utils/event_utils'
import 'ui/style/new_button_modal.css'
const { Header,} = Layout;
const { TabPane } = Tabs;
const { Meta } = Card;
class NewButtonModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newModalVisible: false,
            requestModalVisible: false,
            collectionModalVisible: false,
            environmentModalVisible: false,
            documentationModalVisible: false
        }
    }

    componentDidMount() {
      
    }

    // 处理新增tab事件
    handleOpenNewBtnClick = ({key}) => {
        if (key === 'tab') {
            Pubsub.publish(OPEN_NEW_TAB_EVENT)
        }
    }

    // 处理rce弹框显示或隐藏
    handleRCEModalVisibleChange = (key, visible, parentModalVisible) => {
        switch (key) {
            case 'request':
                publishRequestModalOpen()
                break;
            case 'collection':
                publishCollectionModalOpen();
                break;
            case 'environment':
                this.setState({environmentModalVisible: visible, newModalVisible: false});
                break;
            case 'documentation': 
                this.setState({documentationModalVisible: visible, newModalVisible: parentModalVisible ? true : false})
                break;
            default: break
        }
    }

    // 处理下拉按钮菜单点击时间
    handleNewMenuClick = ({key}) => {
        this.handleRCEModalVisibleChange(key, true)
        
    }

    // 处理新增按钮大弹框事件
    handleNewModalVisibleChange = (visible) => {
        let obj = {
            newModalVisible: visible,
        }
        this.setState(obj)
    }

    // 处理新增按钮大弹框消失
    handleNewModalCancel = () => {
        this.handleNewModalVisibleChange(false)
    }

    operations = [
        {
            title: 'BUILDING BLOCKS',
            items: [
                {
                    key: 'request',
                    icon: ADD_REQUEST_ICON_48,
                    smallIcon: ADD_REQUEST_ICON,
                    label: 'Request',
                    desc: 'Create a basic request'
                },
                {
                    key: 'collection',
                    icon: COLLECTION_ICON_48,
                    smallIcon: COLLECTION_ICON,
                    label: 'Collection',
                    desc: 'Save your requests in a collection for reuse and sharing'
                },
                {
                    key: 'environment',
                    icon: ENVIRONMENT_ICON_48,
                    smallIcon: ENVIRONMENT_ICON,
                    label: 'Environment',
                    desc: 'Save values you frequently use in an environment'
                },  
            ]
        },
        {
            title: 'ADVANCED',
            items: [
                {
                    key: 'documentation',
                    icon: DOCUMENTATION_ICON_48,
                    smallIcon: DOCUMENTATION_ICON,
                    label: 'Documentation',
                    desc: 'Create and publish beautiful documentation for your APIs'
                },
                {
                    key: 'mockserver',
                    icon: MOCK_COLLECTION_48,
                    smallIcon: MOCK_COLLECTION,
                    label: 'Mock Server',
                    desc: 'Create a mock server for your in-development APIs'
                },
                {
                    key: 'monitor',
                    icon: MONITOR_COLLECTION_ICON_48,
                    smallIcon: MONITOR_COLLECTION_ICON,
                    label: 'Monitor',
                    desc: 'Schedule automated tests and check performance of your APIs'
                },  
            ]
        }
    ]

    render() {

        const {environmentModalVisible, collectionModalVisible, requestModalVisible, documentationModalVisible, workspaceList, newModalVisible} = this.state;
        let modalContent = (
            <Tabs 
                defaultActiveKey="createnew" 
                onChange={this.callback} 
                className="new-modal-tabs common-tabs-class" 
                tabBarExtraContent={(
                    <Button onClick={this.handleNewModalCancel} type="text">
                        <Icon component={() => CLOSE_SVG} />
                    </Button>
                )}>
                <TabPane tab="Create New" key="createnew">
                    <Space size="large" direction="vertical" className="full-width">
                        {
                            this.operations.map((operation, index) => (
                                <div key={index}>
                                    <Typography.Title level={5}>
                                        {operation.title}
                                    </Typography.Title>
                                    <Row gutter={[16, 16]}>
                                        {
                                            operation.items.map(item => (
                                                <Col 
                                                    span={8} 
                                                    key={item.key} 
                                                    onClick={() => this.handleNewMenuClick({key: item.key})}>
                                                    <Card 
                                                        bordered={false} 
                                                        hoverable >
                                                        <Meta
                                                            avatar={item.icon}
                                                            title={item.label}
                                                            description={item.desc}
                                                        />
                                                    </Card>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                </div>
                            )) 
                        }
                        <Typography.Paragraph type="secondary">
                            Not sure where to start? Use a <Typography.Link>template</Typography.Link> to see how Melancholy can help you in your work.
                        </Typography.Paragraph>
                    </Space>
                    
                    
                </TabPane>
                <TabPane tab="Templates" key="templates">
                Content of Tab Pane 2
                </TabPane>
                <TabPane tab="API Network" key="apinetwork">
                Content of Tab Pane 3
                </TabPane>
            </Tabs>
        )
        
        return (

            <>
                <Dropdown.Button 
                    overlay={
                        <Menu mode="horizontal" onClick={this.handleNewMenuClick}>
                            {
                                this.operations.map((operation, index) => (
                                    <Menu.ItemGroup title={operation.title} key={index}>
                                        {
                                            operation.items.map(item => (
                                                <Menu.Item key={item.key} icon={item.smallIcon}>{item.label}</Menu.Item>
                                            ))
                                        }
                                    </Menu.ItemGroup>
                                ))
                            }
                        </Menu>
                    }
                    buttonsRender={([leftButton, rightButton]) => {
                        return [
                            <ButtonModal 
                                key="leftButton"
                                modalVisible={newModalVisible}
                                label="New"
                                title={CREATE_NEW}
                                icon={SQUARE_PLUS_ICON}
                                modalContent={modalContent}
                                modalProps={{
                                    destroyOnClose: true,
                                    className: 'new-button-modal-class',
                                    closable: false,
                                    title: null,
                                    bodyStyle: {
                                        padding: 0,
                                        height: 600
                                    },
                                    footer: (
                                        <div className="justify-content-space-between">
                                            <Checkbox onChange={this.onChange}>
                                                Show this window on launch
                                            </Checkbox>
                                            {POSTMAN_DOCS_TIPS}
                                        </div>
                                    )
                                }}
                                onVisibleChange={this.handleNewModalVisibleChange}
                            />,
                            <Button type="primary" icon={<CaretDownFilled />} />
                        ]
                    }}
                />

                <RequestModal />
                <CollectionModal />
                <EnvironmentModal visible={environmentModalVisible} onVisibleChange={(visible) => this.handleRCEModalVisibleChange('environment', visible)} />
                {
                    documentationModalVisible && (
                        <DocumentationModal visible={documentationModalVisible} onVisibleChange={(visible, parentModalVisible) => this.handleRCEModalVisibleChange('documentation', visible, parentModalVisible)}/>
                    )
                }
            </>
        )
    }
}

export default NewButtonModal;







