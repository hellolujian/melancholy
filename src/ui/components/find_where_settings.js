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

import {HIDE_SIDEBAR_TITLE, BOTTOM_FIND_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
const { Header,} = Layout;

class FindWhereSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleFindWhereChange = (e) => {
        this.setState({findWhere: e.target.value})
    }

    render() {
     
        const {findWhere = 'everything', 
            enviromentCount, } = this.state;

        return (
            <Space direction="vertical" className="full-width">
                <Typography.Text>WHERE</Typography.Text>
                <Radio.Group onChange={this.handleFindWhereChange} value={findWhere}>
                    <Space direction="vertical">
                        <Radio value='everything'>Everything</Radio>
                        <Radio value='choose'>Choose entities to find in</Radio>
                    </Space>
                </Radio.Group>
                <Space direction="vertical" style={{paddingLeft: 40}}>
                    <FindEntityCollection disabled={findWhere !== 'choose'} />
                    <Checkbox 
                        onChange={this.handleEnvCheckboxChange}
                        disabled={findWhere !== 'choose'}>
                        <Space>
                            {`Environments (${enviromentCount})`}
                            <CaretDownOutlined />
                        </Space>
                    </Checkbox>
                    <Checkbox 
                        disabled={findWhere !== 'choose'}
                        onChange={this.handleGlobalCheckboxChange}>
                        Globals
                    </Checkbox>
                    <Checkbox 
                        disabled={findWhere !== 'choose'}
                        onChange={this.handleTabCheckboxChange}>
                        Open tabs
                    </Checkbox>
                </Space>
            </Space>

        )
    }
}

export default FindWhereSettings;







