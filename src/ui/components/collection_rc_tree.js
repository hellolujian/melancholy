import React from 'react';
import { 
    Typography , 
    Menu, Empty,
    Space,Row, Col ,
    Divider , Input,Tree,
    Button, Rate,Tooltip,
    Tabs, Modal, Dropdown
} from 'antd';
import Icon from '@ant-design/icons';
import { 
    ShareAltOutlined , CaretRightOutlined, BranchesOutlined , PullRequestOutlined , 
    FolderAddOutlined ,CloseOutlined, LockFilled , EditFilled, EllipsisOutlined,
    DownloadOutlined ,FolderFilled , FontColorsOutlined ,DeleteFilled ,CaretDownOutlined,
    InsertRowLeftOutlined, MonitorOutlined ,CopyOutlined ,PicCenterOutlined    } from '@ant-design/icons';
import { SHARE_COLLECTION_ICON, MANAGE_ROLES_ICON, RENAME_ICON, EDIT_ICON, CREATE_FORK_ICON, 
    MERGE_CHANGES_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,ELLIPSIS_ICON,
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, ADD_ICON,
    CaretUpOutlined , CARET_DOWN_OUT_SVG, CARET_RIGHT_OUT_SVG, CARET_RIGHT_OUT_ICON, CARET_DOWN_OUT_ICON } from '@/ui/constants/icons'
import TooltipButton from 'ui/components/tooltip_button'
import CollectionRCItem from './collection_rc_item'
import FolderRCItem from './folder_rc_item'
import RequestRCItem from './request_rc_item'
import PostmanButton from './postman_button'
import {stopClickPropagation, UUID, writeJsonFileSync, getJsonFromFile, saveJsonFileSync} from '@/utils/global_utils';
import {getUrlString, getPostmanUrl, getEventExportObj, getVariableExportDisabledArr} from '@/utils/common_utils'
import {setCollectionTreeSelectedKey, getCollectionTreeSelectedKey} from '@/utils/store_utils'
import {
    publishRequestModalOpen, 
    subscribeRequestSave, 
    subscribeCollectionSave,
    publishRequestSelected,
    publishRequestSave,
    publishRequestDelete,
    publishCollectionModalOpen,
    listenShortcut,
    publishNewTabOpen
} from '@/utils/event_utils'

import {
    duplicateRequest, 
    deleteRequest,
    saveRequest,
    duplicateCollection,
    deleteCollection,
    starCollection,
    saveCollection,
    loadCollection,
    dropNode
} from '@/utils/database_utils'

import RCTree from 'rc-tree';

import {queryCollectionMetaById, queryCollectionMetaByParentId} from '@/database/collection_meta'
import {queryRequestMetaByParentId, queryRequestMetaById} from '@/database/request_meta'
import 'rc-tree/assets/index.css'

import 'ui/style/collection_rc_tree.css'

const { Paragraph, Text, Link } = Typography;
const { TabPane } = Tabs;

class CollectionTree extends React.Component {

    rcTreeRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
           showCollectionNameInput: false,
           collectionData: [],
           collectionDrawerVisibleItem: null,
           expandedKeys: []
        }
    }

    refreshData = async () => {
        let collectionData = await loadCollection();
        this.setState({collectionData: collectionData});
    }

    handleChangeTheme = (theme, data) => {
        this.setState({currentTheme: data})
    }

    getTargetNodeByKey = (treeData, key) => {
        for (let i = 0; i < treeData.length; i++) {
            let targetNode;
            if (treeData[i].key === key) targetNode = treeData[i];
            else if (treeData[i].children) targetNode = this.getTargetNodeByKey(treeData[i].children, key);

            if (targetNode) return targetNode;
        }
    }

    doDeleteCollection = async (id) => {
        let childrenReqs = await deleteCollection(id);
        childrenReqs.forEach(child => {
            publishRequestDelete({id: child.id,})
        })
    }

    handleCollectionDelete = (id) => {
        Modal.confirm({
            title: 'DELETE COLLECTION',
            icon: null,
            closable: true,
            width: 530,
            content: (
                <>
                    <p>
                        Are you sure you want to delete this collection from all workspace?
                    </p>
                    <p>
                        Deleting it will delete any monitors, mock servers and integrations created on it from all workspaces,.Your team will no longer be able to access it.
                    </p>
                    <p>
                        The collection might be accessible from the owner's <Link>Trash</Link> for some time depending on your plan.
                    </p>
                </>
            ),
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: async () => {
                await this.doDeleteCollection(id);
                this.refreshData()
            }
        });
        
    }

    handleFolderDelete = (id ,name) => {
        Modal.confirm({
            title: 'DELETE FOLDER',
            icon: null,
            closable: true,
            width: 530,
            content: (
                <p>
                    Are you sure you want to delete {name}?
                </p>
            ),
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: async () => {
                await this.doDeleteCollection(id);
                this.refreshData()
            }
        });
    }

    handleRequestDelete = (id, name) => {
        Modal.confirm({
            title: 'DELETE REQUEST',
            icon: null,
            closable: true,
            width: 530,
            content: (
                <p>
                    Are you sure you want to delete {name}?
                </p>
            ),
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: async () => {
                await deleteRequest(id);
                this.refreshData();
                publishRequestDelete({id: id})
            }
        });
    }

    getCurrentSelectedKey = () => {
        const rcTreeRef = this.rcTreeRef.current;
        if (!rcTreeRef) return;

        return getCollectionTreeSelectedKey();
    }

    getCurrentSelectedNode = () => {
        
        const rcTreeRef = this.rcTreeRef.current;
        if (!rcTreeRef) return;

        const selectedKeys = this.rcTreeRef.current.state.selectedKeys;
        if (!selectedKeys || selectedKeys.length === 0) return;

        const treeData = this.rcTreeRef.current.state.treeData;
        return this.getTargetNodeByKey(treeData, selectedKeys[0]);

    }

    handleDeleteItem = () => {
        let targetNode = this.getCurrentSelectedNode()
        if (targetNode) {
            const {isCollection, isLeaf, isFolder, key, name} = targetNode;
            if (isCollection) {
                this.handleCollectionDelete(key)
            }
            if (isLeaf) {
                this.handleRequestDelete(key, name)
            }
            if (isFolder) {
                this.handleFolderDelete(key, name)
            }
        }
    }

    

    handleCollectionDuplicate = async (id) => {
        await duplicateCollection(id);
        this.refreshData();
    }

    handleRequestDuplicate = async (id) => {
        await duplicateRequest(id);
        this.refreshData();
    }

    handleDuplicateItem = () => {
        let targetNode = this.getCurrentSelectedNode()
        if (targetNode) {
            const {isCollection, isLeaf, isFolder, key} = targetNode;
            if (isCollection) {
                this.handleCollectionDuplicate(key)
            }
            if (isLeaf) {
                this.handleRequestDuplicate(key)
            }
            if (isFolder) {
                this.handleCollectionDuplicate(key)
            }
        }
    }

    handleOpenRequestInNewTab = async () => {
        let currentSelectedKey = this.getCurrentSelectedKey()
        if (!currentSelectedKey) {
            return;
        }

        let requestMeta = await queryRequestMetaById(currentSelectedKey);
        if (!requestMeta) return;

        publishNewTabOpen(requestMeta)
    }

    handleRequestRename = async (id, name) => {
        let saveObj = {id: id, name: name};
        await saveRequest(saveObj);
        publishRequestSave({metaData: saveObj});
    }

    handleCollectionRename = async (id, name) => {
        await saveCollection(id, {name: name});
        await this.refreshData()
    }

    handleExpandItem = () => {
        let currentSelectedKey = this.getCurrentSelectedKey()
        if (!currentSelectedKey) {
            return;
        }

        let currentTreeRef = this.rcTreeRef.current;
        let currentExpandKeys = currentTreeRef.state.expandedKeys;
        let isExpanded = currentExpandKeys.find(item => item === currentSelectedKey);
        if (!isExpanded) {
            currentTreeRef.setExpandedKeys([...currentExpandKeys, currentSelectedKey]);
        }

    }

    handleCollapseitemItem = () => {
        let currentSelectedKey = this.getCurrentSelectedKey()
        if (!currentSelectedKey) {
            return;
        }

        let currentTreeRef = this.rcTreeRef.current;
        let currentExpandKeys = currentTreeRef.state.expandedKeys;
        currentTreeRef.setExpandedKeys(currentExpandKeys.filter(item => item !== currentSelectedKey));

    }

    handleGoToNextItem = () => {
        let currentSelectedKey = this.getCurrentSelectedKey()
        if (!currentSelectedKey) {
            return;
        }

        let currentTreeRef = this.rcTreeRef.current;
        let flattenNodes = currentTreeRef.state.flattenNodes;
        let currentSelectedNodeIndex = flattenNodes.findIndex(node => node.key === currentSelectedKey);
        if (currentSelectedNodeIndex < 0) return;
        let newSelectedKey = flattenNodes[(currentSelectedNodeIndex + 1) % flattenNodes.length].key;
        currentTreeRef.setUncontrolledState({selectedKeys: [newSelectedKey]});
        
        setCollectionTreeSelectedKey(newSelectedKey);

        // currentTreeRef.setExpandedKeys(currentExpandKeys.filter(item => item !== currentSelectedKey));

    }

    handleGoToPreviousItem = () => {
        let currentSelectedKey = this.getCurrentSelectedKey()
        if (!currentSelectedKey) {
            return;
        }

        let currentTreeRef = this.rcTreeRef.current;
        let flattenNodes = currentTreeRef.state.flattenNodes;
        let currentSelectedNodeIndex = flattenNodes.findIndex(node => node.key === currentSelectedKey);
        if (currentSelectedNodeIndex < 0) return;
        let newSelectedKey = flattenNodes[(currentSelectedNodeIndex - 1 + flattenNodes.length) % flattenNodes.length].key;
        currentTreeRef.setUncontrolledState({selectedKeys: [newSelectedKey]});
        
        setCollectionTreeSelectedKey(newSelectedKey);

        // currentTreeRef.setExpandedKeys(currentExpandKeys.filter(item => item !== currentSelectedKey));

    }

    componentDidMount = async () => {
        subscribeCollectionSave(this.refreshData)
        subscribeRequestSave(this.refreshData)
        this.refreshData();
        listenShortcut('deleteitem', this.handleDeleteItem)
        listenShortcut('duplicateitem', this.handleDuplicateItem)
        listenShortcut('openrequestinanewtab', this.handleOpenRequestInNewTab)
        listenShortcut('expanditem', this.handleExpandItem)
        listenShortcut('collapseitem', this.handleCollapseitemItem)
        listenShortcut('nextitem', this.handleGoToNextItem)
        listenShortcut('previousitem', this.handleGoToPreviousItem)
    }
    
    handleSelectTreeNode = (selectedKeys, {selected, selectedNodes, node}) => {
    
        const {key} = node;
        let currentTreeRef = this.rcTreeRef.current;
        console.log(currentTreeRef)
        let currentExpandKeys = currentTreeRef.state.expandedKeys;
        let isExpanded = currentExpandKeys.find(item => item === key);
        let newExpandKeys = isExpanded ? currentExpandKeys.filter(o => o !== key) : [...currentExpandKeys, key];
        currentTreeRef.setExpandedKeys(newExpandKeys);
        currentTreeRef.setUncontrolledState({selectedKeys: isExpanded ? [] : [key]});
        if (node.isLeaf) {
            publishRequestSelected(node.key)
        }
        setCollectionTreeSelectedKey(key);
    }
  
    handleOpenRequestModal = () => {
        publishRequestModalOpen();
    }

    getEmptyNode = (item, isFolder) => {
        const {id, name} = item;
        let text1 = isFolder ? 'folder' : 'collection';
        let text2 = isFolder ? 'subfolders' : 'folders';
        return {
            key: id + "_0",
            name: `${name}下的空节点`,
            isLeaf: true,
            isEmptyNode: true,
            selectable: false,
            className: 'rc-tree-treenode-empty',
            title: (
                <div className="collection-rc-tree-item-title-empty">
                    <Text type="secondary">
                        This {text1} is empty. <Link onClick={this.handleOpenRequestModal}>Add requests</Link> to this {text1} and create {text2} to organize them
                    </Text>
                </div>
            )
        }
    }

    // 递归遍历collection下的folder
    traverseCollectionItems = (list, parentId) => {
        return list.map(node => {
            const {id, name, items} = node;
            let treeItem = {
                key: id,
                name: name,
            }
            if (node.items) {
                treeItem.title = (
                    <FolderRCItem 
                        item={{...node, parentId: parentId}} 
                        onDelete={() => this.handleFolderDelete(id, name)}
                        onDuplicate={() => this.handleCollectionDuplicate(id)}
                        onRename={(value) => this.handleCollectionRename(id, value)}
                    />
                );
                
                if (node.items.length > 0) {
                    treeItem.children = this.traverseCollectionItems(items, id);
                } else {
                    treeItem.children = [this.getEmptyNode(node, true)]
                }
                treeItem.className = 'collection-tree-folder-item-class';
                treeItem.isFolder = true
                
            } else {
                treeItem.isLeaf = true;
                treeItem.title = (
                    <RequestRCItem 
                        item={node} 
                        onDelete={() => this.handleRequestDelete(id, name)}
                        onDuplicate={() => this.handleRequestDuplicate(id)}
                        onRename={(value) => this.handleRequestRename(id, value)}
                    />
                )
                treeItem.className = 'collection-tree-request-item-class'
            }
            return treeItem;
        })
    }

    // 详情抽屉的变更
    handleDrawerVisibleChange = (visibleItem) => {
        this.setState({collectionDrawerVisibleItem: visibleItem})
    }

    handleCollectionRemove = (id) => {
        Modal.confirm({
            title: 'REMOVE COLLECTION',
            icon: null,
            closable: true,
            width: 530,
            content: (
                <>
                    <p>
                        Are you sure you want to remove this collection from this workspace?
                    </p>
                    <p>
                        Removing this collection will also remove any monitors, mock servers and integrations created on this collection from this workspace.
                    </p>
                </>
            ),
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: async () => {
                await this.doDeleteCollection(id);
                this.refreshData()
            }
        });
        
    }

    handleCollectionStar = async (id, starred) => {
        await starCollection(id, starred);
        this.refreshData();
    }

    recursiveGetItem = async (parentId, deep = 1) => {
        const requestChildren = await queryRequestMetaByParentId(parentId);
        const folderChildren = await queryCollectionMetaByParentId(parentId);
        const childrenItems = [];
        for (let folder of folderChildren) {
            const {name, description, auth, prerequest, test, id} = folder;
            let folderExportItemObj = {
                name: name,
                description: description,
                auth: auth,
                events: getEventExportObj(prerequest, test),
                item: await this.recursiveGetItem(id, deep + 1)
            };
            if (deep > 1) {
                folderExportItemObj._postman_isSubFolder = true
            }
            childrenItems.push(folderExportItemObj)
        }

        requestChildren.forEach(item => {
            const {auth, body, description, header, method, url = '', name, param, prerequest, test} = item;
            let postmanUrl = getPostmanUrl(url, param);
            let postmanUrlJson = postmanUrl.toJSON();
            delete postmanUrlJson.variable;
            let requestField = {
                auth: auth,
                method: method.toUpperCase(),
                header: getVariableExportDisabledArr(header),
                body: body,
                description: description,
                url: {
                    raw: postmanUrl.toString(),
                    ...postmanUrlJson
                }
            }
            const requestItemObj = {
                name: name,
                event: getEventExportObj(prerequest, test),
                request: requestField,
                response: []
            }
            childrenItems.push(requestItemObj)
        })
        return childrenItems;
    }

    // TODO: 还有response
    handleCollectionExport = async (id) => {
        const collectionMeta = await queryCollectionMetaById(id);
        if (!collectionMeta) return;
        
        const {name, description, auth, variable, test, prerequest} = collectionMeta;
        let exportObj = {
            info: {
                id: id,
                _postman_id: id,
                name: name,
                descriptions: description,
                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            item: await this.recursiveGetItem(id)
        };
        if (auth) exportObj.auth = auth;
        if (variable && variable.length  > 0) exportObj.variable = getVariableExportDisabledArr(variable);
        if (test || prerequest) exportObj.event = getEventExportObj(prerequest, test);
        saveJsonFileSync(exportObj, {defaultPath: `${name}.postman_collection.json`}); 
    }

    checkDraggable = (node) => {
        const {isEmptyNode} = node;
        return isEmptyNode ? false : true;
    }

    handleDrop = async (info) => {
        const {dropPosition, node, dragNode, dropToGap} = info;
        await dropNode(dragNode.key, dragNode.isLeaf, node.key, node.isLeaf, dropPosition, dropToGap) 
        this.refreshData()
    }

    handleDragStart = ({event,node}) => {
        const {isCollection} = node;
        if (isCollection) {
            event.preventDefault()
        }
        
    }

    handleNewCollectionClick = () => {
        publishCollectionModalOpen();
    }

    render() {

        const {collectionData} = this.state;
        let treeData = collectionData.map(item => {
            return {
                key: item.id,
                name: item.name,
                className: 'collection-tree-collection-item-class',
                isCollection: true,
                title: (
                    <CollectionRCItem 
                        item={item} 
                        onDrawerVisibleChange={this.handleDrawerVisibleChange} 
                        onDelete={() => this.handleCollectionDelete(item.id)}
                        onRemove={() => this.handleCollectionRemove(item.id)}
                        onDuplicate={() => this.handleCollectionDuplicate(item.id)}
                        onStar={(starred) => this.handleCollectionStar(item.id, starred)}
                        onRename={(value) => this.handleCollectionRename(item.id, value)}
                        onExport={() => this.handleCollectionExport(item.id)}
                    />
                ),
                children: !item.items || item.items.length === 0 ? [
                    this.getEmptyNode(item)
                ] : this.traverseCollectionItems(item.items, item.id)
            }
        })
        return treeData.length > 0 ? (
            <>
                <RCTree
                    defaultExpandAll={false}
                    ref={this.rcTreeRef}
                    // defaultExpandedKeys={defaultExpandedKeys}
                    // motion={motion}
                    treeData={treeData}
                    switcherIcon={(obj) => {return obj.isLeaf ? false : ( <CaretRightOutlined style={{fontSize: 12}} rotate={obj.expanded ? 90 : 0} /> )}}
                    // height={300}
                    showIcon={false}
                    className="collection-rc-tree"
                    // expandedKeys={expandedKeys}
                    draggable={this.checkDraggable}
                    // onExpand={this.handleExpandTreeNode}
                    onSelect={this.handleSelectTreeNode}
                    onDrop={this.handleDrop}
                    onDragStart={this.handleDragStart}
                            
                />
            </>
            
        ) : (
            <div style={{borderTop: '1px solid lightgray'}}>
                <Empty 
                    style={{paddingTop: 20}}
                    description={
                        <Space direction="vertical" >
                            <Typography.Title level={5}>
                                You don't have any collections
                            </Typography.Title>
                            <Typography.Text type="secondary">
                                Collections let you group related requests, making them easier to access and run. 
                            </Typography.Text>
                        </Space>
                    }
                >
                    <Button 
                        type="link"
                        icon={ADD_ICON}
                        onClick={this.handleNewCollectionClick}>
                        Create a collection
                    </Button>
                </Empty>
            </div>
        )
    }
}

export default CollectionTree;







