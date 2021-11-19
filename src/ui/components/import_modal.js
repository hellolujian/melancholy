import React from 'react';
import {Upload, Tabs , Space, Typography, Button, Input, Modal} from 'antd';

import TooltipButton from './tooltip_button'
import PostmanButton from './postman_button'
import ButtonModal from './button_modal'
import {newCollection, saveCollection} from '@/utils/database_utils'

import {queryCollectionMetaById} from '@/database/collection_meta'

import {publishCollectionSave} from '@/utils/event_utils'
import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
import {
    IMPORT_FILE_TIPS,
    VARIABLE_VALUE_TIPS,
    ENVIRONMENT_EXT_TIPS,
    GLOBALS_TIPS
} from 'ui/constants/tips'

const { Dragger } = Upload;
const { TabPane } = Tabs;
class ImportModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
        
    }

    handleTabKeyChange = (activeTabKey) => {
        this.setState({activeTabKey: activeTabKey})
    }

    handleImportClick = () => {

    }

    handleReplaceClick = () => {}

    handleImportFileChange = async (chooseFileInfo) => {
        
        console.log('onchangeupdaload');
        console.log(chooseFileInfo);

        let fs = window.require('fs');
        const {file, fileList} = chooseFileInfo;
        const {uid} = file;
        let targetFile = fileList.find(file => file.uid === uid);
        let targetCollectionJson = JSON.parse(fs.readFileSync(targetFile.originFileObj.path).toString());
        let Collection = require('postman-collection').Collection;
        let myCollection = new Collection(targetCollectionJson);
        let collectionObj = myCollection.toJSON();
        console.log(collectionObj);

        const {auth, event, info, item, variable} = collectionObj;

        const {description, name, _postman_id} = info;

        let existCollectionInfo = await queryCollectionMetaById(_postman_id)
        if (existCollectionInfo) {
            Modal.confirm({
                okButtonProps: {style: {display: 'none'}},
                cancelButtonProps: {style: {display: 'none'}},
                icon: null,
                title: 'COLLECTION EXISTS',
                content: (
                    <>
                        <div>
                            A collection {existCollectionInfo.name} already exists .
                        </div>
                        <div>
                            What would you like to do ?
                        </div>
                        <Space className="justify-content-flex-end" style={{marginTop: 50}}>
                            <PostmanButton onClick={this.handleReplaceClick}>
                                Replace
                            </PostmanButton>
                            <Button type="primary" onClick={this.handleImportClick}>Import as Copy</Button>
                        </Space>
                    </>
                )
            })
        }

        // let data = {
        //     id: id,
        //     name: values.name,
        //     description: description,
        //     auth: auth,
        //     test: test,
        //     prerequest: prerequest,
        //     variable: variable,
        // }
        // await newCollection(data)
       
        // publishCollectionSave(data)

    }

    render() {
     
        const {title, color = 'gray', label} = this.props
        const {activeTabKey = 'file'} = this.state;
  
        return (
            <ButtonModal 
                label="Import" 
                tooltipProps={{title: IMPORT_TITLE}} 
                modalProps={{
                    title: "IMPORT", 
                    footer: activeTabKey === 'file' || activeTabKey === 'folder' ? null : (<Button type="primary">Import</Button>),
                    // bodyStyle: { height: 400}
                }} 
                modalContent={(
                    <Space direction="vertical">
                        {IMPORT_FILE_TIPS}
                        <Tabs defaultActiveKey="file" value={activeTabKey} onChange={this.handleTabKeyChange}>
                            <TabPane tab="Import File" key="file">
                                <Dragger
                                    multiple
                                    className="import-file-dragger-class"
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={this.handleImportFileChange}
                                >
                                    <Space direction="vertical">
                                        <Typography.Title level={3} className="ant-upload-text">Drop files here</Typography.Title>
                                        <Button size="large" type="primary">Choose Files</Button>
                                    </Space>
                                </Dragger>
                            </TabPane>
                            <TabPane tab="Import Folder" key="folder">
                                <Dragger 
                                    multiple
                                    className="import-file-dragger-class"
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={this.handleImportFileChange}
                                >
                                    <Space direction="vertical">
                                        <Typography.Title level={3} className="ant-upload-text">
                                            Drop folders here
                                        </Typography.Title>
                                        <Button size="large" type="primary">Choose Folders</Button>
                                    </Space>
                                </Dragger>
                            </TabPane>
                            <TabPane tab="Import From Link" key="link">
                                <Input placeholder="Enter a URL and press Import" />
                            </TabPane>
                            <TabPane tab="Paste Raw Text" key="raw">
                                <Input.TextArea rows={12} />
                            </TabPane>
                        </Tabs>
                    </Space>
                )}
            />
        )
    }
}

export default ImportModal;







