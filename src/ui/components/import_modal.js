import React from 'react';
import {Upload, Tabs , Space, Typography, Button, Input, Modal, notification} from 'antd';

import TooltipButton from './tooltip_button'
import PostmanButton from './postman_button'
import ButtonModal from './button_modal'
import ImportFileConfirm from './import_file_confirm'
import {newCollection, saveCollection} from '@/utils/database_utils'

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

const { Dragger } = Upload;
const { TabPane } = Tabs;
class ImportModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    importNotification = (name) => {
        notification.success({
            message: `Collection ${name} imported`,
            placement: 'bottomRight',
            // duration: 100,
            // getContainer: () => document.getElementById("rootPage")
        });
    }

    componentDidMount() {
        // this.importNotification('newData.name')
        // var VariableScope = require('postman-collection').VariableScope;
        // let fs = window.require('fs')
        // let env = new VariableScope(JSON.parse(fs.readFileSync('C:\\Users\\lujian01\\Desktop\\水电费.postman_environment.json').toString()));
        // console.log('=====================env');
        // console.log(env);

        var Collection = require('postman-collection').Collection,
    ItemGroup = require('postman-collection').ItemGroup,
    myCollection;

myCollection = new Collection(); // create an empty collection
myCollection.items.add(new ItemGroup({ // add a folder called "blank folder"
    "name": "This is a blank folder"
}));


console.log('isitemgroup');
console.log(ItemGroup.isItemGroup(new ItemGroup({ // add a folder called "blank folder"
    "name": "This is a blank folder"
})));
    }

    handleTabKeyChange = (activeTabKey) => {
        this.setState({activeTabKey: activeTabKey})
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
        let collectionObj = myCollection.toJSON();
        console.log(collectionObj);

        console.log( myCollection.items);
        let ItemGroup = require('postman-collection').ItemGroup;
        myCollection.items.each(o => {
            console.log(o);
            console.log(ItemGroup.isItemGroup(o));
            return o;
        })

        const {auth, event = [], info, item, variable = []} = collectionObj;
        const {description = {}, name,} = info;
        let collectionPrerequest = event.find(item => item.listen === 'prerequest') || {};
        const {script: prerequestScript = {}} = collectionPrerequest;
        let collectionTest = event.find(item => item.listen === 'test') || {}
        const {script: testScript = {}} = collectionTest;
        let data = {
            id: UUID(),
            name: name || "",
            description: typeof description === 'string' ? description : description.content,
            auth: auth,
            test: testScript.exec ? testScript.exec.join('\n') : '',
            prerequest: prerequestScript.exec ? prerequestScript.exec.join('\n') : '',
            variable: variable.map(item => {
                return {...item, id: UUID()}
            }),
        }

        
        let existCollectionInfo = await queryCollectionMetaByName(name)
        if (existCollectionInfo.length > 0) {
            this.importFileConfirmRef.show({...data, id: existCollectionInfo[0].id})
        } else {
            await newCollection(data)
            publishCollectionSave(data)
            this.importNotification(data.name)
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

    handleConfirmReplace = async (importData) => {
        await saveCollection(importData.id, importData)
        publishCollectionSave(importData)
        this.importNotification(importData.name)
    }

    handleConfirmCopy = async (importData) => {
        let newData = {...importData, name: importData.name + " Copy", id: UUID()}
        await newCollection(newData)
        this.importNotification(newData.name)
        publishCollectionSave(newData)
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







