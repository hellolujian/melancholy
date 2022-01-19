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
import Ellipsis from 'react-ellipsis-component';
import {stopClickPropagation} from '@/utils/global_utils';
import {getEllipsisIcon, getByTheme} from '@/utils/style_utils';
import {publishCollectionModalOpen, publishRequestModalOpen} from '@/utils/event_utils'
import {
    DARK_THEME_DELETE_ICON, DARK_THEME_DUPLICATE_ICON, RENAME_ICON, EDIT_ICON, DARK_THEME_ADD_FOLDER_ICON, 
    DARK_THEME_ADD_REQUEST_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,
    EXPORT_ICON, DARK_THEME_EDIT_ICON, DARK_THEME_RENAME_ICON, PUBLISH_DOCS_ICON, 
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, 
} from '@/ui/constants/icons'
// import {starCollection} from '@/database/database'
import 'ui/style/tree.css'

const { TabPane } = Tabs;
const { Paragraph, Text } = Typography;
class FolderRCItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           showCollectionNameInput: false,
           
        }
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
        { name: 'rename', label: 'Rename', icon: () => getByTheme(RENAME_ICON, DARK_THEME_RENAME_ICON), event: this.showCollectionNameInput},
        { name: 'edit', label: 'Edit', icon: () => getByTheme(EDIT_ICON, DARK_THEME_EDIT_ICON), event: () => publishCollectionModalOpen({collectionId: this.props.item.id, scene: 'edit'})},
        { name: 'add_request', label: 'Add Request', icon: () => getByTheme(ADD_REQUEST_ICON, DARK_THEME_ADD_REQUEST_ICON), event: () => publishRequestModalOpen({parentId: this.props.item.id})},
        { name: 'add_folder', label: 'Add Folder', icon: () => getByTheme(ADD_FOLDER_ICON, DARK_THEME_ADD_FOLDER_ICON), event: () => publishCollectionModalOpen({collectionId: this.props.item.id, scene: 'add'})},
        { name: 'duplicate', label: 'Duplicate', icon: () => getByTheme(DUPLICATE_ICON, DARK_THEME_DUPLICATE_ICON), event: this.duplicateCollection },
        { name: 'delete', label: 'Delete', icon: () => getByTheme(DELETE_ICON, DARK_THEME_DELETE_ICON), event: this.deleteCollection },
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
                            icon={item.icon()}>
                            {item.label}
                        </Menu.Item>
                    ))
                }
            </Menu>
        );
      
        const viewMoreActionButton = (
            <Dropdown overlay={menu} placement="bottomRight" trigger="click">
                <Tooltip title="View more actions">
                    <PostmanButton className="folder-item-display" onClick={stopClickPropagation} icon={getEllipsisIcon()} />
                </Tooltip>
            </Dropdown>
        );

        const {showCollectionNameInput} = this.state;
        const {item} = this.props;
        const {name} = item;
        
        return (
            <>
                <Dropdown 
                    overlay={menu} 
                    trigger={['contextMenu']}>
                    <Row align="middle" style={{flexFlow: 'row nowrap'}} className="folder-row-class">
                        <Col flex="none" style={{display: 'flex', paddingRight: 8}}><FolderFilled /></Col>
                        <Col flex="auto" style={{paddingLeft: 0}}>
                            {
                                showCollectionNameInput ? (
                                    <RequiredInput 
                                        defaultValue={name}
                                        onSave={this.saveFolderName}
                                    />
                                ) : (
                                    <Ellipsis text={name} />
                                )
                            }
                        </Col>
                        <Col flex="none">
                            {viewMoreActionButton}
                        </Col>
                    </Row>
                </Dropdown>

            </>
            
        )
    }
}

export default FolderRCItem;
FolderRCItem.defaultProps = {
    onDrawerVisibleChange: () => {},
    onDelete: () => {},
    onRemove: () => {},
    onDuplicate: () => {},
    onStar: () => {},
    onRename: () => {},
}






