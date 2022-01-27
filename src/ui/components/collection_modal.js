import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography, Alert} from 'antd';

import DAPTVSettingTabs from './DAPTV_setting_tabs'

import {queryCollectionMetaById} from '@/database/collection_meta'
import Ellipsis from 'react-ellipsis-component';

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
        const {collectionId, scene, extend} = data;
        let updateObj = {visible: true, extend: extend, scene: scene, collectionId: collectionId};
        if (collectionId) {
            let targetCollectionMeta = await queryCollectionMetaById(collectionId)
            if (scene === 'edit') {
                updateObj.collectionSettings = targetCollectionMeta;
            } else {
                updateObj.parentName = targetCollectionMeta ? targetCollectionMeta.name : '';
            }
        }
        this.setState(updateObj);
    }

    componentDidMount() {
        subscribeCollectionModalOpen(this.getCollectionInfo) 
    }

    handleModalCancel = () => {
        this.setState({visible: false, collectionSettings: {}, collectionId: null})
        // this.props.onVisibleChange(false);
    }

    handleModalOk = () => {
        this.formRef.current.submit()   
    }

    handleFormFinish = async (values) => {
        
        const {collectionSettings, collectionId, scene} = this.state;
        const {description, auth, test, prerequest, variable} = collectionSettings;
        let data = {
            id: UUID(),
            name: values.name,
            description: description,
            auth: auth,
            test: test,
            prerequest: prerequest,
            variable: variable,
        }
        if (collectionId) {
            if (scene === 'edit') {
                data.id = collectionId;
                await saveCollection(collectionId, data)
            } else {
                await newCollection(data, collectionId)
            }
        } else {
            await newCollection(data)
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
     
        const {collectionSettings = {}, visible, collectionId, extend = {}, scene, parentName} = this.state;
        const {parentId} = collectionSettings;
        let title = collectionId ? (scene === 'edit' ? (parentId ? 'EDIT FOLDER' : "EDIT COLLECTION") :  `ADD FOLDER TO ${parentName}`) : "CREATE A NEW COLLECTION"
        return (
            <Modal 
                title={<div style={{marginRight: 20}}><Ellipsis text={title} /></div> }
                centered
                destroyOnClose
                // bodyStyle={{ position: 'relative' }}
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






