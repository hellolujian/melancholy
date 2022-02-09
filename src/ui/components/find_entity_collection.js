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
import {queryCollectionCount, queryCollection} from '@/database/collection'
import Ellipsis from 'react-ellipsis-component';



import {HIDE_SIDEBAR_TITLE, BOTTOM_FIND_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
const { Header,} = Layout;

class FindEntityCollection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    refreshCollection = async () => {
        let allCollection = await queryCollection();
        this.setState({allCollection: allCollection});
    }

    componentDidMount = () => {
        this.refreshCollection();

    }

    handleCollectionCheckboxGroupsChange = (checkedValue) => {
        const {allCollection} = this.state;
        this.setState({
            collectionCheckboxGroupValue: checkedValue, 
            collectionCheckboxChecked: checkedValue.length > 0,
            collectionSelectAll: checkedValue.length === allCollection.length
        })
    }

    handleCollectionCheckboxChange = (e) => {
        this.setState({collectionPopoverVisible: true})
    }

    handlePopoverVisibleChange = (visible) => {
        if (!visible) {
            this.setState({collectionPopoverVisible: visible})
        }
    }

    handleCollectionSelectAll = () => {
        const {collectionSelectAll, allCollection} = this.state;
        this.setState({
            collectionSelectAll: !collectionSelectAll, 
            collectionCheckboxGroupValue: collectionSelectAll ? [] : allCollection.map(item => item.id),
            collectionCheckboxChecked: !collectionSelectAll
        })
    }

    render() {

        const {disabled} = this.props;
     
        const {allCollection = [], collectionPopoverVisible, collectionCheckboxChecked,
            collectionCheckboxGroupValue = [], collectionSelectAll} = this.state;

        let allCollectionCount = allCollection.length;
        let selectedCollectionCount = collectionCheckboxGroupValue.length;

        let findCollectionPopoverContent = (
            <Space direction="vertical">
                <Input placeholder="Search for collections" prefix={<SearchOutlined />} />
                <Space size={64}>
                    <Typography.Text type="secondary">
                        {`All collections (${allCollectionCount})`}
                    </Typography.Text>
                    <Space size={0}>
                        <Typography.Text type="secondary">
                            {`${selectedCollectionCount} selected`}
                        </Typography.Text>
                        <Divider type="vertical" />
                        <Typography.Link onClick={this.handleCollectionSelectAll}>
                            {collectionSelectAll ? 'Unselect' : 'Select'} all
                        </Typography.Link>
                    </Space>
                </Space>
                <Divider style={{margin: 0}} />
                <Checkbox.Group 
                    className="collection-checkbox-group-class"
                    onChange={this.handleCollectionCheckboxGroupsChange} 
                    value={collectionCheckboxGroupValue}>
                    <Space direction="vertical">
                        {
                            allCollection.map(item => (
                                <Checkbox value={item.id}>
                                    <Ellipsis text={item.name} />
                                </Checkbox>
                            ))
                        }
                        
                    </Space>
                </Checkbox.Group>
            </Space>
        )

        return (
            <Popover 
                content={findCollectionPopoverContent}
                title="Collections"
                trigger="click"
                placement="bottomLeft"
                visible={collectionPopoverVisible}
                overlayClassName="find-where-collection-popover-class"
                onVisibleChange={this.handlePopoverVisibleChange}
                >
                <Checkbox 
                    onChange={this.handleCollectionCheckboxChange} 
                    disabled={disabled}
                    checked={collectionCheckboxChecked}>
                    <Space>
                        {`Collections (${selectedCollectionCount})`}
                        <CaretDownOutlined />
                    </Space>
                </Checkbox>
            </Popover>

        )
    }
}

export default FindEntityCollection;







