import React from 'react';
import { Select, Button, Space, Input, Dropdown, Menu, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';

const { Option } = Select;
class RequestSendBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
       
        return (
            <Row gutter={[16, 16]}>
                
                <Col flex='auto'>
                    <Input addonBefore={
                        <Select defaultValue="Zhejiang">
                            <Option value="Zhejiang">Zhejiang</Option>
                            <Option value="Jiangsu">Jiangsu</Option>
                        </Select>
                    } defaultValue="Xihu District, Hangzhou" />
                </Col>

                <Col flex='none'>
                    <Space>
                        <Dropdown.Button overlay={(
                                <Menu onClick={this.handleMenuClick}>
                                    <Menu.Item key="1">
                                        Send and Download
                                    </Menu.Item>
                                </Menu>)
                            } 
                            type="primary"
                            placement="bottomCenter" icon={<CaretDownOutlined />}>
                            Send
                        </Dropdown.Button>
                        <Dropdown.Button overlay={(
                                <Menu onClick={this.handleMenuClick}>
                                    <Menu.Item key="1">
                                        Save as ...
                                    </Menu.Item>
                                </Menu>)
                            } 
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







