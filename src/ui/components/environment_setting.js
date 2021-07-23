import React from 'react';
import { Select, Button, Space } from 'antd';
import { EyeOutlined, SettingFilled  } from '@ant-design/icons';
import EnvironmentDetailCard from './environment_detail_card'

const { Option } = Select;
class EnvironmentSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           environments: [
               {id: "0", name: "No Environment"},
            ...new Array(5).keys()].map((item, index) => {
            return {
                id: index + "", name: index + ""
            }
        })
        }
    }

    componentDidMount() {
      
    }

    render() {
    
        const {environments} = this.state;
       
        return (
            <Space style={{marginLeft: 20}}>
            <Select 
                defaultValue={0} 
                allowClear 
                showSearch 
                placeholder="Type to filter"
                style={{ width: 200 }}
                optionFilterProp="label"
                filterOption={(input, option) => {
                    console.log(option)
                    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                    
                }
                options={environments.map(item => {return {label: item.name, value: item.id}})}
                filterSort={(optionA, optionB) =>
                    optionA.label.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
                >
                    {/* {
                        environments.map(item => (
                            <Option value={item.id} key={item.id}>{item.name}sdfsdf</Option>
                        ))
                    } */}
                
            </Select>

            <EnvironmentDetailCard />
            
            <Button icon={<SettingFilled  />} />
            </Space>
        )
    }
}

export default EnvironmentSetting;







