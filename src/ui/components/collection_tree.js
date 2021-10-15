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
    DownloadOutlined ,FolderFilled , FontColorsOutlined ,DeleteFilled ,
    InsertRowLeftOutlined, MonitorOutlined ,CopyOutlined ,PicCenterOutlined    } from '@ant-design/icons';
import { SHARE_COLLECTION_ICON, MANAGE_ROLES_ICON, RENAME_ICON, EDIT_ICON, CREATE_FORK_ICON, 
    MERGE_CHANGES_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,ELLIPSIS_ICON,
    EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, 
    REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, GET_REQUEST_ICON, POST_REQUEST_ICON } from '@/ui/constants/icons'
import TooltipButton from 'ui/components/tooltip_button'
import CollectionItem from './collection_item'
import FolderItem from './folder_item'
import RequestItem from './request_item'
import PostmanButton from './postman_button'
import {stopClickPropagation} from '@/utils/global_utils';
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
import 'ui/style/resizable.css'
import 'ui/style/tree.css'

const { Paragraph, Text, Link } = Typography;
const { TabPane } = Tabs;
class CollectionTree extends React.Component {

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

    handleExpandKeys = (key, selected) => {
        const {expandedKeys} = this.state;
        let newExpandedKeys = expandedKeys.includes(key) ? expandedKeys.filter(item => item !== key) : [...expandedKeys, key];
        this.setState({expandedKeys: newExpandedKeys});
    }

    handleSelectTreeNode = (selectedKeys, {selected, selectedNodes, node}) => {
        this.handleExpandKeys(node.key, selected)
        if (node.isLeaf) {
            publishRequestSelected(node.key)
        }
    }

    handleExpandTreeNode = (selectedKeys, {expanded, node}) => {
        this.handleExpandKeys(node.key, expanded)
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
            className: 'ant-tree-treenode-empty',
            title: (
                <div className="collection-tree-item-title-empty">
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
    traverseCollectionItems = (list) => {
        return list.map(node => {
            let treeItem = {
                key: node.id,
                name: node.name,
            }
            if (node.items) {
                treeItem.title = (
                    <FolderItem 
                        item={node} 
                        onDelete={() => this.handleFolderDelete(node)}
                        onDuplicate={() => this.handleCollectionDuplicate(node.id)}
                        onRename={(value) => this.handleCollectionRename(node.id, value)}
                    />
                );
                
                if (node.items.length > 0) {
                    treeItem.children = this.traverseCollectionItems(node.items);
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
                    <RequestItem 
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
                await deleteCollection(id);
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
                await deleteCollection(id);
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
                await deleteCollection(id);
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

    handleDragStart = ({event, node}) => {
        
    }

    checkDraggable = (node) => {
        const {collectionData} = this.state;
        return node.isEmptyNode || collectionData.find(collection => collection.id === node.key) ? false : true;
    }

    handleDrop = async (info) => {
        const {dropPosition, node, dragNode, dropToGap} = info;
        await dropNode(dragNode.key, dragNode.isLeaf, node.key, node.isLeaf, dropPosition, dropToGap) 
        this.refreshData()
    }

    checkAllowDrop = (dropInfo) =>  {
        return !dropInfo.isLeaf;
    }

    render() {

        const {collectionData, collectionDrawerVisibleItem, expandedKeys} = this.state;
        let treeData = collectionData.map(item => {
            return {
                key: item.id,
                name: item.name,
                className: 'collection-tree-collection-item-class',
                title: (
                    <CollectionItem 
                        item={item} 
                        collectionDrawerVisible={collectionDrawerVisibleItem === item.id} 
                        onDrawerVisibleChange={this.handleDrawerVisibleChange} 
                        onDelete={() => this.handleCollectionDelete(item.id)}
                        onRemove={() => this.handleCollectionRemove(item.id)}
                        onDuplicate={() => this.handleCollectionDuplicate(item.id)}
                        onStar={(starred) => this.handleCollectionStar(item.id, starred)}
                        onRename={(value) => this.handleCollectionRename(item.id, value)}
                    />
                ),
                children: !item.items || item.items.length === 0 ? [
                    this.getEmptyNode(item)
                ] : this.traverseCollectionItems(item.items, [item.id])
            }
        })
        
        return (
            <>
                <Tree 
                    expandedKeys={expandedKeys}
                    // selectedKeys={selectedKeys}
                    treeData={treeData}
                    onSelect={this.handleSelectTreeNode}
                    draggable={this.checkDraggable}
                    blockNode
                    onExpand={this.handleExpandTreeNode}
                    onDragEnter={this.onDragEnter}
                    onDrop={this.handleDrop}
                    onDragStart={this.handleDragStart}
                    allowDrop={this.checkAllowDrop}
                />
            </>
            
        )
    }
}

export default CollectionTree;







