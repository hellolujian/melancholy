import React from 'react';
import {Upload, Tabs , Space, Typography, Button, Input, Modal, notification} from 'antd';

import TooltipButton from './tooltip_button'
import PostmanButton from './postman_button'
import ButtonModal from './button_modal'
import ImportFileConfirm from './import_file_confirm'
import {deleteCollection, saveCollection, importCollection} from '@/utils/database_utils'

import {queryCollectionMetaById, queryCollectionMetaByName} from '@/database/collection_meta'

import {publishCollectionSave} from '@/utils/event_utils'
import {UUID} from '@/utils/global_utils'
import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
import {
    IMPORT_FILE_TIPS,
    VARIABLE_VALUE_TIPS,
    ENVIRONMENT_EXT_TIPS,
    GLOBALS_TIPS
} from 'ui/constants/tips'
import PostmanSDK from 'postman-collection' 
import { ToastContainer, toast } from 'react-toastify';

const {Item, ItemGroup} = PostmanSDK;
const { Dragger } = Upload;
const { TabPane } = Tabs;
class ImportModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    importNotification = (name) => {
        // notification.success({
        //     message: `Collection ${name} imported`,
        //     placement: 'bottomRight',
        //     // duration: 100,
        //     // getContainer: () => document.getElementById("rootPage")
        // });
        toast.success(`Collection ${name} imported`, {
            position: toast.POSITION.BOTTOM_RIGHT,
        })
    }


    getRequestScript = (events, eventName) => {
        let targetEvents = events.listenersOwn(eventName),
        targetEvent = targetEvents.length > 0 ? targetEvents[0] : {};
        return targetEvent.script ? targetEvent.script.toSource() : ''
    }

    getCollectionObj = (sourceCollection, requestList, collectionList, parentId) => {
       
        const {name, auth, description, events, variables, items} = sourceCollection;
        let collectionMetaData = {
            id: UUID(),
            parentId: parentId,
            name: name,
            description: description ? description.toString() : '',
            auth: auth ? auth.toJSON() : undefined,
            prerequest: this.getRequestScript(events, 'prerequest'),
            test: this.getRequestScript(events, 'test'),
            variable: variables ? variables.map(variable => {
                let {key, value, disabled} = variable.toJSON();
                return {id: UUID(), key: key, initialValue: value, currentValue: value, disabled: disabled}
            }) : undefined
        }
        collectionList.push(collectionMetaData);
        let collectionObj = {
            id: collectionMetaData.id,
            name: name,
            items: []
        };
        items.each(o => {
            console.log(o);
            console.log(ItemGroup.isItemGroup(o));
            if (ItemGroup.isItemGroup(o)) {
                let collectionChild = this.getCollectionObj(o, requestList, collectionList, collectionMetaData.id)
                collectionObj.items.push(collectionChild);
            } else if (Item.isItem(o)) {
                const {name, request, responses, events} = o;
                const {auth, body, description, headers, method, url} = request;
                let requestMetaData = {
                    id: UUID(),
                    parentId: collectionMetaData.id,
                    name: name,
                    url: url.toString(),
                    method: method,
                    body: body,
                    header: headers.map(h => {
                        let {key, value, description: headerDesc, disabled} = h;
                        return {
                            id: UUID(),
                            key: key,
                            value: value,
                            disabled: disabled,
                            description: headerDesc ? headerDesc.toString() : '',
                        }
                    }),
                    description: description ? description.toString() : '',
                    auth: auth ? auth.toJSON() : undefined,
                    // param: param,
                    prerequest: this.getRequestScript(events, 'prerequest'),
                    test: this.getRequestScript(events, 'test'),
                }
                requestList.push(requestMetaData);
                collectionObj.items.push({
                    id: requestMetaData.id,
                    name: name
                });
            } 
        })
        return collectionObj;
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

    handleAddCollection = async (myCollection) => {
        let requestList = [], collectionList = [];
        let collectionObj = this.getCollectionObj(myCollection, requestList, collectionList)
        let collectionMetaData = collectionList[0];
        await importCollection(collectionObj, collectionList, requestList)
        publishCollectionSave(collectionMetaData)
        this.importNotification(collectionMetaData.name)
    }

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
        // let collectionObj = myCollection.toJSON();
        // console.log(collectionObj);

        const {name} = myCollection;
        if (!name) return;

        let existCollectionInfo = await queryCollectionMetaByName(name)
        if (existCollectionInfo.length > 0) {
            this.importFileConfirmRef.show(myCollection)
        } else {
            await this.handleAddCollection(myCollection)
        }

        this.setState({modalVisible: false})
        
    }

    handleModalVisibleChange = (visible) => {
        this.setState({modalVisible: visible})
    }

    handleImportFileConfirmRef = (ref) => {
        if (!ref) {
            return
        }
        this.importFileConfirmRef = ref;
    }

    handleConfirmReplace = async (myCollection) => {
        let existCollectionInfo = await queryCollectionMetaByName(myCollection.name)
        if (existCollectionInfo.length === 0) {
            return;
        }
        await deleteCollection(existCollectionInfo[0].id)
        await this.handleAddCollection(myCollection)
    }

    handleConfirmCopy = async (myCollection) => {
        myCollection.name = myCollection.name + " Copy";
        this.handleAddCollection(myCollection);
    }

    render() {
     
        const {title, color = 'gray', label} = this.props
        const {activeTabKey = 'file', modalVisible} = this.state;
  
        return (
            <>
                <ImportFileConfirm 
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
                        footer: activeTabKey === 'file' || activeTabKey === 'folder' ? null : (<Button type="primary">Import</Button>),
                        // bodyStyle: { height: 400},
                    }} 
                    modalVisible={modalVisible}
                    onVisibleChange={this.handleModalVisibleChange}
                    modalContent={(
                        <Space direction="vertical">
                            {IMPORT_FILE_TIPS}
                            <Tabs size="small" defaultActiveKey="file" value={activeTabKey} onChange={this.handleTabKeyChange}>
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
                                    <Input.TextArea rows={12} />
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







