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
import RequiredInput from './required_input'
import {stopClickPropagation} from '@/utils/global_utils';
import {publishRequestModalOpen, subscribeRequestSave, subscribeCollectionSave} from '@/utils/event_utils'
import {
    queryCollectionMetaById, 
} from '@/database/collection_meta'
import {loadCollection} from '@/database/collection'
import {
    newCollection, 
    deleteCollection,
    starCollection,
    renameCollection,
    deleteRequest
} from '@/utils/database_utils'
import {UUID} from '@/utils/global_utils'
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

    handleCollectionSave = (key, data) => {
        let {collectionData} = this.state;
        const updatedItem = collectionData.find(item => item.id === data.id);
        if (updatedItem) {
            updatedItem.name = data.name;
        } else {
            collectionData.push(data);
            collectionData = this.sortCollectionData(collectionData)
        }

        this.setState({collectionData: collectionData});
    }

    sortCollectionData = (collectionData) => {
        return collectionData.sort((a, b) => {
            if (a.starred) {
                if (!b.starred) {
                    return -1;
                }
            } else if(b.starred) {
                return 1;
            }
            return a.name.localeCompare(b.name);
        })
    }

    refreshData = async () => {
        let collectionData = await loadCollection();
        this.setState({collectionData: this.sortCollectionData(collectionData)});
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

    handleLoadData = ({key, children}) => {
       
        return new Promise((resolve) => {
            if (children) {
              resolve();
              return;
            }
      
            setTimeout(() => {
              this.updateTreeData(origin, key, [
                {
                  title: 'Child Node',
                  key: `${key}-0`,
                },
                {
                  title: 'Child Node',
                  key: `${key}-1`,
                },
              ]);
              resolve();
            }, 1000);
          });
    }
  
    handleOpenRequestModal = () => {
        publishRequestModalOpen();
    }

    getEmptyNode = (id, isFolder) => {
        let text1 = isFolder ? 'folder' : 'collection';
        let text2 = isFolder ? 'subfolders' : 'folders';
        return {
            key: id + "_0",
            isLeaf: true,
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

    handleFolderRename = async (id, name) => {
        await renameCollection(id, name);
        this.refreshData()
    }

    handleRequestRename = async (id, name) => {
        await renameCollection(id, name);
        this.refreshData()
    }

    // 递归遍历collection下的folder
    traverseCollectionItems = (list) => {
        return list.map(node => {
            let treeItem = {
                key: node.id,

            }
            if (node.items) {
                
                treeItem.title = (
                    <FolderItem 
                        item={node} 
                        onDelete={() => this.handleFolderDelete(node)}
                        onDuplicate={() => this.handleCollectionDuplicate(node.id)}
                        onRename={(value) => this.handleFolderRename(node.id, value)}
                    />
                );

                
                if (node.items.length > 0) {
                    treeItem.children = this.traverseCollectionItems(node.items);
                } else {
                    treeItem.children = [this.getEmptyNode(node.id, true)]
                }
                
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
            }
        });
    }

    handleCollectionDuplicate = async (id) => {
        let collectionInfo = await queryCollectionMetaById(id)
        if (collectionInfo) {
            let {name, auth, description, prerequest, test, variable} = collectionInfo;
            let copyData = {
                id: UUID(),
                name: name + " Copy",
                auth: auth,
                description: description,
                prerequest: prerequest,
                test: test,
                variable: variable
            };
            newCollection(copyData);
            const {collectionData} = this.state;
            collectionData.push(copyData);
            this.setState({
                collectionData: this.sortCollectionData(collectionData),
            })
        }
    }

    handleRequestDuplicate = async (id) => {
        let collectionInfo = await queryCollectionMetaById(id)
        if (collectionInfo) {
            let {name, auth, description, prerequest, test, variable} = collectionInfo;
            let copyData = {
                id: UUID(),
                name: name + " Copy",
                auth: auth,
                description: description,
                prerequest: prerequest,
                test: test,
                variable: variable
            };
            newCollection(copyData);
            const {collectionData} = this.state;
            collectionData.push(copyData);
            this.setState({
                collectionData: this.sortCollectionData(collectionData),
            })
        }
    }

    handleCollectionStar = (id, starred) => {
        let {collectionData} = this.state;
        const updatedItem = collectionData.find(item => item.id === id);
        if (updatedItem) {
            updatedItem.starred = starred;
            starCollection(id, starred);
            this.setState({collectionData: this.sortCollectionData(collectionData)});
        } 
    }

    handleCollectionRename = async (id, name) => {
        let {collectionData} = this.state;
        const updatedItem = collectionData.find(item => item.id === id);
        if (updatedItem) {
            updatedItem.name = name;
            renameCollection(id, name);
            this.setState({collectionData: this.sortCollectionData(collectionData)});
        } 
    }

    render() {

        const {collectionData, collectionDrawerVisibleItem, expandedKeys, selectedKeys} = this.state;
        let treeData = collectionData.map(item => {
            return {
                key: item.id,
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
                children: !item.items ? [
                    this.getEmptyNode(item.id)
                ] : this.traverseCollectionItems(item.items)
            }
        })
        
        return (
            <>
                <Tree 
                    // autoExpandParent={true} 
                    // titleRender={}
                    expandedKeys={expandedKeys}
                    // selectedKeys={selectedKeys}
                    treeData={treeData}
                    onSelect={this.handleSelectTreeNode}
                    draggable
                    blockNode
                    onExpand={this.handleExpandTreeNode}
                    // defaultExpandAll	
                    onDragEnter={this.onDragEnter}
                    onDrop={this.onDrop}
                    // loadData={this.handleLoadData}
                />
                
            </>
            
        )
    }
}

export default CollectionTree;







