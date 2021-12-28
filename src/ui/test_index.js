import React from 'react';
import { 
    Layout, Menu, 
    Space,Row, Col ,Input,Button,
    Tabs, Table, Select, Typography
} from 'antd';
import { PlusOutlined, SearchOutlined,} from '@ant-design/icons';
import CollectionModal from 'ui/components/collection_modal'
import TooltipButton from 'ui/components/tooltip_button';
import RequestTabs from 'ui/components/request_tabs'
import LayoutHeader from 'ui/components/layout_header'
import CollectionTree from 'ui/components/collection_tree'
import ResponseTab from 'ui/components/response_tab'
import Upload from 'rc-upload'
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




import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'




import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';


import 'ui/style/common.css'
import 'ui/style/layout.css'
import 'ui/style/global.css'
import 'ui/style/test.css'





import RCTree from 'rc-tree';

import 'rc-tree/assets/index.css'

const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const {Option} = Select;

const {Text, Link} = Typography

class Home extends React.Component {
  mdEditor = null
  mdParser = null
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
      // alert(document.getElementById( "test-scroll").scrollHeight)
      // document.getElementById("test-scroll").style.height = document.getElementById( "test-scroll").scrollHeight + 1 +"px";
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


handleProgress = (obj) => {
  console.log(obj);
}

handleChange = () => {
  // alert('sdf')
}

setText = (value) => {
  this.setState({ text: value})
}

handleImageUpload(file, callback) {
  const reader = new FileReader()
  reader.onload = () => {      
    const convertBase64UrlToBlob = (urlData) => {  
      let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {type:mime})
    }
    const blob = convertBase64UrlToBlob(reader.result)
    setTimeout(() => {
      // setTimeout 模拟异步上传图片
      // 当异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
      callback('https://avatars0.githubusercontent.com/u/21263805?s=40&v=4')
    }, 1000)
  }
  reader.readAsDataURL(file)
}


    render() {



      return (
        <div className="demo-wrap">
         
         
        </div>
      );





      
    }
}

export default Home;




