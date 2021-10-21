import React from 'react';
import { Typography, Button, Space, Input, Collapse, Tabs, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined, CaretRightOutlined  } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import KeyValueTable from './key_value_table'
import RequestBodyTab from './request_body_tab'
import CookieModal from './cookies_modal'
import RndScriptEditor from './rnd_script_editor'
import ScriptEditor from './script_editor'
import AuthorizationSetting from './authorization_setting'
import RequestHeaderSetting from './request_headers_setting'
import 'ui/style/request_send_setting.css'
const { TabPane } = Tabs;
const { Text, Link } = Typography;
const style = {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    // border: "solid 1px green",
  };
class RequestSendSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
      
    }

    handleParamsChange = (value, saveFlag) => {
        this.props.onChange({param: value}, saveFlag);
    }

    handleParamsSave = (value) => {
        this.props.onSave({param: value});
    }

    render() {
        const {value} = this.props;
        const {param} = value;
        return (
            <Tabs 
                // type="card" 
                className="request-send-setting-tab"
                size='small' 
                defaultActiveKey="params" 
                onChange={this.callback} 
                tabBarExtraContent={
                    <>
                        <CookieModal />
                        <Button type="link">Code</Button>
                    </>
                }
            >
                <TabPane className="request-setting-tab-param-panel" tab="Params" key="params">
                    <KeyValueTable 
                        cene="params"
                        value={param}
                        tableProps={{title: () => "Query Params"}}  
                        onSave={this.handleParamsSave}
                        onChange={this.handleParamsChange}
                    />
                </TabPane>
                <TabPane tab="Authorization" key="authorization">
                    <AuthorizationSetting />
                </TabPane>
                <TabPane tab="Headers" key="headers">
                <RequestHeaderSetting />
                </TabPane>
                <TabPane tab="Body" key="body">
                <RequestBodyTab />
                </TabPane>
                <TabPane tab="Pre-request Script" key="prerequestscripts">
                  <RndScriptEditor />
                </TabPane>
                <TabPane tab="Tests" key="tests">
                <RndScriptEditor scriptType='tests' />
                </TabPane>
            </Tabs>
        )
    }
}

export default RequestSendSetting;

RequestSendSetting.defaultProps = {
    onChange: () => {},
    onSave: () => {},
}







