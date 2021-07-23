import React from 'react';
import { Tabs, Button, Space, Menu, Dropdown, Modal  } from 'antd';
import { ExclamationCircleOutlined , CaretRightOutlined, PlusOutlined, CaretDownFilled, PlusSquareFilled,SyncOutlined,
  ReadOutlined, SearchOutlined,EllipsisOutlined,
                    SettingFilled,NotificationFilled , EnvironmentFilled ,FolderViewOutlined ,DatabaseOutlined  , PullRequestOutlined  } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import EnvironmentSetting from './environment_setting';
import RequestTabConfirm from './request_tab_confirm';
import { UNSAVED_DOT_ICON, POST_REQUEST_ICON, GET_REQUEST_ICON, CLOSE_SVG, UNSAVED_DOT_SVG } from 'ui/constants/icons'

import 'ui/style/request_tabs.css'

const { TabPane } = Tabs;

// Drag & Drop node
class TabNode extends React.Component {
  render() {
    const { connectDragSource, connectDropTarget, children } = this.props;
    return connectDragSource(connectDropTarget(children));
  }
}

const cardTarget = {
  drop(props, monitor) {
    const dragKey = monitor.getItem().index;
    const hoverKey = props.index;

    if (dragKey === hoverKey) {
      return;
    }

    props.moveTabNode(dragKey, hoverKey);
    monitor.getItem().index = hoverKey;
  },
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const WrapTabNode = DropTarget('DND_NODE', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(
  DragSource('DND_NODE', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(TabNode),
);

class DraggableTabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabData: [
        {
          id: '111',
          name: '增加接口',
          method: 'POST',
          key: '111',
        },
        {
          id: '112',
          name: '删除接口',
          method: 'POST',
          unSaved: true,
          key: '112',
        },
        {
          id: '113',
          name: '修改接口',
          method: 'POST',
          key: '113',
        },
        {
          id: '114',
          name: '查询接口',
          method: 'GET',
          key: '114'
        },
      ],
      activeTabKey: '111'
    };
  }
  
  // 移动tab
  moveTabNode = (dragKey, hoverKey) => {
    const {tabData} = this.state;
    const dragIndex = tabData.findIndex(item => item.key === dragKey);
    const hoverIndex = tabData.findIndex(item => item.key === hoverKey);
    const dragNode = tabData[dragIndex];
    tabData[dragIndex] = tabData[hoverIndex];
    tabData[hoverIndex] = dragNode;
    this.setState({
      tabData: tabData,
    });
  };

  // 新增tab
  handleAddTabClick = () => {
    let newTab = {
      key: new Date().getTime() + '',
      name: '新增tab' + (this.state.tabData.length + 1),
      method: "GET"
    }
    const {tabData} = this.state;
    tabData.push(newTab);
    this.setState({tabData: tabData, activeTabKey: newTab.key});
  }

  // 关闭tab
  handleCloseTabClick = (closeTabKey, isForced = false) => {
    const {tabData} = this.state;
    if (isForced) {
      this.setState({tabData: tabData.filter(item => item.key !== closeTabKey)});
      return;
    }
    const targetTab = tabData.find(tab => tab.key === closeTabKey);
    if (targetTab.unSaved) {
      this.reqeustTabConfirmRef.show(targetTab);
    } else {
      this.setState({tabData: tabData.filter(item => item.key !== closeTabKey)});
    }
  }

  // 点击tab变更
  handleRequestTabChange = (activeTabKey) => {
    this.setState({activeTabKey: activeTabKey})
  }

  menu = (
    <Menu onClick={this.handleMenuClick}>
      <Menu.SubMenu key="sub1" title="Recently Closed">
      <Menu.Item key="1">Option 1</Menu.Item>
          <Menu.Item key="2">Option 2</Menu.Item>
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="11">Duplicate Current Tab</Menu.Item>
      <Menu.Item key="12">Close Current Tab</Menu.Item>
      <Menu.Item key="13">Force Close Current Tab</Menu.Item>
      <Menu.Item key="111">Close All but Current Tab</Menu.Item>
      <Menu.Item key="112">Close All Tabs</Menu.Item>
      <Menu.Item key="113">Force Close All Tabs</Menu.Item>
    </Menu>
  )

  // 重复tab
  handleDuplicateTab = (key) => {
    const {tabData} = this.state;
    const sourceTab = tabData.find(tab => tab.key === key);
    let newKey = sourceTab.key + new Date().getTime();
    tabData.push(
      {
        ...sourceTab,
        key: newKey,
      }
    )
    this.setState({tabData: tabData, activeTabKey: newKey})
  }

  handleCloseOtherTabs = (key) => {
    const {tabData} = this.state;
    this.setState({tabData: tabData.filter(tab => tab.key === key), activeTabKey: key})
  }

  handleCloseAllTabs = (key) => {
    this.setState({tabData: [], activeTabKey: null})
  }

  requestItemMenuArr = [
    {
      key: 'duplicate_tab',
      label: 'Duplicate Tab',
      event: this.handleDuplicateTab
    },
    {
      key: 'close',
      label: 'Close',
      event: this.handleCloseTabClick
    },
    {
      key: 'force_close',
      label: 'Force Close',
      event: (tabKey) => this.handleCloseTabClick(tabKey, true)
    },
    {
      key: 'close_other_tabs',
      label: 'Close Other Tabs',
      event: this.handleCloseOtherTabs
    },
    {
      key: 'close_all_tabs',
      label: 'Close All Tabs',
      event: this.handleCloseAllTabs
    },
    {
      key: 'force_close_all_tabs',
      label: 'Force Close All Tabs',
      event: this.handleCloseAllTabs
    }
  ]

  handleRequestTabItemMenuClick = (menuKey, tabKey) => {
    const menuItem = this.requestItemMenuArr.find(item => item.key === menuKey);
    menuItem.event(tabKey)
  }

  renderTabBar = (props, DefaultTabBar) => (
      <DefaultTabBar {...props} >
      {
        node => {
            return (
              <WrapTabNode key={node.key} index={node.key} moveTabNode={this.moveTabNode}>
                <div style={{marginRight: 2}}>
                <Dropdown 
                overlay={(
                  <Menu onClick={({key}) => this.handleRequestTabItemMenuClick(key, node.key)}>
                    {
                      this.requestItemMenuArr.map((item => (
                        <Menu.Item key={item.key}>{item.label}</Menu.Item>
                      )))
                    }
                  </Menu>
                )} 
                trigger={['contextMenu']}>
                  {node}
                </Dropdown>
                </div>
                
                {/* {node} */}
              </WrapTabNode>
            )
        }
      }
    </DefaultTabBar>
  )

  reqeustTabConfirmRef = (ref) => {
    if (!ref) {
      return
    }
    this.reqeustTabConfirmRef = ref;
  }

  render() {
    const { tabData, activeTabKey } = this.state;

    
    return (
      <>
      <RequestTabConfirm ref={this.reqeustTabConfirmRef} />
     
      <DndProvider backend={HTML5Backend}>
        <Tabs 
          activeKey={activeTabKey}
          className="request-tabs-class"
          type="editable-card" 
          addIcon={(
            <Dropdown.Button 
              overlay={this.menu} 
              onClick={this.handleAddTabClick}
              className="request-tabs-add">
              <PlusOutlined />
            </Dropdown.Button>
          )}
          onChange={this.handleRequestTabChange}
          renderTabBar={this.renderTabBar} 
          tabBarExtraContent={{
            right: <EnvironmentSetting />,
          }} 
          >
          {
            tabData.map((item, index) => (
              <TabPane
                closeIcon={<></>} 
                tab={(
                  <Space>
                    <span className="vertical-center">
                      {
                        item.method === 'GET' ? GET_REQUEST_ICON : POST_REQUEST_ICON
                      }
                    </span>
                    <span>{item.name}</span>
                    <span className="vertical-center request-tab-right-icon">
                      {
                        item.unSaved && (
                          <Icon className="unsaved-dot-icon" component={() => UNSAVED_DOT_SVG} />
                        )
                      }
                      <Icon 
                        className={item.unSaved ? "close-tab-icon-none" : "close-tab-icon-hide"} 
                        component={() => CLOSE_SVG} 
                        onClick={() => this.handleCloseTabClick(item.key)} 
                      />
                    </span>
                  </Space>
                )} 
                key={item.key}>
                
              </TabPane>
            ))
        
          }
        </Tabs>
      </DndProvider>
      </>
    );
  }
}
export default DraggableTabs