import React from 'react';

import ReactDOM from "react-dom";
import { Divider, Menu, Popover, Empty, Space, Typography , Collapse, Tabs, Dropdown } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import KeyValueTable from './key_value_table'

import ResponseBody from './response_body'
import 'ui/style/request_body_tab.css'

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"

import ResponseTestResult from "./response_test_result"

import 'ui/style/response_tab.css'
const { TabPane } = Tabs;

const { Panel } = Collapse;
class ResponseTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          checkboxValue: 'raw'
        }
    }

    componentDidMount() {
      
    }

    
    render() {
      
return (
            <Tabs size="small" className="response-tab" defaultActiveKey="testresults" onChange={this.callback} tabBarExtraContent={
                <Space split={<Divider type="vertical" />}>
                <Space size="large">
                <Popover placement="bottom" content={
                  <Typography.Paragraph  style={{width: 320}}>
                    Standard response for successful HTTP requests. 
                    The actual response will depend on the request 
                    method used. In a GET request, the response will 
                    contain an entity corresponding to the requested requested 
                    resource. In a POST request the response will 
                    contain an entity describing or containing the 
                    result of the action. 
                  </Typography.Paragraph>
                } title="200 OK">
                  Status: 200 OK
                </Popover>
                  <Popover placement="bottom" content={
                    <Typography.Paragraph  style={{width: 320}}>
                      fsdsd
                    </Typography.Paragraph>
                  } title={null}>
                    Time: 367ms
                  </Popover>
                  <Popover placement="bottom" content={
                    <Space style={{width: 250}} size="small" direction="vertical" split={<Divider  />}>
                    <div>
                    <h5 className="justify-content-space-between">
                      <Typography.Text>Response Size</Typography.Text>
                      <Typography.Text>638B</Typography.Text>
                    </h5>
                      <h5 className="justify-content-space-between">
                        <Typography.Text>Body</Typography.Text>
                        <Typography.Text>257B</Typography.Text>
                      </h5>
                      <h5 className="justify-content-space-between">
                        <Typography.Text>Headers</Typography.Text>
                        <Typography.Text>B</Typography.Text>
                      </h5>
                    </div>
                    
                    <div>
                    <h5 className="justify-content-space-between">
                      <Typography.Text>Request Size</Typography.Text>
                      <Typography.Text>638B</Typography.Text>
                    </h5>
                      <h5 className="justify-content-space-between">
                        <Typography.Text>Body</Typography.Text>
                        <Typography.Text>257B</Typography.Text>
                      </h5>
                      <h5 className="justify-content-space-between">
                        <Typography.Text>Headers</Typography.Text>
                        <Typography.Text>B</Typography.Text>
                      </h5>
                    </div>
                    <h5>All size calculations are approximate</h5>
                    </Space>
                  } title={null}>
                    Size: 638B
                  </Popover>
                </Space>

                  <Dropdown overlay={
                      <Menu onClick={this.handleMenuClick}>
                      <Menu.Item key="1" >
                        Save as example
                      </Menu.Item>
                      <Menu.Item key="2" >
                        Save to a file
                      </Menu.Item>
                     
                    </Menu>
                  }>
      <Typography.Link>Save Response <CaretDownOutlined /></Typography.Link>
    </Dropdown>
                </Space>
            }>
                <TabPane tab="Body" key="body">
                  <ResponseBody />
                  
                
      
                </TabPane>
                <TabPane tab="Cookies" key="cookies">
                  <Empty 
                    description={
                      <Typography.Title level={4}>
                        No cookie for you
                      </Typography.Title>
                    }>
                      <Typography.Text type="secondary">
                      No cookies were returned by the server
                      </Typography.Text>
                    </Empty>
                </TabPane>
                <TabPane tab="Headers" key="headers">
                <KeyValueTable scene="headers" editable={false} draggable={false} />
                </TabPane>
                <TabPane tab="Test Results" key="testresults">
                <ResponseTestResult />
                </TabPane>
                
            </Tabs>
        )
    }
}

export default ResponseTab;







