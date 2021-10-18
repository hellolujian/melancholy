import React from 'react';
import { Select, Button, Space, Input, Dropdown, Menu, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import RequestMethodSelect from './request_method_select'
const { Option } = Select;
class RequestSendBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleUrlChange = (e) => {
        this.props.onChange({url: e.target.value})
    }

    handleMethodChange = (value) => {
        this.props.onChange({method: value}, true)
    }

    handleUrlSave = (e) => {
        this.props.onSave({url: e.target.value})
    }

    handleSaveClick = (e) => {
        this.props.onSaveClick();
    }

    handleSaveMenuClick = () => {
        this.props.onSaveClick(true)
    }
    
    render() {
        const {value = {}} = this.props;
        const {url, method = 'get'} = value;
        return (
            <Row gutter={[16, 16]} style={{marginTop: 5, marginBottom: 5}}>
                
                <Col flex='auto'>
                    <Input 
                        value={url}
                        size="large" 
                        addonBefore={<RequestMethodSelect defaultValue={method} onChange={this.handleMethodChange} />} 
                        onChange={this.handleUrlChange} 
                        onBlur={this.handleUrlSave}
                        onPressEnter={this.handleUrlSave}
                    />
                </Col>

                <Col flex='none'>
                    <Space>
                        <Dropdown.Button 
                            overlay={(
                                <Menu onClick={this.handleMenuClick}>
                                    <Menu.Item key="1">
                                        Send and Download
                                    </Menu.Item>
                                </Menu>)
                            } 
                            type="primary"
                            size="large"
                            placement="bottomCenter" icon={<CaretDownOutlined />}>
                            Send
                        </Dropdown.Button>
                        <Dropdown.Button overlay={(
                                <Menu onClick={this.handleSaveMenuClick}>
                                    <Menu.Item key="1">
                                        Save as ...
                                    </Menu.Item>
                                </Menu>)
                            } 
                            size="large"
                            onClick={this.handleSaveClick}
                            placement="bottomCenter" icon={<CaretDownOutlined />}>
                            Save
                        </Dropdown.Button>
                    </Space>
                </Col>
            </Row>
        )
    }
}

export default RequestSendBar;

RequestSendBar.defaultProps = {
    onChange: () => {},
    onSave: () => {},
    onSaveClick: () => {},
}







