import React from 'react';
import { message, Button, Upload, Radio , Collapse, Tabs } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import KeyValueTable from './key_value_table'

import ScriptEditor from './script_editor'
import 'ui/style/request_body_tab.css'
const { TabPane } = Tabs;

const { Panel } = Collapse;
class RequestBodyTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          checkboxValue: 'none'
        }
    }

    componentDidMount() {
      
    }

    props = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    checkboxOptions = [
      { label: 'none', value: 'none', content: 'This request does not have a body' },
      { label: 'form-data', value: 'formdata', content: 'Content of Tab Pane 2'},
      { label: 'x-www-form-urlencoded', value: 'xwwwformurlencoded', content: null},
      { label: 'raw', value: 'raw', content: null},
      { label: 'binary', value: 'binary', content: (
        <Upload {...this.props}>
     <Button type="text">Select File</Button>
   </Upload>
      )},
      { label: 'GraphQL', value: 'graphql', content: null},
    ]

    handleCheckboxChange = (e) => {
      this.setState({checkboxValue: e.target.value})
    }
    render() {
     
        let {checkboxValue} = this.state;
          
       let text = "wertwere"
        return (
          <>
          <Radio.Group value={checkboxValue} className="request-body-checkbox" onChange={this.handleCheckboxChange}>
          {
            this.checkboxOptions.map((option => (
              <Radio key={option.value} value={option.value}>{option.label}</Radio>
            )))
          }
        </Radio.Group>
        <div>
        {
          this.checkboxOptions.find(option => option.value === checkboxValue).content
        }
        </div>
        
          </>

  //           <Tabs defaultActiveKey="binary" onChange={this.callback} tabBarExtraContent={
  //               <Button type="link">Beautify</Button>
  //           }>
  //               <TabPane tab="none" key="none">
  //               This request does not have a body
  //               </TabPane>
  //               <TabPane tab="form-data" key="formdata">
  //               Content of Tab Pane 2
  //               </TabPane>
  //               <TabPane tab="x-www-form-urlencoded" key="xwwwformurlencoded">
                
  //               </TabPane>
  //               <TabPane tab="raw" key="raw">
                
  //               </TabPane>
  //               <TabPane tab="binary" key="binary">
  //               <Upload {...props}>
  //   <Button type="text">Select File</Button>
  // </Upload>
  //               </TabPane>
  //               <TabPane tab="GraphQL" key="graphql">
                
  //               </TabPane>
  //           </Tabs>
        )
    }
}

export default RequestBodyTab;







