import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import DAPTVSettingTabs from './DAPTV_setting_tabs'

import {queryCollectionMetaById} from '@/database/collection_meta'

import {UUID} from '@/utils/global_utils'
import {subscribeCollectionModalOpen, publishCollectionSave} from '@/utils/event_utils'
import {newCollection, saveCollection} from '@/utils/database_utils'
import {TabIconType, TabType, AuthSceneType} from '@/enums'
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

    getCollectionInfo = async (key, data = {}) => {
        const {collectionId, parentId, extend} = data;
        let updateObj = {visible: true, extend: extend};
        if (collectionId) {
            updateObj.collectionId = collectionId;
            updateObj.collectionSettings = await queryCollectionMetaById(collectionId);
        } else if (parentId) {
            updateObj.parentId = parentId;
            let parentInfo = await queryCollectionMetaById(parentId);
            if (parentInfo) {
                updateObj.parentName = parentInfo.name;
            }
        } 
        this.setState(updateObj);
    }

    componentDidMount() {
        subscribeCollectionModalOpen(this.getCollectionInfo) 
    }

    handleModalCancel = () => {
        this.setState({visible: false, collectionSettings: {}, collectionId: null, parentId: null})
        // this.props.onVisibleChange(false);
    }

    handleModalOk = () => {
        this.formRef.current.submit()   
    }

    handleFormFinish = async (values) => {
        
        const {collectionSettings, collectionId, parentId} = this.state;
        const {id = UUID(), description, auth, test, prerequest, variable} = collectionSettings;
        let data = {
            id: id,
            name: values.name,
            description: description,
            auth: auth,
            test: test,
            prerequest: prerequest,
            variable: variable,
        }
        if (collectionId) {
            await saveCollection(id, data)
        } else {
            await newCollection(data, parentId)
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
     
        const {collectionSettings, visible, collectionId, parentId, parentName, extend = {}} = this.state;
        return (
            <Modal 
                title={parentId ? (collectionId ? 'EDIT FOLDER' : `ADD FOLDER TO ${parentName}`) : (collectionId ? 'EDIT COLLECTION' : "CREATE A NEW COLLECTION")}
                // centered
                destroyOnClose
                bodyStyle={{ height: 600}}
                okText={collectionId ? "Update" : "Create"}
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
                        <Input autoFocus placeholder="Collection Name" />
                    </Form.Item>
                </Form>

                <DAPTVSettingTabs 
                    scene={AuthSceneType.COLLECTION.name()}
                    parentId={parentId}
                    activeKey={extend.activeKey}
                    value={collectionSettings} 
                    onChange={this.handleDAPTVSettingChange} 
                />
                
                
            </Modal>
        );
    }
}

export default CollectionModal;

CollectionModal.defaultProps = {
    onVisibleChange: () => {},
}






