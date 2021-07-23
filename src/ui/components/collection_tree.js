import React from 'react';
import { 
    Typography , 
    Menu, 
    Space,Row, Col ,
    Divider , Input,Tree,
    Button, Rate,Drawer,
    Dropdown 
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
import {stopClickPropagation} from '@/utils/global_utils';
import 'ui/style/resizable.css'
import 'ui/style/tree.css'

const { Paragraph, Text } = Typography;
class CollectionTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           showCollectionNameInput: false,
           collectionData: [
               {
                   id: '0',
                   name: 'api-new',
                   count: 11,
                   starred: 1,
                   items: [
                       {
                           id: '0-0',
                           name: '第一个文件夹',
                           items: [
                               {
                                   id: '0-0-1',
                                   name: '请求1',
                                   method: 'GET',
                               }
                           ]
                       },
                       {
                           id: '0-1',
                           name: '请求2',
                           method: 'POST',
                       }
                   ]
               },
               {
                   id: '1',
                   name: 'soa-group',
                   items: [
                       {
                           id: '1-0',
                           name: 'request 3',
                           method: 'GET',
                       },
                     
                   ]
               }
           ],
           collectionDrawerVisibleItem: null
        }
    }

    componentDidMount() {
      
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
                    <Space>
                        <FolderFilled />
                        {node.name}
                    </Space>
                );
            } else {
                treeItem.isLeaf = true;
                treeItem.title = (
                    <Space align="center">
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
                    />
                ),
                children: !item.items ? [] : this.traverseCollectionItems(item.items)
            }
        })
        
        return (
            <>
                <Drawer
                    title="Basic Drawer"
                    mask={false}
                    placement="left"
                    zIndex={1}
                    closable
                    onClose={() => this.handleDrawerVisibleChange(null)}
                    visible={collectionDrawerVisibleItem ? true : false}
                    getContainer='.site-drawer-render-in-current-wrapper'
                    style={{ position: 'absolute'}}>
                    <p>Some contents...</p>
                </Drawer>
                <Tree autoExpandParent={true} 
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







