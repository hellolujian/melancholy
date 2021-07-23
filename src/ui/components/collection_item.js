import React from 'react';
import { 
    Typography , 
    Menu, 
    Space,Row, Col ,
    Divider , Input,Form,
    Button, Rate,Drawer,
    Dropdown 
} from 'antd';
import Icon from '@ant-design/icons';
import { 
    ShareAltOutlined , CaretRightOutlined, BranchesOutlined , PullRequestOutlined , 
    FolderAddOutlined ,CloseOutlined, LockFilled , EditFilled, EllipsisOutlined,
    DownloadOutlined ,FolderFilled , FontColorsOutlined ,DeleteFilled ,
    InsertRowLeftOutlined, MonitorOutlined ,CopyOutlined ,PicCenterOutlined    } from '@ant-design/icons';
import TooltipButton from 'ui/components/tooltip_button'
import RequiredInput from './required_input'
import {stopClickPropagation} from '@/utils/global_utils';
import {
    SHARE_COLLECTION_ICON, MANAGE_ROLES_ICON, RENAME_ICON, EDIT_ICON, CREATE_FORK_ICON, 
    MERGE_CHANGES_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, 
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, 
} from '@/ui/constants/icons'
import 'ui/style/tree.css'

const { Paragraph, Text } = Typography;
class CollectionItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           showCollectionNameInput: false,
           item: props.item,
           
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({item: nextProps.item})
    }

    componentDidMount() {
    }

    // 处理详情抽屉的显示
    handleCollectionDrawerShow = (e) => {
        let {collectionDrawerVisible} = this.props;
        this.props.onDrawerVisibleChange(collectionDrawerVisible ? null : this.state.item.id)
        stopClickPropagation(e);
    }

    // 渲染collection输入框
    showCollectionNameInput = (show = true) => {
        this.setState({showCollectionNameInput: show})
    }

    // 保存collection名称
    saveCollectionName = (e) => {
        let value = e.target.value;
        let object = {
            showCollectionNameInput: false
        }
        if (value && value.trim()) {
            const {item} = this.state;
            item.name = value;
            object.item = item;

            // TODO: 保存至数据库
        }
        this.setState(object)
    }

    // 收藏处理
    handleRateChange = (value) => {
        const {item} = this.state;
        item.starred = value;
        this.setState({item})

        // TODO: 保存至数据库
    }

    // 菜单配置
    menuItems = [
        { name: 'share_collection', label: 'Share Collection', icon: SHARE_COLLECTION_ICON,  },
        { name: 'manage_roles', label: 'Manage Roles', icon: MANAGE_ROLES_ICON, },
        { name: 'rename', label: 'Rename', icon: RENAME_ICON, event: this.showCollectionNameInput},
        { name: 'edit', label: 'Edit', icon: EDIT_ICON, },
        { name: 'create_fork', label: 'Create a fork', icon: CREATE_FORK_ICON, },
        { name: 'merge_changes', label: 'Merge changes', icon: MERGE_CHANGES_ICON, },
        { name: 'add_request', label: 'Add Request', icon: ADD_REQUEST_ICON, },
        { name: 'add_folder', label: 'Add Folder', icon: ADD_FOLDER_ICON, },
        { name: 'duplicate', label: 'Duplicate', icon: DUPLICATE_ICON, },
        { name: 'export', label: 'Export', icon: EXPORT_ICON, },
        { name: 'monitor_collection', label: 'Monitor Collection', icon: MONITOR_COLLECTION_ICON, },
        { name: 'mock_collection', label: 'Mock Collection', icon: MOCK_COLLECTION, },
        { name: 'publish_docs', label: 'Publish Docs', icon: PUBLISH_DOCS_ICON, },
        { name: 'remove_from_workspace', label: 'Remove from workspace', icon: REMOVE_FROM_WORKSPACE_ICON, },
        { name: 'delete', label: 'Delete', icon: DELETE_ICON, },
    ]

    // 处理菜单点击
    handleMenuClick = ({domEvent , key}) => {
        let target = this.menuItems.find(menu => menu.name === key);
        if (target && target.event) {
            target.event();
        }
        stopClickPropagation(domEvent )
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
        const {showCollectionNameInput, item} = this.state;
        const {collectionDrawerVisible} = this.props;
      
        return (
            <Dropdown 
                overlay={menu} 
                trigger={['contextMenu']}>
                <Row align="middle" gutter={[12]}>
                    <Col flex="none" style={{display: 'flex'}}>{COLLECTION_FOLDER_ICON}</Col>
                    <Col flex="auto" style={{paddingLeft: 0}}>
                        <Space style={{display: 'flex', flexdirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            <div>
                                {
                                    showCollectionNameInput ? (
                                        <RequiredInput 
                                            onBlur={this.saveCollectionName}
                                            onPressEnter={this.saveCollectionName}
                                            size="small"
                                            editing={true}
                                            editIcon={null}
                                            defaultValue={item.name}
                                            onClick={stopClickPropagation} 
                                        />
                                        
                                    ) : (
                                        <Space align="center">
                                            <span style={{display: 'inline-block', border: '1px solid rgb(0,0,0,0)'}}>{item.name}</span>
                                            <span onClick={stopClickPropagation}>
                                                <Rate 
                                                    style={{fontSize: 16}} 
                                                    count={1} 
                                                    value={item.starred}
                                                    onChange={this.handleRateChange} 
                                                    className={item.starred ? '' : 'collection-item-display'} 
                                                />
                                            </span>
                                        </Space>
                                    )
                                }
                                <div>{item.count} requests</div>
                            </div>
                            <Space direction="vertical" size={0} style={{borderLeft: '1px solid rgba(0, 0, 0, 0.1)'}} className={collectionDrawerVisible ? "" : "collection-item-display"}>
                                <TooltipButton 
                                    title="View more actions" 
                                    type="text" 
                                    icon={<CaretRightOutlined rotate={collectionDrawerVisible ? 180 : 0} />} 
                                    onClick={this.handleCollectionDrawerShow} 
                                />
                                <Divider style={{margin: 0}} />
                                <Dropdown overlay={menu} placement="bottomRight">
                                    <TooltipButton title="View more actions" type="text" icon={<EllipsisOutlined />} onClick={stopClickPropagation} />
                                </Dropdown>
                            </Space>
                        </Space>
                    </Col>
                </Row>
            </Dropdown>
        )
    }
}

export default CollectionItem;
CollectionItem.defaultProps = {
    onDrawerVisibleChange: () => {}
}






