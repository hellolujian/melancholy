import React from 'react';
import { message, Button, Upload, Radio , Collapse, Tabs, Typography, Space, Select, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import KeyValueTable from './key_value_table'
import JsonEditor from './json_editor'
import RequestBodySelectFile from './request_body_select_file';
import {
    GREEN_DOT_ICON
} from 'ui/constants/icons'
import 'ui/style/request_body_tab.css'

const {Option} = Select;

const { TabPane } = Tabs;

const { Panel } = Collapse;
class RequestBodyTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
      
    }

    handleModeValueChange = (value, saveFlag = true) => {
      const {value: bodyValue = {}} = this.props;
      const {mode} = bodyValue;
      if (!mode || mode === 'none') {
        return ;
      }
      this.props.onChange(
        {
          mode: mode,
          [mode]: value
        },
        saveFlag
      )
    }

    handleKeyTypeChange = (value) => {

    }

    handleFormDataChange = (value, saveFlag) => { 
      this.handleModeValueChange(value, saveFlag)
    }

    handleUrlEncodedChange = (value, saveFlag) => {
      this.handleModeValueChange(value, saveFlag)
    }

    handleBodyRawChange = (value) => {
      let oldBodyValue = this.props.value || {};
      this.props.onChange({...oldBodyValue, raw: value}, false)
    }

    handleBodyRawBlur = (e) => {
      this.props.onChange(this.props.value, true)
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

    rawTypeOptions = [
      {label: 'Text', value: 'text',},
      {label: 'Text', value: 'plain_text', contentType: 'text/plain'},
      {label: 'JSON', value: 'json', contentType: 'application/json'},
      {label: 'Javascript', value: 'javascript', contentType: 'application/javascript'},
      {label: 'XML', value: 'xml', contentType: 'application/xml'},
      {label: 'XML', value: 'xml_text', mode: 'xml', contentType: 'text/xml'},
      {label: 'HTML', value: 'html', contentType: 'text/html'}
    ]

    handleBodyFileSelectd = (selectFiles) => {
      this.handleModeValueChange(selectFiles)
    }

    handleJsonEditorRef = (ref) => {
      if (ref) {
        this.jsonEditorRef = ref;
      }
      
    }
    getCheckboxOptions = () => {
      const {value = {}} = this.props;
      const {mode, rawType} = value;
      const modeValue = value[mode];

      let rawTypeOption = this.rawTypeOptions.find(o => o.value === rawType) || this.rawTypeOptions[0];
      return [
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
              value={modeValue}
              onChange={this.handleFormDataChange} 
            />
          )
        },
        { 
          label: 'x-www-form-urlencoded', 
          value: 'urlencoded', 
          content: (
            <KeyValueTable 
              scene="urlencoded" 
              value={modeValue}
              onChange={this.handleUrlEncodedChange} 
            />
          )
        },
        { label: 'raw', value: 'raw', content: (
          <JsonEditor 
            value={modeValue}
            ref={this.handleJsonEditorRef}
            mode={rawTypeOption.mode || rawTypeOption.value}
            onChange={this.handleBodyRawChange}
            onBlur={this.handleBodyRawBlur}
          />
        )},
        { label: 'binary', value: 'file', content: (
          <Space>
            <RequestBodySelectFile 
              value={modeValue} 
              onSelect={this.handleBodyFileSelectd} 
            />
          </Space>
        )},
        { label: 'GraphQL', value: 'graphql', content: null},
      ]
    }

    handleCheckboxChange = (e) => {
      this.props.onChange({mode: e.target.value}, true)
    }

    handleRawValueTypeChange = (value, option) => {
      let oldBodyValue = this.props.value || {};
      this.props.onChange({...oldBodyValue, rawType: value}, true)
    }

    handleBeautify = () => {
      this.jsonEditorRef.handleBeautify()
    }

    render() {
     
        const {value = {}} = this.props;
        const {mode = 'none', rawType = 'text'} = value;
        let checkboxOptions = this.getCheckboxOptions();
          
        return (
          <Space direction="vertical" className="full-width" size={0}>
            <Row>
              <Col flex="none">
                <Radio.Group 
                  value={mode} 
                  className="full-width request-body-checkbox" 
                  onChange={this.handleCheckboxChange}>
                  {
                    checkboxOptions.map((option => (
                      <Radio key={option.value} value={option.value}>{option.label}</Radio>
                    )))
                  }
                </Radio.Group>
              </Col>
              
              {
                mode === 'raw' && (
                  <Col flex='auto' className="justify-content-space-between vertical-center">
                    <Select
                      value={rawType}
                      dropdownMatchSelectWidth={false}
                      onChange={this.handleRawValueTypeChange}
                      bordered={false}
                      defaultValue="text"
                      className="request-body-raw-type-select"
                      options={this.rawTypeOptions.map(item => {
                        return {
                          label: `${item.label}${item.contentType ? ' (' + item.contentType + ')' : ''}`,
                          value: item.value,
                        }
                      })}
                    />
                    {
                      ['json', 'html', 'xml', 'xml_text'].includes(rawType) && (
                        <Button type="link" onClick={this.handleBeautify}>Beautify</Button>
                      )
                    }
                  </Col>
                  
                )
              }
            </Row>
            
            <div>
            {
              checkboxOptions.find(option => option.value === mode).content
            }
            </div>
        
          </Space>
        )
    }
}

export default RequestBodyTab;







