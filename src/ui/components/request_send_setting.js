import React from 'react';
import { Select, Button, Space, Input, Dropdown, Tabs } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';

const { TabPane } = Tabs;
class RequestSendSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
       
        return (
            <Tabs defaultActiveKey="1" onChange={this.callback} tabBarExtraContent={
                <>
                <Button type="link">Cookies</Button>
                
                <Button type="link">Code</Button>
                
                </>
            }>
                <TabPane tab="Params" key="params">
                Content of Tab Pane 1
                </TabPane>
                <TabPane tab="Authorization" key="authorization">
                Content of Tab Pane 2
                </TabPane>
                <TabPane tab="Headers" key="headers">
                Content of Tab Pane 3
                </TabPane>
                <TabPane tab="Pre-request Script" key="prerequestscripts">
                Content of Tab Pane 3
                </TabPane>
                <TabPane tab="Tests" key="tests">
                Content of Tab Pane 3
                </TabPane>
            </Tabs>
        )
    }
}

export default RequestSendSetting;







