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

import FindEntityCollection from './find_entity_collection'
import FindCommonSettings from './find_common_settings'
import FindWhereSettings from './find_where_settings'
import FindReplaceSettings from './find_replace_settings'
import FindResult from './layout_footer_find_result'

import {HIDE_SIDEBAR_TITLE, BOTTOM_FIND_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
const { Header,} = Layout;

class LayoutFooterFind extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
        const {} = this.state;

        let findContent = (

            <Row wrap={false}>
                <Col flex="400px" style={{borderRight: '1px solid var(--common-border-color, lightgray)', padding: '12px 16px'}} className="">
                    <Space direction="vertical" className="full-width" size={16}>
                        <FindCommonSettings />
                        <FindWhereSettings />
                    </Space>
                    <Divider />
                    <FindReplaceSettings />
                </Col>
                <Col flex="auto">
                    <FindResult />
                </Col>
            </Row>
        )
        return (
            <Popover 
                visible={true} 
                overlayClassName="bottom-find-popover-class"
                content={findContent} 
                title={null}>
                <Button type="primary">Hover me</Button>
            </Popover>

        )
    }
}

export default LayoutFooterFind;







