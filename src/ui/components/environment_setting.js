import React from 'react';
import { Select, Button, Space } from 'antd';
import { EyeOutlined, SettingFilled  } from '@ant-design/icons';
import EnvironmentDetailCard from './environment_detail_card'
import EnvironmentModal from './environment_modal'
import {queryEnvironmentMeta} from '@/database/environment_meta'
import {getCurrentWorkspaceId, getStoreValue, setStoreValue, getCurrentWorkspaceSession, setCurrentWorkspaceSession} from '@/utils/store_utils';
import {
    listenShortcut,
} from '@/utils/event_utils'
 

const { Option } = Select;
class EnvironmentSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           environments: []
        }
    }

    refreshData = async (extra = {}) => {
        let environments = await queryEnvironmentMeta();
        this.setState({ environments: environments, ...extra });
        return environments;
    }

    handleEnvironmentModalVisible = (visible) => {
        this.setState({environmentModalVisible: visible});
    }

    handleEnvironmentModalOpen = () => {
        this.setState({environmentModalVisible: true});
    }

    componentDidMount = async () => {
        let workspaceSession = await getCurrentWorkspaceSession();
        this.refreshData({currentEnvironment: workspaceSession.environmentId})

        listenShortcut('manageenvironments', this.handleEnvironmentModalOpen)
    }

    handleEnvironmentChange = (value) => {
        this.setState({currentEnvironment: value});
        setCurrentWorkspaceSession({environmentId: value});
    }

    render() {
    
        const {environments = [], environmentModalVisible, currentEnvironment = ''} = this.state;
        
       
        return (
            <Space style={{marginLeft: 20}}>
            <Select 
                // defaultValue={0} 
                allowClear 
                showSearch 
                value={currentEnvironment}
                onChange={this.handleEnvironmentChange}
                placeholder="Type to filter"
                style={{ width: 200 }}
                optionFilterProp="label"
                filterOption={(input, option) => {
                    return option.value && option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                    
                }
                options={[{label: 'No Environment', value: ''}, ...environments.map(item => {return {label: item.name, value: item.id}})]}
                filterSort={(optionA, optionB) =>
                    optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())
                }
                >
                    {/* {
                        environments.map(item => (
                            <Option value={item.id} key={item.id}>{item.name}sdfsdf</Option>
                        ))
                    } */}
                
            </Select>

            <EnvironmentDetailCard 
                currentEnvironmentId={currentEnvironment}
                onSave={this.refreshData}
            />
            
            <Button icon={<SettingFilled  />} onClick={() => this.handleEnvironmentModalVisible(true)} />

            <EnvironmentModal 
                visible={environmentModalVisible} 
                onSave={this.refreshData}
                onVisibleChange={this.handleEnvironmentModalVisible}
            />
            </Space>
        )
    }
}

export default EnvironmentSetting;







