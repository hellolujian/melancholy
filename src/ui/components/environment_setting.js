import React from 'react';
import { Select, Button, Space } from 'antd';
import { EyeOutlined, SettingFilled  } from '@ant-design/icons';

const { Option } = Select;
class EnvironmentSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
       
        return (
            <Space>
            <Select defaultValue="lucy" allowClear>
                <Option value="lucy">Lucy</Option>
            </Select>

            <Button icon={<EyeOutlined />} />
            <Button icon={<SettingFilled  />} />
            </Space>
        )
    }
}

export default EnvironmentSetting;







