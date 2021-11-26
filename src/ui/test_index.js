import React from 'react';
import { 
    Layout, Menu, 
    Space,Row, Col ,Input,
    Tabs, Table, Select, Typography
} from 'antd';
import { PlusOutlined, SearchOutlined,} from '@ant-design/icons';
import CollectionModal from 'ui/components/collection_modal'
import TooltipButton from 'ui/components/tooltip_button';
import RequestTabs from 'ui/components/request_tabs'
import LayoutHeader from 'ui/components/layout_header'
import CollectionTree from 'ui/components/collection_tree'
import ResponseTab from 'ui/components/response_tab'
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
import KeyValueTable from 'ui/components/key_value_table'
import {Rnd} from 'react-rnd';
import {ADD_ICON} from 'ui/constants/icons'
import {publishCollectionModalOpen} from '@/utils/event_utils'
import TextareaAutosize from "react-autosize-textarea"


import { CaretRightOutlined,  CaretDownOutlined , FolderFilled} from '@ant-design/icons';
import {
  SHARE_COLLECTION_ICON, MANAGE_ROLES_ICON, RENAME_ICON, EDIT_ICON, CREATE_FORK_ICON, 
  MERGE_CHANGES_ICON, ADD_REQUEST_ICON, ADD_FOLDER_ICON, DUPLICATE_ICON,
  EXPORT_ICON, MOCK_COLLECTION, MONITOR_COLLECTION_ICON, PUBLISH_DOCS_ICON, 
  REMOVE_FROM_WORKSPACE_ICON, DELETE_ICON, COLLECTION_FOLDER_ICON, ELLIPSIS_ICON, 
} from '@/ui/constants/icons'

import CollectionRCItem from '@/ui/components/collection_rc_item'
import FolderItem from '@/ui/components/folder_rc_item'
import RequestRCItem from '@/ui/components/request_rc_item'

import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider, ControlledTreeEnvironment } from 'react-complex-tree';
import 'react-complex-tree/lib/style.css';

import 'ui/style/common.css'
import 'ui/style/layout.css'
import 'ui/style/global.css'
import 'ui/style/test.css'



import RCTree from 'rc-tree';

import 'rc-tree/assets/index.css'

const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const { DirectoryTree } = Tree;
const {Option} = Select;

const {Text, Link} = Typography

class Home extends React.Component {

  rcTreeRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
          width: 350,
          tabActiveKey: 'collections',
          
          snippetContainerHeight: 200,
          outContainerHeight: 350, 
          dynamicWidth: 350
        }
    }

    handleTreeRef = (ref) => {
      if (ref) this.treeRef = ref;
    }

    handleWindowResize = (e) => {
      this.setState({contentWidth: e.target.innerWidth - this.state.width})
    }

    componentDidMount = async () => {
      this.setState({contentWidth: window.innerWidth - this.state.width})
      window.addEventListener('resize', this.handleWindowResize)

      let collectionData = await loadCollection();
        this.setState({collectionData: collectionData});

    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize)
    }


handleExpandKeys = (key, selected) => {
  const {expandedKeys = []} = this.state;
  let newExpandedKeys = expandedKeys.includes(key) ? expandedKeys.filter(item => item !== key) : [...expandedKeys, key];
  this.setState({expandedKeys: newExpandedKeys});
}

handleSelectTreeNode = (selectedKeys, {selected, selectedNodes, node}) => {
  console.log(selectedKeys);
  console.log(node);
  console.log(selected);
  console.log('选中')
  // this.handleExpandKeys(node.key, selected)
 
  console.log('处理完毕');

  console.log(this.rcTreeRef.current)

  let currentTreeRef = this.rcTreeRef.current;
  let currentExpandKeys = currentTreeRef.state.expandedKeys;
  console.log('当前展开的keys');
  console.log(currentExpandKeys)

  console.log('当前选择的keys')
  console.log(currentTreeRef.state.selectedKeys);

  const {key} = node;
  let isExpanded = currentExpandKeys.find(item => item === key);
  let newKeys = isExpanded ? currentExpandKeys.filter(o => o !== key) : [...currentExpandKeys, key];
  console.log(newKeys)
  currentTreeRef.setExpandedKeys(newKeys);

  currentTreeRef.setUncontrolledState({selectedKeys: isExpanded ? [] : [key]});
  // this.setState({expandedKeys: newKeys});
  
}


handleExpandTreeNode = (selectedKeys, {expanded, node}) => {
  console.log("炸你开");
  this.handleExpandKeys(node.key, expanded)
  console.log('处理完毕');
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
      let treeItem = {
          key: node.id,
          name: node.name,
      }
      if (node.items) {
          treeItem.title = (
              <FolderItem 
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

getTreeData =() => {
  // big-data: generateData(1000, 3, 2)
  return [
    {
      key: '0',
      title: 'node 0',
      children: [
        { key: '0-0', title: 'node 0-0' },
        { key: '0-1', title: 'node 0-1' },
        {
          key: '0-2',
          title: 'node 0-2',
          children: [
            { key: '0-2-0', title: 'node 0-2-0' },
            { key: '0-2-1', title: 'node 0-2-1' },
            { key: '0-2-2', title: 'node 0-2-2' },
          ],
        },
        { key: '0-3', title: 'node 0-3' },
        { key: '0-4', title: 'node 0-4' },
        { key: '0-5', title: 'node 0-5' },
        { key: '0-6', title: 'node 0-6' },
        { key: '0-7', title: 'node 0-7' },
        { key: '0-8', title: 'node 0-8' },
        {
          key: '0-9',
          title: 'node 0-9',
          children: [
            { key: '0-9-0', title: 'node 0-9-0' },
            {
              key: '0-9-1',
              title: 'node 0-9-1',
              children: [
                { key: '0-9-1-0', title: 'node 0-9-1-0' },
                { key: '0-9-1-1', title: 'node 0-9-1-1' },
                { key: '0-9-1-2', title: 'node 0-9-1-2' },
                { key: '0-9-1-3', title: 'node 0-9-1-3' },
                { key: '0-9-1-4', title: 'node 0-9-1-4' },
              ],
            },
            {
              key: '0-9-2',
              title: 'node 0-9-2',
              children: [
                { key: '0-9-2-0', title: 'node 0-9-2-0' },
                { key: '0-9-2-1', title: 'node 0-9-2-1' },
              ],
            },
          ],
        },
      ],
    },
    {
      key: '1',
      title: 'node 1',
      // children: new Array(1000)
      //   .fill(null)
      //   .map((_, index) => ({ title: `auto ${index}`, key: `auto-${index}` })),
      children: [
        {
          key: '1-0',
          title: 'node 1-0',
          children: [
            { key: '1-0-0', title: 'node 1-0-0' },
            {
              key: '1-0-1',
              title: 'node 1-0-1',
              children: [
                { key: '1-0-1-0', title: 'node 1-0-1-0' },
                { key: '1-0-1-1', title: 'node 1-0-1-1' },
              ],
            },
            { key: '1-0-2', title: 'node 1-0-2' },
          ],
        },
      ],
    },
  ];
}




    render() {


      let items = {
        root: {
          index: 'root',
          hasChildren: true,
          children: ['child1', 'child2'],
          data: 'Root item',
        },
        child1: {
          index: 'child1',
          children: [],
          data: 'Child item 1',
        },
        child2: {
          index: 'child2',
          hasChildren: true,
          children: ['child3'],
          data: 'Child item 2',
        },
        child3: {
          index: 'child3',
          children: [],
          data: 'Child item 3',
        },
      };

      const {collectionData = [], expandedKeys = []} = this.state;
      

      if (collectionData.length >= 0) {
        
        items = {
          root: {
            index: 'root',
            hasChildren: true,
            children: collectionData.map(o => o.id),
            data: 'Root item'
          }
        }
        collectionData.forEach(o => {
          
          let children = o.items || [];
          items[o.id] = {
            index: o.id,
            data: o.name,
            children: children.map(child => child.id),
            hasChildren: children.length > 0
          };
          children.forEach(child => {
            items[child.id] = {
              index: child.id,
              data: child.name,
            }
          })

        })

        console.log(items);
      }
      const defaultExpandedKeys = ['0', '0-2', '0-9-2'];

      let treeData = collectionData.map(item => {
        return {
            key: item.id,
            name: item.name,
            className: 'collection-tree-collection-item-class',
            title: (
                <CollectionRCItem 
                    item={item} 
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
            ] : this.traverseCollectionItems(item.items, item.id)
        }
    })

    let dataProvider = new StaticTreeDataProvider(items, (item, data) => ({ ...item, data }));

            return (
              <Space direction="vertical" className="full-width">
                <div>测试tree性能</div>
                {/* <Tree 
                    className="collection-tree"
                    expandedKeys={expandedKeys}
                    height={800}
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
                /> */}


<RCTree
            defaultExpandAll={false}
            ref={this.rcTreeRef}
            defaultExpandedKeys={defaultExpandedKeys}
            // motion={motion}
            // style={{ border: '1px solid #000' }}
            treeData={treeData}
            switcherIcon={(obj) => {return obj.isLeaf ? false : (obj.expanded ? <CaretDownOutlined /> : <CaretRightOutlined  />)}}
// height={500}
            showIcon={false}
            className="collection-rc-tree"
                    // expandedKeys={expandedKeys}
                    draggable
                    // onExpand={this.handleExpandTreeNode}
                    onSelect={this.handleSelectTreeNode}
                    
          />
          {
            collectionData.length > 0 && (null

    //           <UncontrolledTreeEnvironment
    //   dataProvider={dataProvider}
    //   getItemTitle={item => (<div className="border">{item.data}</div>)}
    //   viewState={{}}
    // >
    //   <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    // </UncontrolledTreeEnvironment>

// <ControlledTreeEnvironment
// // dataProvider={dataProvider}
// items={items}
// getItemTitle={item => (<div className="border">{item.data}</div>)}
// onExpandItem={item => {
//   console.log('展开');
//   console.log(expandedKeys);
//   // this.setState({expandedKeys: [...expandedKeys, item.index]})
//   console.log(this.treeRef);
//   this.treeRef.renameItem(item.index, 'sdfds')
// }}
// onCollapseItem={item =>
//   {
//     this.setState({expandedKeys: expandedKeys.filter(expandedItemIndex => expandedItemIndex !== item.index)})
//   }
// }
// viewState={{
//   'tree-1': {
//     // focusedItem,
//     expandedItems: expandedKeys,
//     // selectedItems,
//   },
// }}
// >
// <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" ref={this.handleTreeRef} />
// </ControlledTreeEnvironment>

            )
          }


              </Space>
            )
    }
}

export default Home;




