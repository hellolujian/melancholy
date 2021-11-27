import React from 'react';
import {Upload, Tabs , Space, Typography, Radio, Button, Input, Modal, notification} from 'antd';

import TooltipButton from '../tooltip_button'
import PostmanButton from '../postman_button'
import ButtonModal from '../button_modal'
import ImportFileConfirm from '../import_file_confirm'
import {deleteCollection, saveCollection, importCollection} from '@/utils/database_utils'

import CommonSelectFile from '../common_select_file'
import {queryCollectionMetaById, queryCollectionMetaByName} from '@/database/collection_meta'

import {publishCollectionSave} from '@/utils/event_utils'
import {UUID, writeFileSync} from '@/utils/global_utils'
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
const {Paragraph, Text, Title} = Typography;
class DataSettings extends React.Component {

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

        console.log( myCollection.items);
        let ItemGroup = require('postman-collection').ItemGroup;
        myCollection.items.each(o => {
            console.log(o);
            console.log(ItemGroup.isItemGroup(o));
            return o;
        })

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

    handleRadioChange = (e) => {

        this.setState({radioValue: e.target.value});

    }

    handleDownloadClick = (filePath) => {
        writeFileSync(filePath, "")
    }

    handleImportSelect = (selectFiles) => {
        if (selectFiles && selectFiles.length > 0) {
            
        }
    }

    render() {
     
        const {title, color = 'gray', label} = this.props
        const {activeTabKey = 'file', radioValue} = this.state;
  
        return (
            <Space direction="vertical" size="large">
                <Space direction="vertical">
                    <Title level={3}>
                        Export data
                    </Title>
                    <Text>
                    Export all your collections, environments, globals and header presets to a single dump file. 
                    </Text>
                    <Text type="secondary" style={{fontSize: 12 }}>Note: Exporting a data dump will save your globals from different workspaces as individual environments.</Text>
                    {/* <Radio.Group onChange={this.handleRadioChange} value={radioValue || 1}>
                        <Space direction="vertical">
                            <Radio value={1}>Download only my data</Radio>
                            <Radio value={2}>Download all data including data in workspaces I have joined</Radio>
                        </Space>
                    </Radio.Group> */}
                    <CommonSelectFile 
                        mode="save"
                        label="Download"
                        title="Select path to save file"
                        defaultPath={"Backup.postman_dump.json"}
                        onSelect={(filePath) => this.handleDownloadClick(filePath)}
                        buttonProps={{type: 'primary'}}
                    />
                </Space>
                <Space direction="vertical">
                    <Title level={3}>
                        Import data
                    </Title>
                    <Text>
                        Import a Postman data dump. This may overwrite existing data.
                    </Text>
                    <CommonSelectFile 
                        label="Select File"
                        onSelect={this.handleImportSelect}
                        buttonProps={{type: 'text', className: 'postman-button-class'}}
                    />
                </Space>
            </Space>
            
        )
    }
}

export default DataSettings;







