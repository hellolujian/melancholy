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
import {publishNewTabOpen, publishRequestModalOpen, publishRequestSelected} from '@/utils/event_utils'
import {
    OPEN_NEW_ICON, DARK_THEME_DELETE_ICON, RENAME_ICON, EDIT_ICON, DARK_THEME_OPEN_NEW_ICON, 
    DARK_THEME_RENAME_ICON, DARK_THEME_EDIT_ICON, DARK_THEME_DUPLICATE_ICON, DUPLICATE_ICON,
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, 
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, GET_REQUEST_ICON, POST_REQUEST_ICON
} from '@/ui/constants/icons'
// import {starCollection} from '@/database/database'
import {TabIconType, TabType, getIconByCode} from '@/enums'
import 'ui/style/tree.css'

const { TabPane } = Tabs;
const { Paragraph, Text } = Typography;
class RequestRCItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           showCollectionNameInput: false,
        };
    }

    // 渲染collection输入框
    showCollectionNameInput = (show = true) => {
        this.setState({showCollectionNameInput: show})
    }

    // 保存collection名称
    saveRequestName = async (value) => {
        await this.props.onRename(value)
        this.setState({showCollectionNameInput: false});
    }

    deleteRequest = () => {
        this.props.onDelete()
    }

    duplicateRequest = () => {
        this.props.onDuplicate();
    }

    // 菜单配置
    menuItems = [
        { name: 'open', label: 'Open in New Tab', icon: () => getByTheme(OPEN_NEW_ICON, DARK_THEME_OPEN_NEW_ICON), event: () => publishNewTabOpen(this.props.item)},
        { name: 'rename', label: 'Rename', icon: () => getByTheme(RENAME_ICON, DARK_THEME_RENAME_ICON), event: this.showCollectionNameInput},
        { name: 'edit', label: 'Edit', icon: () => getByTheme(EDIT_ICON, DARK_THEME_EDIT_ICON), event: () => publishRequestModalOpen({requestId: this.props.item.id})},
        { name: 'duplicate', label: 'Duplicate', icon: () => getByTheme(DUPLICATE_ICON, DARK_THEME_DUPLICATE_ICON), event: this.duplicateRequest },
        { name: 'delete', label: 'Delete', icon: () => getByTheme(DELETE_ICON, DARK_THEME_DELETE_ICON), event: this.deleteRequest },
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
        const {name, method} = item;
        
        return (
            <>
                <Dropdown 
                    overlay={menu} 
                    trigger={['contextMenu']}>
                        <Row align="middle" style={{flexFlow: 'row nowrap', paddingLeft: 4}} className="request-row-class">
                            <Col style={{lineHeight: 0, marginRight: 16}}>
                                {
                                    getIconByCode(method)
                                }
                            </Col>
                            <Col flex="auto">
                                {
                                    showCollectionNameInput ? (
                                        <RequiredInput 
                                            size="small"
                                            defaultValue={name}
                                            onSave={this.saveRequestName}
                                            onClick={stopClickPropagation} 
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

export default RequestRCItem;
RequestRCItem.defaultProps = {
    onDrawerVisibleChange: () => {},
    onDelete: () => {},
    onRemove: () => {},
    onDuplicate: () => {},
    onStar: () => {},
    onRename: () => {},
}






