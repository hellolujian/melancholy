import React from 'react';
import { Tabs, Button, Space, Menu, Dropdown, Modal  } from 'antd';
import { ExclamationCircleOutlined , CaretRightOutlined, PlusOutlined, CaretDownFilled, PlusSquareFilled,SyncOutlined,
  ReadOutlined, SearchOutlined,EllipsisOutlined,
                    SettingFilled,NotificationFilled , EnvironmentFilled ,FolderViewOutlined ,DatabaseOutlined  , PullRequestOutlined  } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import RequestTabContent from './request_tab_content'
import EnvironmentSetting from './environment_setting';
import RequestTabConfirm from './request_tab_confirm';
import { UNSAVED_DOT_ICON, POST_REQUEST_ICON, GET_REQUEST_ICON, CLOSE_SVG, UNSAVED_DOT_SVG } from 'ui/constants/icons'

import {
  insertTabMeta, 
  multiRemove, 
  removeTabMetaById, 
  queryTabMeta, 
  queryTabMetaById,
  updateTabMeta, 
  querySortedTab, 
  multiUpdateTabMeta} from '@/database/tab_meta'
import {queryRequestMetaById, insertRequestMeta, updateRequestMeta} from '@/database/request_meta'
import {
  subscribeRequestSelected,
  subscribeNewTabOpen,
  subscribeRequestSave,
  publishRequestSave
} from '@/utils/event_utils'
import {
  saveRequest,
} from '@/utils/database_utils'
import {TabIconType, TabType, getIconByCode} from '@/enums'
import {UUID} from '@/utils/global_utils'
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
      tabData: [],
    };
  }

  reqeustTabConfirmRef = (ref) => {
    if (!ref) {
      return
    }
    this.reqeustTabConfirmRef = ref;
  }
  
  handleActiveTab = async (activeTab, refInfo) => {
    if (!activeTab) {
      this.setState({activeTab: null, requestInfo: null})
      return;
    }
    const {refId, type, id, draft = {}} = activeTab;
    let updateObj = {activeTabKey: id};
    switch (type) {
      case TabType.REQUEST.name(): 
        let requestMetaInfo = refInfo ? refInfo : await queryRequestMetaById(refId)
        updateObj.requestInfo = {...requestMetaInfo, ...draft};
        break;
      default: break;
    }
    this.setState(updateObj);
  }

  // 刷新数据
  refreshData = async (obj = {}) => {
    let allTabData = await queryTabMeta();
    let showTabData = allTabData.filter(item => item.closedAt === 0).sort((a, b) => {
      if (a.sequence === b.sequence) {
        return a.createdAt <= b.createdAt ? -1 : 1;
      }
      return a.sequence - b.sequence;
    });
    let closedTabs = allTabData.filter(item => item.closedAt > 0).sort((a, b) => a.closedAt > b.closedAt ? -1 : 1);
    this.setState({tabData: showTabData, recentClosedTabs: closedTabs, ...obj});
    return showTabData;
  }

  // 添加tab元数据记录
  addTabMeta = async (obj = {}) => {
    let newTab = {
      icon: TabIconType.GET.code,
      type: TabType.REQUEST.name(),
      closedAt: 0,
      sequence: new Date().getTime(),
      ...obj,
      id: UUID(),
    }
    await insertTabMeta(newTab);
    await this.refreshData({activeTabKey: newTab.id})
    await this.handleActiveTab(newTab);
  }

  // 添加默认tab(request tab)
  addRequestTab = async (msg, requestInfo) => {
    
    if (requestInfo) {
      const {id, method, name} = requestInfo;
      await this.addTabMeta({name: name, refId: id, icon: method});
    } else {
      let newRequest = {
        id: UUID(),
        name: 'Untitled Request',
        method: 'get',
      };
      await insertRequestMeta(newRequest);
      await this.addTabMeta({name: newRequest.name, refId: newRequest.id})
    }
    
  }

  // 点击tab变更
  handleTabChange = async (activeTabKey) => {
    const {tabData} = this.state;
    let targetTab = tabData.find(item => item.id === activeTabKey);
    await this.handleActiveTab(targetTab);
  }

  // 选中request事件
  handleRequestSelected = async (msg, requestId) => {
    let requestMetaInfo = await queryRequestMetaById(requestId);
    if (!requestMetaInfo) {
      return;
    }
    const {tabData} = this.state;
    let selectedTab = tabData.find(item => item.refId === requestId);
    if (selectedTab) {
      await this.handleActiveTab(selectedTab, requestMetaInfo)
    } else {
      const {name, method = 'get'} = requestMetaInfo;
      await this.addTabMeta({name: name, icon: method, refId: requestId});
    }
  }

  handleRequestSave = async (msg, data) => {
    const {id, name} = data;
    await multiUpdateTabMeta({refId: id, type: TabType.REQUEST.name()}, {$set: {name: name}})
    const {requestInfo} = this.state;
    this.refreshData(requestInfo && requestInfo.id === id ? {requestInfo: {...requestInfo, ...data}} : {});
  }

  componentDidMount = async () => {
    let tabData = await this.refreshData();
    if (tabData.length > 0) {
      await this.handleActiveTab(tabData[0])
    }
    subscribeNewTabOpen(this.addRequestTab)
    subscribeRequestSelected(this.handleRequestSelected)
    subscribeRequestSave(this.handleRequestSave)
  }

  // 执行关闭
  doCloseTab = async (id) => {
    let closedTabs = await querySortedTab({closedAt: {$gt: 0}}, {closedAt: -1});
    if (closedTabs.length >= 10) {
      await removeTabMetaById(closedTabs[9].id);
    }
    await updateTabMeta(id, {$set: {closedAt: new Date().getTime()}})
    const {activeTabKey} = this.state;
    let tabData = await this.refreshData();
    if (activeTabKey === id) {
      await this.handleActiveTab(tabData.length === 0 ? null : tabData[0])
    }
  }

  // 关闭tab
  handleCloseTabClick = async (closeTabKey, isForced = false) => {
    const {tabData} = this.state;
    if (isForced) {
      await this.doCloseTab(closeTabKey)
    } else {
      const targetTab = tabData.find(tab => tab.id === closeTabKey);
      if (targetTab.draft) {
        this.reqeustTabConfirmRef.show([targetTab]);
      } else {
        await this.doCloseTab(closeTabKey)
      }
    }
  }

  // 重复tab
  handleDuplicateTab = (key) => {
    const {tabData} = this.state;
    const sourceTab = tabData.find(tab => tab.id === key);
    const {icon, type, name} = sourceTab;
    this.addTabMeta({icon: icon, type: type, name: name})
  }

  // 关闭其他
  handleCloseOtherTabs = (key) => {
    const {tabData} = this.state;
    this.reqeustTabConfirmRef.show(tabData.filter(tab => tab.id !== key));
  }

  // 关闭所有
  handleCloseAllTabs = async (isForced = false) => {
    const {tabData} = this.state;
    if (isForced) {
      await multiUpdateTabMeta({closedAt: 0}, {$set: {closedAt: new Date().getTime()}});
      let currentAllClosedTabs = await querySortedTab({}, {closedAt: -1});
      if (currentAllClosedTabs.length >= 10) {
        await multiRemove({id: {$in: currentAllClosedTabs.slice(10).map(item => item.id)}})
      }
      this.setState({tabData: []});
      await this.handleActiveTab(null);
    } else {
      this.reqeustTabConfirmRef.show(tabData);
    }
  }

  handleSave = async (tabInfo) => {
    const {tabData} = this.state;
    let targetTab = tabData.find(item => item.id === tabInfo.id);
    await updateRequestMeta(targetTab.refId, {$set: targetTab.draft})
    await this.doCloseTab(tabInfo.id)
  }

  handleNotSave = async (tabInfo) => {
    await this.doCloseTab(tabInfo.id)
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
      event: () => this.handleCloseAllTabs(false)
    },
    {
      key: 'force_close_all_tabs',
      label: 'Force Close All Tabs',
      event: () => this.handleCloseAllTabs(true)
    }
  ]

  handleRequestTabItemMenuClick = (menuKey, tabKey) => {
    const menuItem = this.requestItemMenuArr.find(item => item.key === menuKey);
    menuItem.event(tabKey)
  }
  
  // 移动tab
  moveTabNode = async (dragKey, hoverKey) => {
    const {tabData} = this.state;
    const hoverNode = tabData.find(item => item.id === hoverKey);
    // 这里简单处理成被拖拽的那个tab的sequence-1小于原来的就行了
    await updateTabMeta(dragKey, {$set: {sequence: hoverNode.sequence - 1}})
    this.refreshData()
  };
  
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

  moreActionMenu = [
    {
      key: 'duplicate_tab',
      label: 'Duplicate Current Tab',
      event: this.handleDuplicateTab
    },
    {
      key: 'close',
      label: 'Close Current Tab',
      event: this.handleCloseTabClick
    },
    {
      key: 'force_close',
      label: 'Force Close Current Tab',
      event: (tabKey) => this.handleCloseTabClick(tabKey, true)
    },
    {
      key: 'close_other_tabs',
      label: 'Close All but Current Tab',
      event: this.handleCloseOtherTabs
    },
    {
      key: 'close_all_tabs',
      label: 'Close All Tabs',
      event: () => this.handleCloseAllTabs()
    },
    {
      key: 'force_close_all_tabs',
      label: 'Force Close All Tabs',
      event: () => this.handleCloseAllTabs(true)
    }
  ]
  
  handleMenuClick = async (key, keyPath) => {
    let firstKey = keyPath[0];
    if (firstKey === 'recently_closed') {
      let closedTabKey = keyPath[1];
      await updateTabMeta(closedTabKey, {$set: {closedAt: 0}});
      this.refreshData();
    } else {
      const menuItem = this.moreActionMenu.find(item => item.key === key);
      if (menuItem.event) {
        menuItem.event(this.state.activeTabKey)
      } 
    }
  }

  handleRequestTabContentChange = (value) => {
    const {requestInfo, activeTabKey, tabData} = this.state;
    this.setState({requestInfo: {...requestInfo, ...value}});
    if (!(value.hasOwnProperty('name') || value.hasOwnProperty('description'))) {
      let targetTab = tabData.find(item => item.id === activeTabKey);
      const {draft} = targetTab;
      if (draft) {
        let targetKey = Object.keys(value)[0];
        if (Object.keys(draft).length === 1 && draft.hasOwnProperty(targetKey)) {
          let targetValue = value[targetKey];
          let preValue = draft[targetKey]
          if (targetValue === preValue) {
            console.log("sdfffffff===========================")
            console.log(targetTab)
            delete targetTab.draft;
          }
        }
      } else {
        targetTab.draft = {...value};
      }
      this.setState({tabData: tabData});
      
    }
  }

  handleRequestTabContentSave = async (value) => {
    const {requestInfo, activeTabKey, tabData} = this.state;
    if (value.hasOwnProperty('name')) {
      await saveRequest({id: requestInfo.id, ...value});
      publishRequestSave({id: requestInfo.id, name: value.name})
    } else if (value.hasOwnProperty('description')) {
      await updateRequestMeta(requestInfo.id, {$set: value})
      this.setState({requestInfo: {...requestInfo, ...value}})
    } else {
      const activeTab = tabData.find(item => item.id === activeTabKey);
      let updateDraft = activeTab.draft;
      if (updateDraft) {
        await updateTabMeta(activeTabKey, {$set: {draft: {...updateDraft, ...value}}})
      } else {
        await updateTabMeta(activeTabKey, {$unset: {draft: true}})
      }
      
    }
    
  }

  render() {
    const { tabData, activeTabKey, recentClosedTabs = [], requestInfo } = this.state;
    return (
      <>
        <RequestTabConfirm 
          ref={this.reqeustTabConfirmRef} 
          onSave={this.handleSave}
          onNotSave={this.handleNotSave}
          onCancel={this.handleCancel}
        />
      
        <DndProvider backend={HTML5Backend}>
          <Tabs 
            activeKey={activeTabKey}
            className="request-tabs-class"
            type="editable-card" 
            addIcon={(
              <Dropdown.Button 
                overlay={(
                  <Menu onClick={({key, keyPath}) => this.handleMenuClick(key, keyPath)}>
                    <Menu.SubMenu key="recently_closed" title="Recently Closed">
                      {
                        recentClosedTabs.map(item => (
                          <Menu.Item key={item.id}>
                            <Space>
                              <span className="vertical-center">
                                {getIconByCode(item.icon)}
                              </span>
                              <span>
                                {item.name}
                              </span>
                            </Space>
                          </Menu.Item>
                        ))
                      }
                    </Menu.SubMenu>
                    {
                      this.moreActionMenu.map(item => (
                        <Menu.Item disabled={tabData.length === 0} key={item.key}>{item.label}</Menu.Item>
                      ))
                    }
                  </Menu>
                )} 
                onClick={this.addRequestTab}
                className="request-tabs-add">
                <PlusOutlined />
              </Dropdown.Button>
            )}
            onChange={this.handleTabChange}
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
                        {getIconByCode(item.icon)}
                      </span>
                      <span>{item.name}</span>
                      <span className="vertical-center request-tab-right-icon">
                        {
                          item.draft && (
                            <Icon className="unsaved-dot-icon" component={() => UNSAVED_DOT_SVG} />
                          )
                        }
                        <Icon 
                          className={item.draft ? "close-tab-icon-none" : "close-tab-icon-hide"} 
                          component={() => CLOSE_SVG} 
                          onClick={() => this.handleCloseTabClick(item.id)} 
                        />
                      </span>
                    </Space>
                  )} 
                  key={item.id}>
                  
                </TabPane>
              ))
          
            }
          </Tabs>
        </DndProvider>
        {
          requestInfo && (
            <RequestTabContent 
              value={requestInfo} 
              onSave={this.handleRequestTabContentSave}
              onChange={this.handleRequestTabContentChange}
            />
          )
        }
        
      </>
    );
  }
}
export default DraggableTabs