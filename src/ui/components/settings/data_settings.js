import React from 'react';
import {Upload, Tabs , Space, Typography, Radio, Button, Input, Modal, notification} from 'antd';

import TooltipButton from '../tooltip_button'
import PostmanButton from '../postman_button'
import ButtonModal from '../button_modal'
import ImportCollectionConfirm from '../import_collection_confirm'
import {deleteCollection, saveCollection, importCollection} from '@/utils/database_utils'

import CommonSelectFile from '../common_select_file'
import {queryCollectionMetaById, queryCollectionMetaByName} from '@/database/collection_meta'
import {queryRequestMetaById} from '@/database/request_meta'
import {queryAllEnvironmentMeta, queryEnvironmentMeta} from '@/database/environment_meta'
import {queryAllHeaderPreset} from '@/database/header_preset'
import {ImportType} from '@/enums'

import {publishCollectionSave} from '@/utils/event_utils'
import {importFromFile, importFromFilePath} from '@/utils/business_utils'
import {UUID, writeJsonFileSync, getJsonFromFile} from '@/utils/global_utils'
import {getFullUrl, getExportEnabledKeyValueArr, getEventExportObj, getVariableExportEnabledArr, getVariableExportDisabledArr} from '@/utils/common_utils'
import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
import {
    IMPORT_FILE_TIPS,
    VARIABLE_VALUE_TIPS,
    ENVIRONMENT_EXT_TIPS,
    GLOBALS_TIPS
} from 'ui/constants/tips'
import PostmanSDK from 'postman-collection' 
import { ToastContainer, toast } from 'react-toastify';
import {
    loadCollection
} from '@/utils/database_utils'

import {RequestBodyModeType} from '@/enums'

const {Item, ItemGroup, RequestAuth} = PostmanSDK;
const { Dragger } = Upload;
const { TabPane } = Tabs;
const {Paragraph, Text, Title} = Typography;
class DataSettings extends React.Component {

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

    handleRadioChange = (e) => {

        this.setState({radioValue: e.target.value});

    }

    traverseFolderItems = async (collectionItems = [], deep = 1) => {

        let flatFolders = []; 
        let flatRequests = [];
        for (let collectionItem of collectionItems) {
            const {id, items} = collectionItem;
            if (items) {
                const requestItems = items.filter(item => !item.items);
                const subFolderItems = items.filter(item => item.items);
                const itemMetaInfo = await queryCollectionMetaById(id);
                if (itemMetaInfo) {
                    const {name, description, auth, prerequest, test, parentId} = itemMetaInfo;
                    flatFolders.push({
                        id: id,
                        name: name,
                        description: description,
                        auth: auth,
                        events: getEventExportObj(prerequest, test),
                        folder: deep === 1 ? null : parentId,
                        order: requestItems.map(item => item.id),
                        folders_order: subFolderItems.map(item => item.id),
                        folderId: id,
                    })
                    let children = await this.traverseFolderItems(items, deep + 1);
                    flatFolders = [...flatFolders, ...children.flatFolders];
                    flatRequests = [...flatRequests, ...children.flatRequests];
                }
            } else {
                const itemMetaInfo = await queryRequestMetaById(id);
                if (itemMetaInfo) {
                    const {name, description, auth, prerequest, test, parentId, url, method, body = {}, header, param = []} = itemMetaInfo;
                    const {mode} = body;
                    const authType = auth && auth.type ? auth.type : null;
                    let currentHelper = null, helperAttributes = null;
                    if (authType && authType !== 'noauth') {
                        let postmanAuthRequest = new RequestAuth(auth);
                        helperAttributes = postmanAuthRequest.parameters().toObject()
                        helperAttributes = {id: authType, ...helperAttributes}
                    }
                    const modeData = body[mode];
                    flatRequests.push({
                        id: id,
                        name: name,
                        url: getFullUrl(itemMetaInfo),
                        description: description,
                        data: mode === 'params' ? getExportEnabledKeyValueArr(modeData) : null,
                        dataOptions: null,
                        dataMode: mode ? mode : null,
                        headerData: getExportEnabledKeyValueArr(header),
                        method: method.toUpperCase(),
                        pathVariableData: [],
                        queryParams: getExportEnabledKeyValueArr(param),
                        auth: auth,
                        events: getEventExportObj(prerequest, test),
                        folder: deep === 1 ? null : parentId,
                        responses_order: [],
                        protocolProfileBehavior: {
                            disableBodyPruning: true,
                        },
                        currentHelper: currentHelper,
                        helperAttributes: helperAttributes,
                        rawModeData: mode === RequestBodyModeType.RAW.code || mode === RequestBodyModeType.BINARY.code ? modeData : null,
                        headers: header ? header.map(item => {
                            const {disabled, key, value} = item
                            return (disabled === false ? "//" : "") + `${key}: ${value};`
                        }).join("\n") : "",
                        pathVariables: {}
                    })
                }
            }
            
        }
        return {
            flatFolders: flatFolders, 
            flatRequests: flatRequests,
        };
        
    }

    handleDownloadClick = async(filePath) => {
        if (!filePath) return;
        let allCollection = await loadCollection();
        let collections = [];
        for (let collection of allCollection) {
            const {id, items = []} = collection;
            const requestItems = items.filter(item => !item.items);
            const folderItems = items.filter(item => item.items);
            let collectionMeta = await queryCollectionMetaById(id);
            if (!collectionMeta) {
                continue;
            }
            const {name, description, auth, variable, test, prerequest} = collectionMeta;
            const flatItems = await this.traverseFolderItems(items);
            const {flatRequests, flatFolders} = flatItems;
            let collectionItem = {
                id: id,
                name: name,
                description: description,
                auth: auth,
                events: getEventExportObj(prerequest, test),
                variables: getVariableExportDisabledArr(variable),
                order: requestItems.map(item => item.id),
                folders_order: folderItems.map(folderItem => folderItem.id),
                folders: flatFolders.map(folderItem => {return {...folderItem, collectionId: id}}),
                requests: flatRequests.map(requestItem => {return {...requestItem, collectionId: id}})
            }
            collections.push(collectionItem);
        }
        const allEnvironmentMeta = await queryAllEnvironmentMeta();
        const allHeaderPresetMeta = await queryAllHeaderPreset();
        let dumpData = {
            version: 1,
            collections: collections,
            environments: allEnvironmentMeta.map(item => {
                const {id, name, variable} = item;
                return {
                    id: id, 
                    name: name,
                    values: getVariableExportEnabledArr(variable)
                }
            }),
            headerPresets: allHeaderPresetMeta.map(item => {
                const {id, name, preset} = item;
                return {
                    id: id,
                    name: name,
                    headers: getExportEnabledKeyValueArr(preset)
                }
            }),
            globals: []
        }
        console.log(collections);
        writeJsonFileSync(filePath, dumpData)
    }

    handleImportSelect = async (filePath) => {
        importFromFilePath(filePath, ImportType.DUMP.name())
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







