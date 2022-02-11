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
import FindResultFieldDropdown from './find_result_field_dropdown'

import {HIDE_SIDEBAR_TITLE, BOTTOM_FIND_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
const { Header,} = Layout;
const { TabPane } = Tabs;

class LayoutFooterFind extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleTabsKeyChange = () => {

    }

    render() {
     
        const {} = this.state;

        const requestField = {
            title: 'Requests',
            items: [
                {label: 'Name', value: 'name'},
                {label: 'Description', value: 'desc'},
                {label: 'URL', value: 'url'},
                {label: 'Query parameters', value: 'queryparam'},
                {label: 'Path variables', value: 'pathvariable'},
                {label: 'Headers', value: 'header'},
                {label: 'Pre-request script', value: 'prescript'},
                {label: 'Tests', value: 'tests'},
                {label: 'Authorization', value: 'authorization'},
                {label: 'Request body', value: 'requestbody'},
            ]
        }

        const exampleField = {
            title: 'Examples',
            items: [
                {label: 'Name', value: 'name'},
                {label: 'URL', value: 'url'},
                {label: 'Query parameters', value: 'queryparam'},
                {label: 'Path Variables', value: 'pathvariable'},
                {label: 'Request headers', value: 'requestheader'},
                {label: 'Request body', value: 'requestbody'},
                {label: 'Headers', value: 'header'},
            ]
        };

        const folderField = {
            title: 'Folders',
            items: [
                {label: 'Name', value: 'name'},
                {label: 'Description', value: 'desc'},
                {label: 'Pre-request script', value: 'prescript'},
                {label: 'Tests', value: 'tests'},
                {label: 'Authorization', value: 'authorization'},
            ]
        }

        const collectionField = {
            title: 'Collections',
            items: [
                {label: 'Name', value: 'name'},
                {label: 'Description', value: 'desc'},
                {label: 'Pre-request script', value: 'prescript'},
                {label: 'Tests', value: 'tests'},
                {label: 'Authorization', value: 'authorization'},
                {label: 'Variable', value: 'variable'},
            ]
        }

        const environmentField = {
            title: 'Environments',
            items: [
                {label: 'Name', value: 'name'},
                {label: 'Variables', value: 'variable'}
            ]
        }

        const globalField = {
            title: 'Globals',
            items: [
                {label: 'Variables', value: 'variable'}
            ]
        }

        return (
            <Tabs 
                defaultActiveKey="1" 
                className="common-tabs-class find-result-tabs" 
                onChange={this.handleTabsKeyChange}>
                <TabPane tab="Open tabs (0)" key="1">
                    <FindResultFieldDropdown 
                        menuList={[
                            requestField,
                            exampleField
                        ]}
                    />
                </TabPane>
                <TabPane tab="Collections (0)" key="2">
                    <FindResultFieldDropdown 
                        menuList={[
                            collectionField,
                            folderField,
                            requestField,
                            exampleField
                        ]}
                    />
                </TabPane>
                <TabPane tab="Environments (0)" key="3">
                    <FindResultFieldDropdown 
                        menuList={[
                            environmentField
                        ]}
                    />
                </TabPane>
                <TabPane tab="Globals (0)" key="4">
                    <FindResultFieldDropdown 
                        menuList={[
                            globalField
                        ]}
                    />
                </TabPane>
            </Tabs>

        )
    }
}

export default LayoutFooterFind;







