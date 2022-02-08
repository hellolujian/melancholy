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

    handleNewMenuClick = ({key}) => {
        this.setState({visibleModal: key})
    }

    handleOpenNewBtnClick = ({key}) => {
        if (key === 'tab') {
            publishNewTabOpen()
        }
    }

    handleFindWayChange = (checkedValues) => {
        this.setState({findWays: checkedValues})
    }

    handleFindWhereChange = (e) => {
        this.setState({findWhere: e.target.value})
    }

    handleCollectionCheckboxChange = (e) => {
        
    }

    handleEntityGroupsChange = (checkedValue) => {
        console.log(checkedValue)
    }

    render() {
     
        const {findWhere, findWays = ["ignorecase"], 
            enviromentCount, collectionCount} = this.state;

        let findCollectionPopoverContent = (
            <Space direction="vertical">
                <Input placeholder="Search for collections" prefix={<SearchOutlined />} />
                <Space size={64}>
                    <Typography.Text type="secondary">
                        {`All collections (${collectionCount})`}
                    </Typography.Text>
                    <Space size={0}>
                        <Typography.Text type="secondary">
                            {`1 selected`}
                        </Typography.Text>
                        <Divider type="vertical" />
                        <Typography.Link>
                            Select all
                        </Typography.Link>
                    </Space>
                </Space>
                <Divider style={{margin: 0}} />

                <Checkbox.Group>
                    <Space direction="vertical">
                        <Checkbox onChange={this.handleEnvCheckboxChange}>
                            {`Environments (${enviromentCount})`}
                        </Checkbox>
                    </Space>
                </Checkbox.Group>
            </Space>
        )
        let findContent = (

            <Row>
                <Col flex="400px" style={{borderRight: '1px solid var(--common-border-color, lightgray)', padding: '12px 16px'}} className="">
                    <Space direction="vertical" className="full-width" size={16}>
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

                        <Space direction="vertical" className="full-width">
                            <Typography.Text>WHERE</Typography.Text>
                            <Radio.Group onChange={this.handleFindWhereChange} value={findWhere}>
                                <Space direction="vertical">
                                    <Radio value='everything'>Everything</Radio>
                                    <Radio value='choose'>Choose entities to find in</Radio>
                                </Space>
                            </Radio.Group>
                            <Checkbox.Group onChange={this.handleEntityGroupsChange}>
                                <Space direction="vertical" style={{paddingLeft: 40}}>
                                    <Popover 
                                        content={findCollectionPopoverContent}
                                        title="Collections"
                                        trigger="click"
                                        placement="bottomLeft"
                                        // visible={true}
                                        >
                                        <Checkbox 
                                            // onChange={this.handleCollectionCheckboxChange} 
                                            value='collection'>
                                            <Space>
                                                {`Collections (${collectionCount})`}
                                                <CaretDownOutlined />
                                            </Space>
                                        </Checkbox>
                                    </Popover>
                                    <Checkbox 
                                        onChange={this.handleEnvCheckboxChange}
                                        value="env">
                                        <Space>
                                            {`Environments (${enviromentCount})`}
                                            <CaretDownOutlined />
                                        </Space>
                                    </Checkbox>
                                    <Checkbox value="global" onChange={this.handleGlobalCheckboxChange}>
                                        Globals
                                    </Checkbox>
                                    <Checkbox value="tab" onChange={this.handleTabCheckboxChange}>
                                        Open tabs
                                    </Checkbox>
                                </Space>
                            </Checkbox.Group>
                        </Space>
                    </Space>
                    <Divider />
                    <Space direction="vertical" className="full-width">
                        <Typography.Text>REPLACE WITH</Typography.Text>
                            <Row>
                                <Col flex="auto">
                                    <Input placeholder="Enter text to replace with..." />
                                </Col>
                                <Col flex="15px" />
                                <Col flex="none">
                                    <Button type="primary">Replace in 0 selected</Button>
                                </Col>
                            </Row>
                            <Checkbox onChange={this.handleEnvCheckboxChange}>
                                Select all
                            </Checkbox>
                        
                    </Space>
                </Col>
                <Col flex="auto">Fill Rest</Col>
            </Row>
        )
        return (
            <div class="bottom">
                
                <Space className="vertical-center full-height">
                    {/* <TooltipButton size="small" type='link' title={HIDE_SIDEBAR_TITLE} icon={TOGGLE_SIDEBAR_ICON} /> */}
                    <TooltipButton size="small" type='link' title={BOTTOM_FIND_TITLE} icon={<SearchOutlined  />} />
                    <Popover 
                        visible={true} 
                        overlayClassName="bottom-find-popover-class"
                        content={findContent} 
                        title={null}>
                        <Button type="primary">Hover me</Button>
                    </Popover>
                </Space>
            </div>

        )
    }
}

export default LayoutHeader;







