import React from 'react';
import {Tooltip, Button, Typography, Row, Col, List, Switch, Input, Select } from 'antd';
import {setStoreValue, getStoreValue} from '@/utils/store_utils'

const {Link} = Typography;
class GeneralSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            settings: getStoreValue('generalSettings') || {},
        }
    }

    componentDidMount() {
      
    }

    handleBtnClick = (e) => {
        const { buttonProps = {}, onClick} = this.props;
        let customClick = buttonProps.onClick || onClick;
        if (customClick) {
            customClick(e);
        }
        this.setState({visible: false});
    }

    handleMouseLeave = (e) => {
        this.setState({visible: false});
    }

    handleMouseEnter = (e) => {
        this.setState({visible: true});
    }

    REQUEST_SETTNIGS = [
        { label: 'Trim keys and values in request body', key: 'trimKVInBody', defaultValue: false},
        { label: 'Experimental Codegen mode', key: 'expCodegenMode', defaultValue: false},
        { label: 'SSL certificate verification', key: 'sslVerification', defaultValue: true},
        { label: 'Always open requests in new tab', key: 'openReqInNewTab'},
        { label: 'Always ask when closing unsaved tabs', key: 'confirmWhenCloseTabs', defaultValue: true},
        { label: 'Language detection', type: 'select', attributes: {
            options: [{ label: 'Auto', value: 'auto'}, { label: 'JSON', value: 'json'}]
        }, key: 'lanDetection', defaultValue: 'auto'},
        { label: 'Request timeout in ms (0 for infinity)', type: 'input', key: 'reqTimeout'},
        { label: 'Max response size in MB (0 to infinity)', type: 'input', key: 'maxResSize'},
        { 
            label: 'Automatically persist variable values', 
            desc: 'Enabling this will persist the current value of variables to the initial value at the end of every request execution.',
            help: 'variable_values', key: 'autoPersistVariable', defaultValue: false
        },
        { label: 'Working Directory', type: 'file', help: 'working_directory', key: 'workingDir'},
        { label: 'Allow reading files outside working directory' , 
            key: 'allowReadingFilesOverWorkingDir', defaultValue: false},
    ]

    HEAD_SETTINGS = [
        {label: 'Send no-cache header', key: 'sendNoCacheHeader', defaultValue: true},
        {label: 'Send Postman Token header', key: 'sendTokenHeader', defaultValue: true},
        {label: 'Retain headers when clicking on links', key: 'retainHeaderClickLink', defaultValue: false},
        {label: 'Automatically follow redirects', key: 'autoFollowRedir', defaultValue: true},
        {label: 'Send anonymous usage data to Postman', key: 'sendAnonymousData', defaultValue: true},
        
    ]

    USER_INTERFACE_SETTINGS = [
        {label: 'Editor Font Size (px)', type: 'input', key: 'fontSize'},
        {label: 'Two-pane view', key: 'twoPaneView', defaultValue: false},
        {label: 'Show icons with tab names', key: 'requestTabShowIcon', defaultValue: true},
        {label: 'Variable autocomplete', key: 'autoCompleteVar', defaultValue: true},
    ]

    handleItemChange = (item, value) => {
        const {settings = {}} = this.state;
        settings[item.key] = value;
        this.setState({settings: settings});
        return settings;
    }

    handleItemSave = (item, value) => {
        let newValue = this.handleItemChange(item, value);
        setStoreValue('generalSettings', newValue);

    }

    renderItemSetting = (item) => {
        const {settings = {}} = this.state;
        let itemValue = settings.hasOwnProperty(item.key) ? settings[item.key] : item.defaultValue;
       
        let dataComponent = (
            <Switch 
                size="small"
                checkedChildren="ON" 
                unCheckedChildren="OFF" 
                checked={itemValue} 
                onChange={(checked) => this.handleItemSave(item, checked)}
            />
        )
        switch (item.type) {
            case 'input': 
                dataComponent = (
                    <Input 
                        style={{width:80}} 
                        value={itemValue}
                        onChange={(e) => this.handleItemChange(item, e.target.value)}
                        onBlur={(e) => this.handleItemSave(item, e.target.value)}
                        onPressEnter={(e) => this.handleItemSave(item, e.target.value)}
                    />
                )
                break;
            case 'select': 
                dataComponent = (
                    <Select 
                        value={itemValue}
                        onChange={(value) => this.handleItemSave(item, value)}
                        style={{width:80}}
                        {...item.attributes}
                    />
                )
                break;
            default: break
        }
        return dataComponent
    }

    renderSettings = (header, items) => {
        return (
            <List
                size="small"
                split={false}
                header={<Typography.Text strong>{header}</Typography.Text>}
                dataSource={items}
                renderItem={item => {
                    return (
                        <List.Item className="justify-content-space-between">
                            {item.label}
                            {this.renderItemSetting(item)}
                        </List.Item>
                    )
                }}
            />
        )
    }

    render() {
    
        return (
            <Row gutter={[16, 16]}>
                <Col span={12}>

                    {this.renderSettings('REQUEST', this.REQUEST_SETTNIGS)}
                    
                </Col>
                <Col span={12}>
                    {this.renderSettings('HEADERS', this.HEAD_SETTINGS)}
                    {this.renderSettings('USER INTERFACE', this.USER_INTERFACE_SETTINGS)}
                </Col>
            </Row>
        )
    }
}

export default GeneralSettings;







