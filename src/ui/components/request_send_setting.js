import React from 'react';
import { Typography, Button, Space, Input, Collapse, Tabs, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined, CaretRightOutlined  } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import KeyValueTable from './key_value_table'
import RequestBodyTab from './request_body_tab'
import CookieModal from './cookies_modal'
import CodeModal from './code_modal'
import RndScriptEditor from './rnd_script_editor'
import ScriptEditor from './script_editor'
import AuthorizationSetting from './authorization_setting'
import RequestHeaderSetting from './request_headers_setting'
import {
    GREEN_DOT_SVG,
    // GREEN_DOT_ICON
} from 'ui/constants/icons'
import {AuthSceneType} from '@/enums'
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
            activeTabKey: 'prerequestscripts',
        }
    }

    componentDidMount() {
      
    }

    handleTabKeyChange = (activeTabKey) => {
        this.setState({activeTabKey: activeTabKey})
    }

    handleParamsChange = (value, saveFlag) => {
        this.props.onChange({param: value}, saveFlag);
    }

    handleParamsSave = (value) => {
        this.props.onSave({param: value});
    }

    handleHeadersSave = (value) => {
        this.props.onSave({header: value});
    }

    handleHeadersChange = (value, saveFlag) => {
        this.props.onChange({header: value}, saveFlag);
    }

    handleAuthChange = (value) => {
        this.props.onChange({auth: value}, true)
    }
    
    handleBodyChange = (value, saveFlag) => {
        this.props.onChange({body: value}, saveFlag);
    }

    handlePreRequestScriptChange = (value, saveFlag) => {
        this.props.onChange({prerequest: value}, saveFlag);
    }

    handlePreRequestScriptSave = (e) => {
        this.props.onSave({prerequest: e.target.value});
    }

    handleTestScriptChange = (value, saveFlag) => {
        this.props.onChange({test: value}, saveFlag);
    }

    handleTestScriptSave = (e) => {
        this.props.onSave({test: e.target.value})
    }

    render() {
        const {value} = this.props;
        const {param, deleted, auth, parentId, header, body, prerequest, test} = value;

        const {activeTabKey} = this.state;
        return (
            <>
            <Tabs 
                // type="card" 
                className="request-send-setting-tab"
                size='small' 
                // tabBarStyle={{border: '1px solid red', zIndex: 1,}}
                activeKey={activeTabKey}
                onChange={this.handleTabKeyChange} 
                tabBarExtraContent={
                    <>
                        <CookieModal />
                        <CodeModal />
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
                <TabPane 
                    key="authorization"
                    tab={
                        <div className="vertical-end">
                            Authorization {(auth && auth.type && !['noauth', 'inherit'].includes(auth.type)) && GREEN_DOT_SVG}
                        </div>
                    } >
                    <AuthorizationSetting 
                        value={auth}
                        deleted={deleted}
                        parentId={parentId}
                        scene={AuthSceneType.REQUEST.name()}
                        onChange={this.handleAuthChange}
                    />
                    
                </TabPane>
                <TabPane 
                    tab={
                        <Space>
                            Headers 
                            {header && header.length > 0 && <span style={{color: '#26b47f'}}>({header.length})</span>}
                        </Space>
                    } 
                    key="headers">
                    <RequestHeaderSetting 
                        value={header}
                        onSave={this.handleHeadersSave}
                        onChange={this.handleHeadersChange}
                    />
                </TabPane>
                <TabPane 
                    key="body" 
                    tab={
                        <div className="vertical-end">
                            Body {body && body.mode && body[body.mode] && GREEN_DOT_SVG}
                        </div>
                    } 
                />
                <TabPane 
                    key="prerequestscripts"
                    tab={
                        <div className="vertical-end">
                            Pre-request Script {prerequest && GREEN_DOT_SVG}
                        </div>
                    }>
                    <RndScriptEditor 
                        value={prerequest}
                        defaultValue={prerequest}
                        onChange={this.handlePreRequestScriptChange}
                        onSave={this.handlePreRequestScriptSave}
                    />
                </TabPane>
                <TabPane 
                    key="tests"
                    tab={
                        <div className="vertical-end">
                            Tests {test && GREEN_DOT_SVG}
                        </div>
                    } >
                    <RndScriptEditor 
                        scriptType='tests' 
                        value={test}
                        defaultValue={test}
                        onChange={this.handleTestScriptChange}
                        onSave={this.handleTestScriptSave}
                    />
                </TabPane>
            </Tabs>
            {
                activeTabKey === 'body' && (
                    <RequestBodyTab 
                        value={body}
                        onSave={this.handleBodySave}
                        onChange={this.handleBodyChange}
                    />
                )
            }
            

            </>
        )
    }
}

export default RequestSendSetting;

RequestSendSetting.defaultProps = {
    onChange: () => {},
    onSave: () => {},
}







