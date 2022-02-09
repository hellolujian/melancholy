import React from 'react';
import { 
    Layout, 
    Checkbox, 
    Space,
    Input,
    Button, 
    Row,
    Col,
    Popover,
    Typography,
    Radio, 
    Divider,

} from 'antd';
import { 
    FileSearchOutlined , CaretDownFilled, PlusSquareFilled,SyncOutlined,
    ReadOutlined, ToolFilled ,NotificationFilled , EnvironmentFilled ,
    SearchOutlined  ,DatabaseOutlined  ,   CaretDownOutlined
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

import LayoutFooterFind from './layout_footer_find'

import {HIDE_SIDEBAR_TITLE, BOTTOM_FIND_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
const { Header,} = Layout;

class LayoutHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
        const {findWhere = 'everything', findWays = ["ignorecase"], 
            enviromentCount, collectionCount, collectionPopoverVisible, envPopoverVisible,
            collectionCheckboxGroupValue, } = this.state;

        return (
            <div class="bottom">
                <Space className="vertical-center full-height">
                    {/* <TooltipButton size="small" type='link' title={HIDE_SIDEBAR_TITLE} icon={TOGGLE_SIDEBAR_ICON} /> */}
                    <TooltipButton size="small" type='link' title={BOTTOM_FIND_TITLE} icon={<SearchOutlined  />} />
                    <LayoutFooterFind />
                </Space>
            </div>

        )
    }
}

export default LayoutHeader;






