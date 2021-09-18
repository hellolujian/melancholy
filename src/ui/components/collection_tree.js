import React from 'react';
import { 
    Typography , 
    Menu, 
    Space,Row, Col ,
    Divider , Input,Tree,
    Button, Rate,Drawer,
    Tabs, Modal
} from 'antd';
import Icon from '@ant-design/icons';
import { 
    ShareAltOutlined , CaretRightOutlined, BranchesOutlined , PullRequestOutlined , 
    FolderAddOutlined ,CloseOutlined, LockFilled , EditFilled, EllipsisOutlined,
    DownloadOutlined ,FolderFilled , FontColorsOutlined ,DeleteFilled ,
    InsertRowLeftOutlined, MonitorOutlined ,CopyOutlined ,PicCenterOutlined    } from '@ant-design/icons';
import { GET_REQUEST_ICON, POST_REQUEST_ICON } from '@/ui/constants/icons'
import TooltipButton from 'ui/components/tooltip_button'
import CollectionItem from './collection_item'
import PostmanButton from './postman_button'
import RequiredInput from './required_input'
import {stopClickPropagation} from '@/utils/global_utils';
import {
    loadCollection, 
    queryCollection, 
    addCollection, 
    deleteCollection,
    starCollection,
    renameCollection,
} from '@/database/database'
import {subscribeCollectionSave} from '@/utils/event_utils'
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
           collectionData: [
            //    {
            //        id: '76063f0c-a73f-40b4-b359-47b306eb0ded',
            //        name: 'api-new',
            //        count: 11,
            //        starred: 1,
            //        items: [
            //            {
            //                id: '0-0',
            //                name: '第一个文件夹',
            //                items: [
            //                    {
            //                        id: '0-0-1',
            //                        name: '请求1',
            //                        method: 'GET',
            //                    }
            //                ]
            //            },
            //            {
            //                id: '0-1',
            //                name: '请求2',
            //                method: 'POST',
            //            }
            //        ]
            //    },
            //    {
            //        id: '4f4573dd-ce46-41fa-9e36-8e9191bf3d9e',
            //        name: 'soa-group',
            //     //    items: [
            //     //        {
            //     //            id: '1-0',
            //     //            name: 'request 3',
            //     //            method: 'GET',
            //     //        },
                     
            //     //    ]
            //    }
           ],
           collectionDrawerVisibleItem: null
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

    componentDidMount = async () => {
      let collectionData = await loadCollection();
      this.setState({collectionData: this.sortCollectionData(collectionData)});
      subscribeCollectionSave(this.handleCollectionSave)
    }

    handleSelectTreeNode = (selectedKeys, e) => {
        this.setState({expandedKeys: selectedKeys});
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

    // 递归遍历collection下的folder
    traverseCollectionItems = (list) => {
        return list.map(node => {
            let treeItem = {
                key: node.id,

            }
            if (node.items) {
                treeItem.children = this.traverseCollectionItems(node.items);
                treeItem.title = (
                    <Space style={{padding: '4px 0px'}}>
                        <FolderFilled />
                        {node.name}
                    </Space>
                );
            } else {
                treeItem.isLeaf = true;
                treeItem.title = (
                    <Space align="center" style={{padding: '4px 0px', display: 'flex',alignItems: 'center'}}>
                        <div style={{width: 28, textAlign: 'center', lineHeight: 0}}>
                            {
                                node.method === 'POST' ? POST_REQUEST_ICON : GET_REQUEST_ICON
                            }
                        </div>
                        <span>{node.name}</span>
                    </Space>
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
            onOk: () => {
                deleteCollection(id);
                const {collectionData} = this.state;
                const newCollectionData = collectionData.filter(item => item.id !== id);
                this.setState({collectionData: newCollectionData});
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
            onOk: () => {
                deleteCollection(id);
                const {collectionData} = this.state;
                const newCollectionData = collectionData.filter(item => item.id !== id);
                this.setState({collectionData: newCollectionData});
            }
        });
        
    }

    handleCollectionDuplicate = async (id) => {
        let collectionInfo = await queryCollection(id)
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
            addCollection(copyData);
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

    handleCollectionRename = (id, name) => {
        let {collectionData} = this.state;
        const updatedItem = collectionData.find(item => item.id === id);
        if (updatedItem) {
            updatedItem.name = name;
            renameCollection(id, name);
            this.setState({collectionData: this.sortCollectionData(collectionData)});
        } 
    }

    render() {

        const {collectionData, collectionDrawerVisibleItem} = this.state;
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
                    {
                        key: item.id + "_0",
                        // icon: (<></>),
                        isLeaf: true,
                        className: 'ant-tree-treenode-empty',
                        title: (
                            <div className="collection-tree-item-title-empty">
                                <Text type="secondary">
                                    This collection is empty. <Link>Add requests</Link> to this collection and create folders to organize them
                                </Text>
                            </div>
                        )
                    }
                ] : this.traverseCollectionItems(item.items)
            }
        })
        
        return (
            <>
                <Tree autoExpandParent={true} 
                    // titleRender={}
                    expandedKeys={this.state.expandedKeys}
                    treeData={treeData}
                    onSelect={this.handleSelectTreeNode}
                    draggable
                    blockNode
                    onExpand={this.handleSelectTreeNode}
                    // defaultExpandAll	
                    onDragEnter={this.onDragEnter}
                    onDrop={this.onDrop}
                    loadData={this.handleLoadData}
                />
                
            </>
            
        )
    }
}

export default CollectionTree;







