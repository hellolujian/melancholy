import React from 'react';
import {Input, Tabs, Button, Form, Modal, Space, Typography} from 'antd';
import CollectionSelectCard from './collection_select_card'

import DescriptionEditor from './description_editor'
import EditableTable from './editable_table';

import {addCollection, queryCollection, updateCollection} from '@/database/database'

import {UUID} from '@/utils/global_utils'
import {subscribeCollectionModalOpen, publishCollectionSave} from '@/utils/event_utils'

import {
    VARIABLE_TIPS,
    VARIABLE_VALUE_TIPS,
    COLLECTION_DESCRIPTION_TIPS,
    DESCRIPTION_TIPS,
    DESCRIPTION_MARKDOWN_TIPS,
    AUTHORIZATION_TIPS,
    PRE_REQUEST_SCRIPTS_TIPS,
    TESTS_TIPS,
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
     
        const {workspaceId, collectionId, folderId, visible, scene = 'add', initialValues = {name: 'name', description: 'description'}} = this.props;
        return (
            <Modal 
                title={(scene === 'edit' ? "SAVE" : "EDIT") + " REQUEST"} 
                centered
                // bodyStyle={{ height: 600}}
                // footer={null}
                okText="Save"
                width={560}
                visible={visible} 
                onOk={this.handleModalOk} 
                onCancel={this.handleModalCancel}>
                <Form
                    layout="vertical"
                    ref={this.formRef}
                    onFinish={this.handleFormFinish}
                    initialValues={initialValues}
                >

                    {
                        scene === 'add' && (
                            <Form.Item>
                                {SAVE_REQUEST_TIPS}
                            </Form.Item>
                        )
                    }

                    <Form.Item
                        label={scene === 'edit' ? 'Name' : 'Request name'}
                        name="name"
                        rules={[{ required: true, message: '' }]}
                    >
                        <Input placeholder="Request Name" />
                    </Form.Item>

                    <Form.Item name="description" label={scene === 'edit' ? 'description' : "Request description (Optional)"}>

                        <DescriptionEditor 
                            scene="form" 
                            mdEditorShow 
                            mdEditorProps={{style: {height: "120px"}}}
                        />
                            
                    </Form.Item>

                    {
                        scene === 'add' && (
                            <Form.Item label="Select a collection or folder to save to:">
                                <CollectionSelectCard />
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






