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
import DAPTVSettingTabs from './DAPTV_setting_tabs'
const { TabPane } = Tabs;
const { Text, Link } = Typography;

const { TextArea } = Input;
class CollectionModal extends React.Component {

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
            <Modal 
                title="CREATE A NEW COLLECTION" 
                centered
                bodyStyle={{ height: 600}}
                okText="Create"
                width={800}
                visible={visible} 
                onOk={this.handleModalOk} 
                onCancel={this.handleModalCancel}>
                <Form
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={this.handleFormFinish}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: '' }]}
                    >
                        <Input placeholder="Collection Name" />
                    </Form.Item>
                </Form>

                <DAPTVSettingTabs />
                
                
            </Modal>
        );
    }
}

export default CollectionModal;

CollectionModal.defaultProps = {
    onVisibleChange: () => {},
}






