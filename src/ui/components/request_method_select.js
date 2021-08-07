import React from 'react';
import { Select, Button, Space, Input, Dropdown, Menu, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';

const { Option } = Select;
class RequestMethodSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
        return (
            <Select defaultValue="GET" {...this.props}>
                <Option value="get">GET</Option>
                <Option value="post">POST</Option>
            </Select>
        )
    }
}

export default RequestMethodSelect;







