import React from 'react';
import { 
    Typography , 
    Menu, 
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
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, 
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, GET_REQUEST_ICON, POST_REQUEST_ICON } from '@/ui/constants/icons'
import TooltipButton from 'ui/components/tooltip_button'
import CollectionRCItem from './collection_rc_item'
import FolderRCItem from './folder_rc_item'
import RequestRCItem from './request_rc_item'
import PostmanButton from './postman_button'
import {stopClickPropagation, UUID, writeJsonFileSync, getJsonFromFile, saveJsonFileSync} from '@/utils/global_utils';
import {getUrlString, getPostmanUrl, getEventExportObj, getVariableExportDisabledArr} from '@/utils/common_utils'
import {
    publishRequestModalOpen, 
    subscribeRequestSave, 
    subscribeCollectionSave,
    publishRequestSelected,
    publishRequestSave,
    publishRequestDelete,
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
import {queryRequestMetaByParentId} from '@/database/request_meta'
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

    componentDidMount = async () => {
        subscribeCollectionSave(this.refreshData)
        subscribeRequestSave(this.refreshData)
        this.refreshData();
    }
    
    handleSelectTreeNode = (selectedKeys, {selected, selectedNodes, node}) => {
    
        let currentTreeRef = this.rcTreeRef.current;
        let currentExpandKeys = currentTreeRef.state.expandedKeys;
    
        const {key} = node;
        let isExpanded = currentExpandKeys.find(item => item === key);
        let newKeys = isExpanded ? currentExpandKeys.filter(o => o !== key) : [...currentExpandKeys, key];
        console.log(newKeys)
        currentTreeRef.setExpandedKeys(newKeys);
    
        currentTreeRef.setUncontrolledState({selectedKeys: isExpanded ? [] : [key]});
        // this.setState({expandedKeys: newKeys});
        if (node.isLeaf) {
            publishRequestSelected(node.key)
        }
        
    }
  

    updateTreeData = (list, key, children) => {
        console.log(key);
        console.log(list);
        return list.map((node) => {
          if (node.key === key) {
            return { ...node, children };
          }
      
          if (node.children) {
            return { ...node, children: this.updateTreeData(node.children, key, children) };
          }
      
          return node;
        });
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

    handleRequestRename = async (id, name) => {
        let saveObj = {id: id, name: name};
        await saveRequest(saveObj);
        publishRequestSave({metaData: saveObj});
    }

    // 递归遍历collection下的folder
    traverseCollectionItems = (list, parentId) => {
        return list.map(node => {
            let treeItem = {
                key: node.id,
                name: node.name,
            }
            if (node.items) {
                treeItem.title = (
                    <FolderRCItem 
                        item={{...node, parentId: parentId}} 
                        onDelete={() => this.handleFolderDelete(node)}
                        onDuplicate={() => this.handleCollectionDuplicate(node.id)}
                        onRename={(value) => this.handleCollectionRename(node.id, value)}
                    />
                );
                
                if (node.items.length > 0) {
                    treeItem.children = this.traverseCollectionItems(node.items, node.id);
                } else {
                    treeItem.children = [this.getEmptyNode(node, true)]
                }
                treeItem.className = 'collection-tree-folder-item-class'
                
            } else {
                treeItem.isLeaf = true;
                treeItem.title = (
                    // <Space align="center" style={{padding: '4px 0px', display: 'flex',alignItems: 'center'}}>
                    //     <div style={{width: 28, textAlign: 'center', lineHeight: 0}}>
                    //         {
                    //             node.method === 'POST' ? POST_REQUEST_ICON : GET_REQUEST_ICON
                    //         }
                    //     </div>
                    //     <span>{node.name}</span>
                    // </Space>
                    <RequestRCItem 
                        item={node} 
                        onDelete={() => this.handleRequestDelete(node)}
                        onDuplicate={() => this.handleRequestDuplicate(node.id)}
                        onRename={(value) => this.handleRequestRename(node.id, value)}
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

    handleDeleteCollection = async (id) => {
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
                await this.handleDeleteCollection(id);
                this.refreshData()
            }
        });
        
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
                await this.handleDeleteCollection(id);
                this.refreshData()
            }
        });
        
    }

    handleFolderDelete = (node) => {
        const {id, name} = node;
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
                await this.handleDeleteCollection(id);
                this.refreshData()
            }
        });
    }

    handleRequestDelete = (node) => {
        const {id, name} = node;
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

    handleCollectionDuplicate = async (id) => {
        await duplicateCollection(id);
        this.refreshData();
    }

    handleRequestDuplicate = async (id) => {
        await duplicateRequest(id);
        this.refreshData();
    }

    handleCollectionStar = async (id, starred) => {
        await starCollection(id, starred);
        this.refreshData();
    }

    handleCollectionRename = async (id, name) => {
        await saveCollection(id, {name: name});
        await this.refreshData()
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

    render() {

        const {collectionData, collectionDrawerVisibleItem, expandedKeys} = this.state;
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
        return (
            <>
                <RCTree
                    defaultExpandAll={false}
                    ref={this.rcTreeRef}
                    // defaultExpandedKeys={defaultExpandedKeys}
                    // motion={motion}
                    treeData={treeData}
                    switcherIcon={(obj) => {return obj.isLeaf ? false : (obj.expanded ? <CaretDownOutlined /> : <CaretRightOutlined  />)}}
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
            
        )
    }
}

export default CollectionTree;







