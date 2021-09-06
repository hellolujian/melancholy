import React from 'react';
import {Tooltip, Button, Typography, Row, Col, List, Switch, Input, Select } from 'antd';

const {Link} = Typography;
class GeneralSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
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
        { label: 'Trim keys and values in request body'},
        { label: 'Experimental Codegen mode'},
        { label: 'SSL certificate verification'},
        { label: 'Always open requests in new tab'},
        { label: 'Always ask when closing unsaved tabs'},
        { label: 'Language detection', type: 'select', attributes: {
            options: [{ label: 'Auto', value: 'auto'}, { label: 'JSON', value: 'json'}]
        }},
        { label: 'Request timeout in ms (0 for infinity)', type: 'input', },
        { label: 'Max response size in MB (0 to infinity)', type: 'input', },
        { 
            label: 'Automatically persist variable values', 
            desc: 'Enabling this will persist the current value of variables to the initial value at the end of every request execution.',
            help: 'variable_values'
        },
        { label: 'Working Directory', type: 'file', help: 'working_directory'},
        { label: 'Allow reading files outside working directory' },
    ]

    HEAD_SETTINGS = [
        {label: 'Send no-cache header'},
        {label: 'Send Postman Token header'},
        {label: 'Retain headers when clicking on links'},
        {label: 'Automatically follow redirects'},
        {label: 'Send anonymous usage data to Postman'},
        
    ]

    USER_INTERFACE_SETTINGS = [
        {label: 'Editor Font Size (px)', type: 'input'},
        {label: 'Two-pane view'},
        {label: 'Show icons with tab names'},
        {label: 'Variable autocomplete'},
    ]

    renderItemSetting = (item) => {
        let dataComponent = (
            <Switch 
                size="small"
                checkedChildren="ON" 
                unCheckedChildren="关闭" defaultChecked 
            />
        )
        switch (item.type) {
            case 'input': 
                dataComponent = (
                    <Input style={{width:80}} />
                )
                break;
            case 'select': 
                dataComponent = (
                    <Select 
                        defaultValue={item.attributes.options[0].value}
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







