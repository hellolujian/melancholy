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

import 'ui/style/request_send_setting.css'
const { TabPane } = Tabs;
const { Text, Link } = Typography;
  
const { Panel } = Collapse;
class RequestHeaderSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
      
    }

    

    render() {
     
        return (

            <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className="request-header-setting-collapse"
            >
                <Panel header="Headers (1)" key="1" className="request-header-setting-collapse-panel-first">
                <KeyValueTable scene="headers" />
                </Panel>
                <Panel header="Temporary Headers (1)" key="2" className="request-header-setting-collapse-panel-second">
                <KeyValueTable scene="headers" editable={false} draggable={false} />
                </Panel>
            </Collapse>
            
        )
    }
}

export default RequestHeaderSetting;







