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

    handleFindWayChange = (checkedValues) => {
        this.setState({findWays: checkedValues})
    }

    handleFindWhereChange = (e) => {
        this.setState({findWhere: e.target.value})
    }

    render() {
     
        const {findWays = ["ignorecase"], } = this.state;

        return (
            <Space direction="vertical" className="full-width">
                <Typography.Text>FIND</Typography.Text>
                <Row>
                    <Col flex="auto">
                        <Input placeholder="Enter text to find" />
                    </Col>
                    <Col flex="15px" />
                    <Col flex="none">
                        <Button type="primary">Find</Button>
                    </Col>
                </Row>
                <Checkbox.Group
                    options={[
                        {
                            label: 'Regex', value: 'regex'
                        }, 
                        {
                            label: 'Ignore Case', value: 'ignorecase'
                        }
                    ]}
                    value={findWays}
                    onChange={this.handleFindWayChange}
                />
            </Space>

        )
    }
}

export default LayoutHeader;







