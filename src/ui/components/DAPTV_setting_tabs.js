import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import ScriptEditor from './script_editor'

import VariablesTable from './variables_table';
import {
    VARIABLE_TIPS,
    VARIABLE_VALUE_TIPS,
    COLLECTION_DESCRIPTION_TIPS,
    DESCRIPTION_TIPS,
    DESCRIPTION_MARKDOWN_TIPS,
    AUTHORIZATION_TIPS,
    PRE_REQUEST_SCRIPTS_TIPS,
    TESTS_TIPS
} from 'ui/constants/tips'

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

    render() {
     
        const {workspaceId, collectionId, folderId, visible, scene = 'add', initialValues} = this.props;
        return (
            <Tabs defaultActiveKey="variables" onChange={this.handleTabChange} style={{height: '100%', position: 'relative'}}>
                    <TabPane tab="Description" key="description">
                        <Space direction="vertical" className="full-width">
                            {COLLECTION_DESCRIPTION_TIPS}
                            <DescriptionEditor 
                                scene="form" 
                                mdEditorShow 
                                mdEditorProps={{style: {height: "300px"}}}
                            />
                        </Space>
                        
                    </TabPane>
                    <TabPane tab="Authorization" key="authorization">
                        {AUTHORIZATION_TIPS}
                        <AuthorizationSetting />
                    </TabPane>
                    <TabPane tab="Pre-request Scripts" key="prerequestscripts">
                        <Space direction="vertical" className="full-width">
                            {PRE_REQUEST_SCRIPTS_TIPS}
                            <ScriptEditor name="prerequestscripts" />
                        </Space>
                    </TabPane>
                    <TabPane tab="Tests" key="tests">
                        <Space direction="vertical" className="full-width">
                            {TESTS_TIPS}
                            <ScriptEditor name="tests" />
                        </Space>
                    </TabPane>
                    <TabPane tab="Variables" key="variables">
                        <Space direction="vertical">
                            {VARIABLE_TIPS}
                            <VariablesTable />
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
}






