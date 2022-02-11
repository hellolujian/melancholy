import React from 'react';
import { 
    Layout, 
    Tabs, 
    Space,
    Input,
    Button, 
    Row,
    Dropdown,
    Popover,
    Checkbox,
    Typography,
    Menu, 
    Divider,

} from 'antd';
import { 
    FileSearchOutlined , CaretDownFilled, PlusSquareFilled,SyncOutlined,
    ReadOutlined, ToolFilled ,NotificationFilled , EnvironmentFilled ,
    SearchOutlined  ,DatabaseOutlined  ,   DownOutlined
} from '@ant-design/icons';

import {TOGGLE_SIDEBAR_ICON, ADD_REQUEST_ICON, COLLECTION_ICON, ENVIRONMENT_ICON,
    MOCK_COLLECTION, MONITOR_COLLECTION_ICON, DOCUMENTATION_ICON, OPEN_NEW_ICON
} from 'ui/constants/icons';
import {
    publishNewTabOpen
} from '@/utils/event_utils'
  
import ImportModal from './import_modal'
import TooltipButton from './tooltip_button'
import DropdownTooltip from './dropdown_tooltip'
import NewButtonModal from './new_button_modal'

import SettingsModal from './settings_modal'
import WorkspaceCard from './workspace_card'

import FindEntityCollection from './find_entity_collection'
import FindCommonSettings from './find_common_settings'
import FindWhereSettings from './find_where_settings'
import FindReplaceSettings from './find_replace_settings'

import {HIDE_SIDEBAR_TITLE, BOTTOM_FIND_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
const { Header,} = Layout;
const { TabPane } = Tabs;

class FindResultFieldDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           notSelectedFields: []
        }
    }

    componentDidMount() {
      
    }

    handleFieldCheckboxChange = (fieldValue, checked) => {
        const {notSelectedFields} = this.state;
        this.setState({notSelectedFields: checked ? notSelectedFields.filter(item => item !== fieldValue) : [...notSelectedFields, fieldValue]});
    }

    render() {
     
        const {notSelectedFields} = this.state;
        const {menuList} = this.props;

        let allField = [];
        menuList.forEach(item => {
            allField = allField.concat(item.items)
        })
        
        const menu = (
            <Menu>
                <Typography.Text type="secondary">INCLUDE FIELDS</Typography.Text>
                {
                    menuList.map(menuItem => (
                        <>
                            <Divider 
                                orientation="left" 
                                orientationMargin="0"
                                style={{fontSize: 'unset', margin: '8px 0px'}}>
                                {menuItem.title}
                            </Divider>
                            <Space direction="vertical">
                            {
                                menuItem.items.map(item => {
                                    let fieldKey = menuItem.title + "_" + item.value;
                                    return (
                                        <Checkbox 
                                            key={fieldKey}
                                            checked={!notSelectedFields.includes(fieldKey)}
                                            onChange={(e) => this.handleFieldCheckboxChange(fieldKey, e.target.checked)}>
                                            {item.label}
                                        </Checkbox>
                                    )
                                })
                            }
                            </Space>
                        </>
                    ))
                }
            </Menu>
          );

        return (
            <Dropdown overlay={menu} overlayClassName="find-result-field-overlay-class">
                <Button type="text">
                {`FILTER (${notSelectedFields.length === 0 ? 'ALL' : (allField.length - notSelectedFields.length)} FIELDS)`} <DownOutlined />
                </Button>
            </Dropdown>
        )
    }
}

export default FindResultFieldDropdown;







