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
            collectionCheckboxGroupValue: []
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
        this.setState({
            collectionCheckboxGroupValue: checkedValue, 
            collectionCheckboxChecked: checkedValue.length > 0,
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

    getSearchedCollection = () => {
        const {allCollection = [], collectionSearchValue} = this.state;
        return collectionSearchValue ? allCollection.filter(item => item.name.toLowerCase().indexOf(collectionSearchValue) !== -1) : allCollection
    }

    handleCollectionSelectAll = () => {
        const {allCollection, collectionCheckboxGroupValue = []} = this.state;
        let collectionSelectAll = allCollection.length === collectionCheckboxGroupValue.length;
        this.setState({
            collectionCheckboxGroupValue: collectionSelectAll ? [] : this.getSearchedCollection().map(item => item.id),
            collectionCheckboxChecked: !collectionSelectAll
        })
    }

    handleCollectionSearchValueChange = (e) => {
        this.setState({collectionSearchValue: e.target.value})
    }

    handleCollectionItemCheckboxChange = (key, checked) => {
        let {collectionCheckboxGroupValue} = this.state;
        if (checked) {
            collectionCheckboxGroupValue.push(key)
        } else {
            collectionCheckboxGroupValue = collectionCheckboxGroupValue.filter(item => item !== key)
        }
        this.setState({collectionCheckboxGroupValue: collectionCheckboxGroupValue})
    }

    render() {

        const {disabled} = this.props;
     
        const {allCollection = [], collectionPopoverVisible, collectionCheckboxChecked,
            collectionCheckboxGroupValue = [], collectionSearchValue} = this.state;

        let collectionSelectAll = allCollection.length === collectionCheckboxGroupValue.length;
        let allCollectionCount = allCollection.length;
        let selectedCollectionCount = collectionCheckboxGroupValue.length;
        let searchedCollection = this.getSearchedCollection()

        let findCollectionPopoverContent = (
            <Space direction="vertical">
                <Input 
                    placeholder="Search for collections" 
                    value={collectionSearchValue}
                    prefix={<SearchOutlined />} 
                    onChange={this.handleCollectionSearchValueChange} />
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
                <Space 
                    style={{paddingTop: 4, paddingBottom: 4}} 
                    direction="vertical" 
                    className="collection-checkbox-group-class full-width">
                    {
                        searchedCollection.map(item => (
                            <Checkbox 
                                key={item.id} 
                                checked={collectionCheckboxGroupValue.includes(item.id)} 
                                onChange={(e) => this.handleCollectionItemCheckboxChange(item.id, e.target.checked)}>
                                <Ellipsis text={item.name} />
                            </Checkbox>
                        ))
                    }
                    
                </Space>
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







