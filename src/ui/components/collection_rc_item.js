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
import Ellipsis from 'react-ellipsis-component';
import PostmanButton from './postman_button'
import {stopClickPropagation} from '@/utils/global_utils';
import {publishCollectionModalOpen, publishRequestModalOpen, listenShortcut} from '@/utils/event_utils'
import {getByTheme, getEllipsisIcon, getCurrentTheme} from '@/utils/style_utils'
import {getCollectionTreeSelectedKey} from '@/utils/store_utils'
import {
    SHARE_COLLECTION_ICON, DARK_THEME_SHARE_COLLECTION_ICON, MANAGE_ROLES_ICON, DARK_THEME_MANAGE_ROLES_ICON, RENAME_ICON, DARK_THEME_RENAME_ICON, 
    EDIT_ICON, DARK_THEME_EDIT_ICON, CREATE_FORK_ICON, DARK_THEME_CREATE_FORK_ICON, 
    MERGE_CHANGES_ICON, DARK_THEME_MERGE_CHANGES_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, COLLECTION_STAR_HOVER_SVG,
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, DARK_THEME_COLLECTION_FOLDER_ICON, 
    ELLIPSIS_ICON, COLLECTION_STAR_FILL_SVG, COLLECTION_STAR_SVG, DARK_THEME_ADD_FOLDER_ICON, 
    DARK_THEME_ADD_REQUEST_ICON, DARK_THEME_DUPLICATE_ICON, DARK_THEME_EXPORT_ICON, DARK_THEME_MONITOR_COLLECTION_ICON, DARK_THEME_MOCK_COLLECTION,
    DARK_THEME_PUBLISH_DOCS_ICON, DARK_THEME_REMOVE_FROM_WORKSPACE_ICON, DARK_THEME_DELETE_ICON
} from '@/ui/constants/icons'
// import {starCollection} from '@/database/database'
// import 'ui/style/tree.css'

const { TabPane } = Tabs;
const { Paragraph, Text } = Typography;
class CollectionRCItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           showCollectionNameInput: false
           
        }
    }


    // 渲染collection输入框
    showCollectionNameInput = (show = true) => {
        this.setState({showCollectionNameInput: show})
    }


    handleRenameShortcut = () => {
        const currentSelectedKey = getCollectionTreeSelectedKey();
        if (currentSelectedKey === this.props.item.id) {
            this.showCollectionNameInput()
        }
    }

    componentDidMount() {
        listenShortcut('renameitem', this.handleRenameShortcut)
    }

    // 处理详情抽屉的显示
    handleCollectionDrawerShow = (e) => {
        let {collectionDrawerVisible} = this.state;
        this.setState({collectionDrawerVisible: !collectionDrawerVisible})
        stopClickPropagation(e);
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

    handleExport = () => {
        this.props.onExport();
        
    }

    // 菜单配置
    menuItems = [
        { name: 'share_collection', label: 'Share Collection', icon: () => getByTheme(SHARE_COLLECTION_ICON, DARK_THEME_SHARE_COLLECTION_ICON),  },
        { name: 'manage_roles', label: 'Manage Roles', icon: () => getByTheme(MANAGE_ROLES_ICON, DARK_THEME_MANAGE_ROLES_ICON), },
        { name: 'rename', label: 'Rename', shortcut: 'Ctrl+E', icon: () => getByTheme(RENAME_ICON, DARK_THEME_RENAME_ICON), event: this.showCollectionNameInput},
        { name: 'edit', label: 'Edit', icon: () => getByTheme(EDIT_ICON, DARK_THEME_EDIT_ICON), event: () => publishCollectionModalOpen({collectionId: this.props.item.id, scene: 'edit'})},
        { name: 'create_fork', label: 'Create a fork', icon: () => getByTheme(CREATE_FORK_ICON, DARK_THEME_CREATE_FORK_ICON), },
        { name: 'merge_changes', label: 'Merge changes', icon: () => getByTheme(MERGE_CHANGES_ICON, DARK_THEME_MERGE_CHANGES_ICON), },
        { name: 'add_request', label: 'Add Request', icon: () => getByTheme(ADD_REQUEST_ICON, DARK_THEME_ADD_REQUEST_ICON), event: () => publishRequestModalOpen({parentId: this.props.item.id})},
        { name: 'add_folder', label: 'Add Folder', icon: () => getByTheme(ADD_FOLDER_ICON, DARK_THEME_ADD_FOLDER_ICON), event: () => publishCollectionModalOpen({collectionId: this.props.item.id, scene: 'add'})},
        { name: 'duplicate', label: 'Duplicate', shortcut: 'Ctrl+D', icon: () => getByTheme(DUPLICATE_ICON, DARK_THEME_DUPLICATE_ICON), event: this.duplicateCollection },
        { name: 'export', label: 'Export', icon: () => getByTheme(EXPORT_ICON, DARK_THEME_EXPORT_ICON), event: this.handleExport},
        { name: 'monitor_collection', label: 'Monitor Collection', icon: () => getByTheme(MONITOR_COLLECTION_ICON, DARK_THEME_MONITOR_COLLECTION_ICON), },
        { name: 'mock_collection', label: 'Mock Collection', icon: () => getByTheme(MOCK_COLLECTION, DARK_THEME_MOCK_COLLECTION), },
        { name: 'publish_docs', label: 'Publish Docs', icon: () => getByTheme(PUBLISH_DOCS_ICON, DARK_THEME_PUBLISH_DOCS_ICON), },
        { name: 'remove_from_workspace', label: 'Remove from workspace', icon: () => getByTheme(REMOVE_FROM_WORKSPACE_ICON, DARK_THEME_REMOVE_FROM_WORKSPACE_ICON), event: this.props.onRemove },
        { name: 'delete', label: 'Delete', shortcut: 'Del', icon: () => getByTheme(DELETE_ICON, DARK_THEME_DELETE_ICON), event: this.deleteCollection },
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

    handleStarClick = (e, value) => {
        stopClickPropagation(e);
        this.handleRateChange(value);
    }

    render() {

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {
                    this.menuItems.map(item => (
                        <Menu.Item 
                            key={item.name} 
                            icon={item.icon()}>
                            <div className="justify-content-space-between">
                            {item.label} 
                            <Typography.Text type="secondary">{item.shortcut}</Typography.Text>
                            </div>
                        </Menu.Item>
                    ))
                }
            </Menu>
        );
      
        const viewMoreActionButton = (
            <Dropdown overlay={menu} placement="bottomRight" trigger="click">
                <Tooltip title="View more actions">
                    <PostmanButton onClick={stopClickPropagation} icon={getEllipsisIcon()} />
                </Tooltip>
            </Dropdown>
        )

        const {showCollectionNameInput, collectionDrawerVisible} = this.state;
        const {item} = this.props;
        const {name, starred, requestCount} = item;
        
        return (
            <>
                <Dropdown 
                    overlay={menu} 
                    trigger={['contextMenu']}>
                    <Row align="middle" style={{flexFlow: 'row nowrap'}} className="collection-row-class">
                        <Col flex="none" style={{display: 'flex', marginRight: 8}}>{getByTheme(COLLECTION_FOLDER_ICON, DARK_THEME_COLLECTION_FOLDER_ICON)}</Col>
                        <Col flex="auto" style={{paddingLeft: 0}}>
                            {
                                showCollectionNameInput ? (
                                    <RequiredInput 
                                        defaultValue={name}
                                        onSave={this.saveCollectionName}
                                    />
                                    
                                ) : (
                                    <Space align="center">
                                        <Ellipsis text={name} maxLine={1} />
                                        <div style={{marginRight: 10}} className={"vertical-center " + (starred ? '' : 'collection-item-display')} onClick={(e) => this.handleStarClick(e, !starred)}>
                                            {starred ? <Icon component={() => COLLECTION_STAR_FILL_SVG} /> : (
                                            <>
                                            <Icon className="collection-star-normal" component={() => COLLECTION_STAR_SVG} />
                                            <Icon className="collection-star-hover" component={() => COLLECTION_STAR_HOVER_SVG} />
                                            </>
                                            )}
                                        </div>
                                    </Space>
                                )
                            }
                            <div>
                                <Text type="secondary">
                                    {requestCount ? requestCount : 0} {requestCount === 1 ? 'request' : 'requests'}
                                </Text>
                            </div>
                        </Col>
                        <Col flex="none">
                            <Space 
                                direction="vertical" 
                                size={0} 
                                style={{borderLeft: '1px solid var(--common-border-color, rgba(0, 0, 0, 0.1))'}} 
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

export default CollectionRCItem;
CollectionRCItem.defaultProps = {
    onDrawerVisibleChange: () => {},
    onDelete: () => {},
    onRemove: () => {},
    onDuplicate: () => {},
    onStar: () => {},
    onRename: () => {},
}






