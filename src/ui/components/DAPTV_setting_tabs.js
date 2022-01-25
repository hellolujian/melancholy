import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import ScriptEditor from './script_editor'

import {UUID} from '@/utils/global_utils'

import VariablesTable from './variables_table';
import {
    VARIABLE_TIPS,
    VARIABLE_VALUE_TIPS,
    COLLECTION_DESCRIPTION_TIPS,
    AUTHORIZATION_TIPS,
    PRE_REQUEST_SCRIPTS_TIPS,
    TESTS_TIPS
} from 'ui/constants/tips'

import {
    GREEN_DOT_ICON
} from 'ui/constants/icons'
import {TabIconType, TabType, AuthSceneType} from '@/enums'

import DescriptionEditor from './description_editor'
import AuthorizationSetting from './authorization_setting'

const { TabPane } = Tabs;
const { Text, Link } = Typography;

const { TextArea } = Input;
class DAPTVSettingTabs extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || {},
            activeKey: props.activeKey
        }
    }

    componentDidMount() {
      
    }

    handleModalCancel = () => {
        this.props.onVisibleChange(false);
    }

    handleModalOk = () => {
        this.formRef.current.submit()   
    }

    handleFormFinish = (values) => {
        this.handleModalCancel()
    }

    handleDescChange = (value) => {
        this.props.onChange({description: value});
    }

    handleAuthChange = (value) => {
        this.props.onChange({auth: value});
    }

    handlePrerequestChange = (value) => {
        let script = {
            id: UUID(),
            type: "text/javascript",
            exec: value.split("\n")
        }
        this.props.onChange({
            prerequest: value
        })
    }

    handleTestChange = (value) => {
        this.props.onChange({
            test: value
        })
    }

    handleVariableChange = (variable) => {
        this.props.onChange({
            variable: variable
        })
    }

    handleTabChange = (activeKey) => {
        this.setState({activeKey: activeKey})
    }

    render() {
     
        const {value, scene, parentId} = this.props;
        const { activeKey } = this.state;
        const { description, auth, prerequest, test, variable } = value;
        let authDot = false;
        if (AuthSceneType.COLLECTION.name() === scene) {
            if (parentId) {
                if (auth && auth.type && auth.type !== 'inherit') {
                    authDot = true;
                }
            } else {
                if (auth && auth.type && auth.type !== 'noauth') {
                    authDot = true;
                }
            }
        }
        return (
            <Tabs activeKey={activeKey} defaultActiveKey="description" onChange={this.handleTabChange} style={{height: '100%', position: 'relative'}}>
                <TabPane tab="Description" key="description">
                    <Space direction="vertical" className="full-width">
                        {COLLECTION_DESCRIPTION_TIPS}
                        <DescriptionEditor 
                            scene="form" 
                            defaultValue={description}
                            mdEditorShow 
                            editorClassName="add-placeholder-class"
                            mdEditorProps={{style: {height: "300px"}}}
                            onChange={this.handleDescChange}
                        />
                    </Space>
                </TabPane>
                <TabPane 
                    tab={
                        <div className="vertical-end">
                            Authorization {authDot && GREEN_DOT_ICON}
                        </div>
                    } 
                    key="authorization">
                    {AUTHORIZATION_TIPS}
                    <AuthorizationSetting 
                        value={auth}
                        scene={scene}
                        parentId={parentId || value.parentId}
                        onChange={this.handleAuthChange}
                    />
                </TabPane>
                <TabPane tab={
                    <div className="vertical-end">
                        Pre-request Scripts {prerequest && GREEN_DOT_ICON}
                    </div>
                } key="prerequestscripts">
                    <Space direction="vertical" className="full-width">
                        {PRE_REQUEST_SCRIPTS_TIPS}
                        <ScriptEditor 
                            name="prerequestscripts" 
                            value={prerequest}
                            onChange={this.handlePrerequestChange}
                        />
                    </Space>
                </TabPane>
                <TabPane tab={ 
                    <div className="vertical-end">
                        Tests {test && GREEN_DOT_ICON}
                    </div>
                } key="tests">
                    <Space direction="vertical" className="full-width">
                        {TESTS_TIPS}
                        <ScriptEditor 
                            name="tests" 
                            value={test}
                            onChange={this.handleTestChange}
                        />
                    </Space>
                </TabPane>
                <TabPane tab={
                    <div className="vertical-end">
                        Variables {variable && variable.length > 0 && GREEN_DOT_ICON}
                    </div>
                } key="variables">
                    <Space direction="vertical">
                        {VARIABLE_TIPS}
                        <VariablesTable     
                            value={variable}
                            source="collection"
                            onChange={this.handleVariableChange}
                        />
                    </Space>
                    <Alert
                        style={{position: 'absolute', top: 380}}
                        description={VARIABLE_VALUE_TIPS}
                        type="info"
                        showIcon
                        closable
                        onClose={this.handleVariableValuesTipClose}
                    />
                </TabPane>
            </Tabs>
        );
    }
}

export default DAPTVSettingTabs;

DAPTVSettingTabs.defaultProps = {
    onVisibleChange: () => {},
    onChange: () => {},
}






