import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import ScriptEditor from './script_editor'

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

import {addCollection, queryCollection, updateCollection} from '@/database/database'

import {UUID} from '@/utils/global_utils'
import {subscribeCollectionModalOpen, publishCollectionSave} from '@/utils/event_utils'
const { TabPane } = Tabs;
const { Text, Link } = Typography;

const { TextArea } = Input;
class CollectionModal extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            collectionSettings: props.initialValues || {}
        }
    }

    getCollectionInfo = async (key, data) => {
        if (data) {
            let result = await queryCollection(data);
            this.setState({visible: true, collectionSettings: result || {}});
        } else {
            this.setState({visible: true});
        }
        
    }

    componentDidMount() {
        subscribeCollectionModalOpen(this.getCollectionInfo) 
    }

    handleModalCancel = () => {
        this.setState({visible: false})
        // this.props.onVisibleChange(false);
    }

    handleModalOk = () => {
        this.formRef.current.submit()   
    }

    handleFormFinish = async (values) => {
        
        const {id, description, auth, test, prerequest, variable} = this.state.collectionSettings;
        let data = {
            id: id,
            name: values.name,
            description: description,
            auth: auth,
            test: test,
            prerequest: prerequest,
            variable: variable,
        }
        if (id) {
            await updateCollection(id, data)
        } else {
            data.id = UUID();
            await addCollection(data)
        }
        publishCollectionSave(data)
        this.handleModalCancel()
    }

    handleDAPTVSettingChange = (value) => {
        console.log('====collection变更-========');
        console.log(value);
        const {collectionSettings} = this.state;
        this.setState({
            collectionSettings: {
                ...collectionSettings,
                ...value
            }
        })
    }

    render() {
     
        const {workspaceId, collectionId, folderId, scene = 'add'} = this.props;
        const {collectionSettings, visible} = this.state;
        return (
            <Modal 
                title="CREATE A NEW COLLECTION" 
                // centered
                destroyOnClose
                bodyStyle={{ height: 600}}
                okText={collectionSettings.id ? "Update" : "Create"}
                width={800}
                visible={visible} 
                onOk={this.handleModalOk} 
                onCancel={this.handleModalCancel}>
                <Form
                    layout="vertical"
                    preserve={false}
                    ref={this.formRef}
                    initialValues={collectionSettings}
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

                <DAPTVSettingTabs value={collectionSettings} onChange={this.handleDAPTVSettingChange} />
                
                
            </Modal>
        );
    }
}

export default CollectionModal;

CollectionModal.defaultProps = {
    onVisibleChange: () => {},
}






