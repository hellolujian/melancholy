import React from 'react';

import ReactDOM from "react-dom";
import { Divider, Button, Popover, Empty, Space, Typography , Collapse, Tabs, Dropdown } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import KeyValueTable from './key_value_table'
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import ScriptEditor from './script_editor'
import JsonEditor from './json_editor'

import ResponseBody from './response_body'
import 'ui/style/request_body_tab.css'


import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools"


import Editor from "@monaco-editor/react";

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
            <Empty 
                imageStyle={{display: 'none'}}
                description={(
                    <Typography.Title level={4}>
                      There no tests for this request
                    </Typography.Title>
                )}>
                <Space direction="vertical">
                    <Typography.Paragraph type="secondary">
                    Write a test script to automate debugging
                    </Typography.Paragraph>
                    <Button type="primary">Show me how</Button>
                    <Divider>OR</Divider>
                    <Button type="primary">Learn more</Button>
                </Space>
            </Empty>
        )
    }
}

export default ResponseTab;







