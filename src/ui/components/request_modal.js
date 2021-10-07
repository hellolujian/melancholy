import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography} from 'antd';
import CollectionSelectCard from './collection_select_card'

import DescriptionEditor from './description_editor'

import {queryRequestMetaById} from '@/database/request_meta'

import {queryCollectionMetaById} from '@/database/collection_meta'

import {UUID} from '@/utils/global_utils'
import {subscribeRequestModalOpen, publishRequestSave} from '@/utils/event_utils'
import {newRequest, saveRequest} from '@/utils/database_utils'

import {
    SAVE_REQUEST_TIPS
} from 'ui/constants/tips'

const { TabPane } = Tabs;
const { Text, Link } = Typography;

const { TextArea } = Input;
class RequestModal extends React.Component {

    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            // visible: props.visible
        }
    }

    getRequestInfo = async (key, data = {}) => {
        const {requestId, parentId} = data;
        let updateObj = {visible: true};
        if (requestId) {
            updateObj.requestInfo = await queryRequestMetaById(requestId);
        } else if (parentId) {
            updateObj.collectionInfo = await queryCollectionMetaById(parentId);
        } 
        this.setState(updateObj);
    }

    componentDidMount() {
        subscribeRequestModalOpen(this.getRequestInfo) 
    }

    handleModalCancel = () => {
        
        this.setState({visible: false, requestInfo: null, collectionInfo: null})
        // this.props.onVisibleChange(false);
    }

    handleModalOk = () => {
        this.formRef.current.submit()   
    }

    handleFormFinish = async (values) => {
        const {requestInfo, collectionInfo} = this.state;
        let data = {
            name: values.name,
            description: values.description,
        }
        if (requestInfo) {
            data.id = requestInfo.id;
            data.parentId = requestInfo.parentId || collectionInfo.id;
            await saveRequest(data)
        } else {
            data.id = UUID();
            data.parentId = collectionInfo.id;
            await newRequest(data)
        }
        publishRequestSave(data)
        this.handleModalCancel()
    }

    handleSelectedCollectionChange = (collectionInfo) => {
        this.setState({collectionInfo: collectionInfo})
    }

    render() {
     
        const {requestInfo, visible, collectionInfo} = this.state;
        const hasParentId = requestInfo && requestInfo.parentId;
        return (
            <Modal 
                title={(hasParentId ? "EDIT" : "SAVE") + " REQUEST"} 
                centered
                // bodyStyle={{ height: 600}}
                destroyOnClose
                okText={hasParentId ? "update" : `Save${collectionInfo ? (" to " + collectionInfo.name) : ""}`}
                okButtonProps={{disabled: !(collectionInfo || hasParentId)}}
                width={560}
                visible={visible} 
                onOk={this.handleModalOk} 
                onCancel={this.handleModalCancel}>
                <Form
                    layout="vertical"
                    ref={this.formRef}
                    preserve={false}
                    onFinish={this.handleFormFinish}
                    initialValues={requestInfo}
                >
                    {
                        !hasParentId && (
                            <Form.Item>
                                {SAVE_REQUEST_TIPS}
                            </Form.Item>
                        )
                    }

                    <Form.Item
                        label={requestInfo ? 'Name' : 'Request name'}
                        name="name"
                        rules={[{ required: true, message: '' }]}
                    >
                        <Input autoFocus placeholder="Request Name" />
                    </Form.Item>

                    <Form.Item name="description" label={requestInfo ? 'description' : "Request description (Optional)"}>

                        <DescriptionEditor 
                            scene="form" 
                            mdEditorShow 
                            mdEditorProps={{style: {height: "120px"}}}
                        />
                            
                    </Form.Item>

                    {
                        !hasParentId && (
                            <Form.Item label="Select a collection or folder to save to:">
                                <CollectionSelectCard 
                                    defaultValue={collectionInfo} 
                                    onChange={this.handleSelectedCollectionChange} 
                                />
                            </Form.Item>
                        )
                    }
                   
                </Form>
            </Modal>
        );
    }
}

export default RequestModal;

RequestModal.defaultProps = {
    onVisibleChange: () => {},
}






