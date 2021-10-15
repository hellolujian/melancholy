import React from 'react';
import { 
    Typography , 
    Menu, 
    Space,Row, Col ,
    Divider , Input,Form,
    Button, Rate,Drawer,
    Dropdown, Tabs, Tooltip
} from 'antd';
import Icon from '@ant-design/icons';
import { CaretRightOutlined,  EllipsisOutlined,} from '@ant-design/icons';
import TooltipButton from 'ui/components/tooltip_button'
import RequiredInput from './required_input'
import PostmanButton from './postman_button'
import {stopClickPropagation, getTextSize} from '@/utils/global_utils';
import {publishCollectionModalOpen, publishRequestModalOpen} from '@/utils/event_utils'
import {
    SHARE_COLLECTION_ICON, MANAGE_ROLES_ICON, RENAME_ICON, EDIT_ICON, CREATE_FORK_ICON, 
    MERGE_CHANGES_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, 
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, ELLIPSIS_ICON
} from '@/ui/constants/icons'
// import {starCollection} from '@/database/database'
import 'ui/style/tree.css'

const { TabPane } = Tabs;
const { Paragraph, Text } = Typography;
class CollectionItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           showCollectionNameInput: false
           
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.item.name !== this.props.item.name) {
            this.setState({nameSize: getTextSize(nextProps.item.name)})
        }
    }

    componentDidMount() {
       this.setState({nameSize: getTextSize(this.props.item.name)})
    }

    // 处理详情抽屉的显示
    handleCollectionDrawerShow = (e) => {
        let {collectionDrawerVisible} = this.state;
        this.setState({collectionDrawerVisible: !collectionDrawerVisible})
        stopClickPropagation(e);
    }

    // 渲染collection输入框
    showCollectionNameInput = (show = true) => {
        this.setState({showCollectionNameInput: show})
    }

    // 保存collection名称
    saveCollectionName = async (value) => {
        await this.props.onRename(value)
        this.setState({showCollectionNameInput: false});
    }

    // 收藏处理
    handleRateChange = (value) => {
        this.props.onStar(value);
    }

    handleCollectionModalVisibleChange = (visible = true) => {
        this.setState({collectionModalVisible: visible})
    }

    deleteCollection = () => {
        this.props.onDelete()
    }

    duplicateCollection = () => {
        this.props.onDuplicate();
    }

    // 菜单配置
    menuItems = [
        { name: 'share_collection', label: 'Share Collection', icon: SHARE_COLLECTION_ICON,  },
        { name: 'manage_roles', label: 'Manage Roles', icon: MANAGE_ROLES_ICON, },
        { name: 'rename', label: 'Rename', icon: RENAME_ICON, event: this.showCollectionNameInput},
        { name: 'edit', label: 'Edit', icon: EDIT_ICON, event: () => publishCollectionModalOpen({collectionId: this.props.item.id})},
        { name: 'create_fork', label: 'Create a fork', icon: CREATE_FORK_ICON, },
        { name: 'merge_changes', label: 'Merge changes', icon: MERGE_CHANGES_ICON, },
        { name: 'add_request', label: 'Add Request', icon: ADD_REQUEST_ICON, event: () => publishRequestModalOpen({parentId: this.props.item.id})},
        { name: 'add_folder', label: 'Add Folder', icon: ADD_FOLDER_ICON, event: () => publishCollectionModalOpen({parentId: this.props.item.id})},
        { name: 'duplicate', label: 'Duplicate', icon: DUPLICATE_ICON, event: this.duplicateCollection },
        { name: 'export', label: 'Export', icon: EXPORT_ICON, },
        { name: 'monitor_collection', label: 'Monitor Collection', icon: MONITOR_COLLECTION_ICON, },
        { name: 'mock_collection', label: 'Mock Collection', icon: MOCK_COLLECTION, },
        { name: 'publish_docs', label: 'Publish Docs', icon: PUBLISH_DOCS_ICON, },
        { name: 'remove_from_workspace', label: 'Remove from workspace', icon: REMOVE_FROM_WORKSPACE_ICON, event: this.props.onRemove },
        { name: 'delete', label: 'Delete', icon: DELETE_ICON, event: this.deleteCollection },
    ]

    // 处理菜单点击
    handleMenuClick = ({domEvent , key}) => {
        let target = this.menuItems.find(menu => menu.name === key);
        if (target && target.event) {
           
            target.event();
        }
        stopClickPropagation(domEvent )
    }

    // 详情抽屉的变更
    handleDrawerVisibleClose = () => {
        this.setState({collectionDrawerVisible: false})
    }

    render() {

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {
                    this.menuItems.map(item => (
                        <Menu.Item 
                            key={item.name} 
                            icon={item.icon}>
                            {item.label}
                        </Menu.Item>
                    ))
                }
            </Menu>
        );
      
        const viewMoreActionButton = (
            <Dropdown overlay={menu} placement="bottomRight" trigger="click">
                <Tooltip title="View more actions">
                    <PostmanButton onClick={stopClickPropagation} icon={ELLIPSIS_ICON} />
                </Tooltip>
            </Dropdown>
        )

        const {showCollectionNameInput, collectionDrawerVisible, nameSize} = this.state;
        const {item, resizeWidth} = this.props;
        const {name, starred, requestCount} = item;
        let maxWidth = resizeWidth - 120;
        
        return (
            <>
                <Dropdown 
                    overlay={menu} 
                    trigger={['contextMenu']}>
                    <Row align="middle" gutter={[12]} style={{flexFlow: 'row nowrap'}}>
                        <Col flex="none" style={{display: 'flex'}}>{COLLECTION_FOLDER_ICON}</Col>
                        <Col flex="auto" style={{paddingLeft: 0}}>
                            {
                                showCollectionNameInput ? (
                                    <RequiredInput 
                                        defaultValue={name}
                                        onSave={this.saveCollectionName}
                                    />
                                    
                                ) : (
                                    <Space align="center">
                                        {
                                            nameSize > maxWidth ? (
                                                <Text 
                                                    ellipsis 
                                                    style={{display: 'inline-block', border: '1px solid rgb(0,0,0,0)', width: maxWidth}}>
                                                    {name}
                                                </Text>
                                            ) : (
                                                <span style={{display: 'inline-block', border: '1px solid rgb(0,0,0,0)'}} >
                                                    {name}
                                                </span>
                                            )
                                        }
                                        
                                        <div onClick={stopClickPropagation}>
                                            <Rate 
                                                style={{fontSize: 16}} 
                                                count={1} 
                                                value={starred}
                                                onChange={this.handleRateChange} 
                                                className={starred ? '' : 'collection-item-display'} 
                                            />
                                        </div>
                                    </Space>
                                )
                            }
                            <div>
                                <Text type="secondary">
                                    {requestCount ? requestCount : 0} requests
                                </Text>
                            </div>
                        </Col>
                        <Col flex="none">
                            <Space 
                                direction="vertical" 
                                size={0} 
                                style={{borderLeft: '1px solid rgba(0, 0, 0, 0.1)'}} 
                                className={collectionDrawerVisible ? "" : "collection-item-display"}>
                                <TooltipButton 
                                    tooltipProps={{title: "View more actions"}}
                                    buttonProps={{
                                        type: 'text', 
                                        icon: <CaretRightOutlined rotate={collectionDrawerVisible ? 180 : 0} />, 
                                        onClick: this.handleCollectionDrawerShow
                                    }}
                                />
                                <Divider className="collection-item-action-split" />
                                {viewMoreActionButton}
                            </Space>
                        </Col>
                    </Row>
                </Dropdown>
            </>
        )
    }
}

export default CollectionItem;
CollectionItem.defaultProps = {
    onDrawerVisibleChange: () => {},
    onDelete: () => {},
    onRemove: () => {},
    onDuplicate: () => {},
    onStar: () => {},
    onRename: () => {},
}






