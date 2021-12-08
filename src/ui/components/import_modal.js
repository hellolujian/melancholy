import React from 'react';
import {Upload, Tabs , Space, Typography, Button, Input, Modal, notification} from 'antd';

import TooltipButton from './tooltip_button'
import PostmanButton from './postman_button'
import ButtonModal from './button_modal'
import ImportCollectionConfirm from './import_collection_confirm'
import {deleteCollection, saveCollection, importCollection} from '@/utils/database_utils'

import {queryCollectionMetaById, queryCollectionMetaByName} from '@/database/collection_meta'

import {publishCollectionSave} from '@/utils/event_utils'
import {UUID} from '@/utils/global_utils'
import {parseImportContent, importFromFilePath} from '@/utils/business_utils'
import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
import {
    IMPORT_FILE_TIPS,
    VARIABLE_VALUE_TIPS,
    ENVIRONMENT_EXT_TIPS,
    GLOBALS_TIPS
} from 'ui/constants/tips'
import PostmanSDK from 'postman-collection' 
import { ToastContainer, toast } from 'react-toastify';
import {ImportType} from '@/enums'

const {Item, ItemGroup} = PostmanSDK;
const { Dragger } = Upload;
const { TabPane } = Tabs;
class ImportModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
        // this.importNotification('newData.name')
        // var VariableScope = require('postman-collection').VariableScope;
        // let fs = window.require('fs')
        // let env = new VariableScope(JSON.parse(fs.readFileSync('C:\\Users\\lujian01\\Desktop\\水电费.postman_environment.json').toString()));
        // console.log('=====================env');
        // console.log(env);

        // var Collection = require('postman-collection').Collection,
        // ItemGroup = require('postman-collection').ItemGroup,
        // myCollection;

        // let requestList = [], collectionList = [];
        // let fs = window.require('fs');
        // // C:\\Users\\lujian01\\Desktop\\预告同意.postman_collection.json
        // myCollection = new Collection(JSON.parse(fs.readFileSync('C:\\Users\\lujian01\\Desktop\\1体育图.postman_collection.json').toString())); // create an empty collection
        

        // console.log('count: %s', this.getCollectionObj(myCollection, requestList, collectionList));
        // console.log('reqlist')
        // console.log(requestList)
        // console.log('folderlist');
        // console.log(collectionList)
        // console.log(myCollection.variables.map(variable => variable.toJSON()));
    }

    handleTabKeyChange = (activeTabKey) => {
        this.setState({activeTabKey: activeTabKey})
    }

    handleImportFileChange = async (chooseFileInfo) => {
        
        console.log('onchangeupdaload');
        console.log(chooseFileInfo);

        const {file, fileList} = chooseFileInfo;
        const {uid} = file;
        let targetFile = fileList.find(file => file.uid === uid);
        importFromFilePath(targetFile.originFileObj.path, ImportType.COLLECTION.name())
        this.setState({modalVisible: false})
        
    }

    handleModalVisibleChange = (visible) => {
        this.setState({modalVisible: visible})
    }

    handleRawTextChange = (e) => {
        this.setState({pasteRawText: e.target.value})
    }

    handleImportClick = () => {
        const {activeTabKey, pasteRawText} = this.state;
        if (activeTabKey === 'raw') {
            parseImportContent(pasteRawText, ImportType.COLLECTION.name())
            this.setState({modalVisible: false})
        }

    }

    render() {
     
        const {title, color = 'gray', label} = this.props
        const {activeTabKey = 'file', modalVisible} = this.state;
  
        return (
            <>
                <ImportCollectionConfirm 
                    ref={this.handleImportFileConfirmRef} 
                    onCopy={this.handleConfirmCopy}
                    onReplace={this.handleConfirmReplace}
                    onCancel={this.handleCancel}
                />

                <ButtonModal 
                    label="Import" 
                    tooltipProps={{title: IMPORT_TITLE}} 
                    modalProps={{
                        title: "IMPORT", 
                        footer: activeTabKey === 'file' || activeTabKey === 'folder' ? null : (
                            <Button type="primary" onClick={this.handleImportClick}>Import</Button>
                        ),
                        // bodyStyle: { height: 400},
                    }} 
                    modalVisible={modalVisible}
                    onVisibleChange={this.handleModalVisibleChange}
                    modalContent={(
                        <Space direction="vertical">
                            {IMPORT_FILE_TIPS}
                            <Tabs size="small" defaultActiveKey="raw" value={activeTabKey} onChange={this.handleTabKeyChange}>
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
                                        directory
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
                                    <Input.TextArea rows={12} onChange={this.handleRawTextChange}/>
                                </TabPane>
                            </Tabs>
                        </Space>
                    )}
                />
            </>
            
        )
    }
}

export default ImportModal;







