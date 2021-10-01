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
import { CaretRightOutlined,  EllipsisOutlined, FolderFilled} from '@ant-design/icons';
import TooltipButton from 'ui/components/tooltip_button'
import RequiredInput from './required_input'
import PostmanButton from './postman_button'
import {stopClickPropagation} from '@/utils/global_utils';
import {publishCollectionModalOpen, publishRequestModalOpen} from '@/utils/event_utils'
import {
    SHARE_COLLECTION_ICON, ELLIPSIS_ICON, RENAME_ICON, EDIT_ICON, CREATE_FORK_ICON, 
    MERGE_CHANGES_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, 
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, 
} from '@/ui/constants/icons'
// import {starCollection} from '@/database/database'
import 'ui/style/tree.css'

const { TabPane } = Tabs;
const { Paragraph, Text } = Typography;
class RequestItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           showCollectionNameInput: false,
           item: props.item,
           
        }
    }

    componentDidMount() {
    }

    // 渲染collection输入框
    showCollectionNameInput = (show = true) => {
        this.setState({showCollectionNameInput: show})
    }

    // 保存collection名称
    saveFolderName = async (value) => {
        await this.props.onRename(value)
        this.setState({showCollectionNameInput: false});
    }

    deleteCollection = () => {
        this.props.onDelete()
    }

    duplicateCollection = () => {
        this.props.onDuplicate();
    }

    // 菜单配置
    menuItems = [
        { name: 'rename', label: 'Rename', icon: RENAME_ICON, event: this.showCollectionNameInput},
        { name: 'edit', label: 'Edit', icon: EDIT_ICON, event: () => publishCollectionModalOpen({collectionId: this.state.item.id})},
        { name: 'add_request', label: 'Add Request', icon: ADD_REQUEST_ICON, event: () => publishRequestModalOpen({parentId: this.state.item.id})},
        { name: 'add_folder', label: 'Add Folder', icon: ADD_FOLDER_ICON, event: () => publishCollectionModalOpen({parentId: this.state.item.id})},
        { name: 'duplicate', label: 'Duplicate', icon: DUPLICATE_ICON, event: this.duplicateCollection },
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
        const {showCollectionNameInput} = this.state;
        const {item} = this.props;
      
        const viewMoreActionButton = (
            <Dropdown overlay={(
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
            )} placement="bottomRight" trigger="click">
                <Tooltip title="View more actions">
                    <PostmanButton className="folder-item-display" onClick={stopClickPropagation} icon={ELLIPSIS_ICON} />
                </Tooltip>
            </Dropdown>
        )
        
        return (
            <>
                <Dropdown 
                    overlay={menu} 
                    trigger={['contextMenu']}>
                    <Row align="middle" gutter={[12]}>
                        <Col flex="none" style={{display: 'flex'}}><FolderFilled /></Col>
                        <Col flex="auto" style={{paddingLeft: 0}}>
                            <Space className="full-width justify-content-space-between">
                                <div>
                                    {
                                        showCollectionNameInput ? (
                                            <RequiredInput 
                                                onSave={this.saveFolderName}
                                                size="small"
                                                editing={true}
                                                editIcon={null}
                                                defaultValue={item.name}
                                                onClick={stopClickPropagation} 
                                            />
                                        ) : (
                                            <Space align="center">
                                                <span style={{display: 'inline-block', border: '1px solid rgb(0,0,0,0)'}}>{item.name}</span>
                                            </Space>
                                        )
                                    }
                                </div>
                                {viewMoreActionButton}
                            </Space>
                        </Col>
                    </Row>
                </Dropdown>

            </>
            
        )
    }
}

export default RequestItem;
RequestItem.defaultProps = {
    onDrawerVisibleChange: () => {},
    onDelete: () => {},
    onRemove: () => {},
    onDuplicate: () => {},
    onStar: () => {},
    onRename: () => {},
}






