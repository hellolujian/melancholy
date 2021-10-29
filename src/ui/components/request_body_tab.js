import React from 'react';
import { message, Button, Upload, Radio , Collapse, Tabs, Typography, Space, Select  } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import KeyValueTable from './key_value_table'
import JsonEditor from './json_editor'
import 'ui/style/request_body_tab.css'


import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"


const {Option} = Select;

const { TabPane } = Tabs;

const { Panel } = Collapse;
class RequestBodyTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          checkboxValue: 'formdata'
        }
    }

    componentDidMount() {
      
    }

    handleKeyTypeChange = (value) => {

    }

    handleFormDataChange = (value, saveFlag) => {
      this.props.onChange(value, saveFlag)
    }

    uploadProps = {
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
      { 
        label: 'none', 
        value: 'none', 
        content: (
          <Typography.Paragraph type="secondary" className="text-align-center-class">
            This request does not have a body
          </Typography.Paragraph>
        ) 
      },
      { 
        label: 'form-data', 
        value: 'formdata', 
        content: (
          <KeyValueTable 
            scene="formdata" 
            value={this.props.value}
            onSave={this.props.onSave}
            onChange={this.props.onChange} 
          />
        )
      },
      { label: 'x-www-form-urlencoded', value: 'xwwwformurlencoded', content: null},
      { label: 'raw', value: 'raw', content: (
        <JsonEditor />
      )},
      { label: 'binary', value: 'binary', content: (
        <Upload {...this.uploadProps}>
          <Button type="text" className="postman-button-class">Select File</Button>
        </Upload>
      )},
      { label: 'GraphQL', value: 'graphql', content: null},
    ]

    handleCheckboxChange = (e) => {
      this.setState({checkboxValue: e.target.value})
    }
    render() {
     
        let {checkboxValue} = this.state;
          
        return (
          <Space direction="vertical" className="full-width" size={0}>
            <Radio.Group 
              value={checkboxValue} 
              className="full-width request-body-checkbox" 
              onChange={this.handleCheckboxChange}>
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
        
          </Space>
        )
    }
}

export default RequestBodyTab;







