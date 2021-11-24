import React from 'react';
import { Tabs, Typography, Space, Menu, Dropdown, Popover, Modal, Empty  } from 'antd';
import { ExclamationCircleOutlined , CaretRightOutlined, PlusOutlined, CaretDownFilled, PlusSquareFilled,SyncOutlined,
  ReadOutlined, SearchOutlined,EllipsisOutlined,
                    SettingFilled,NotificationFilled , EnvironmentFilled ,FolderViewOutlined ,DatabaseOutlined  , PullRequestOutlined  } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import RequestTabContent from './request_tab_content'
import EnvironmentSetting from './environment_setting';
import RequestTabConfirm from './request_tab_confirm';
import Ellipsis from 'react-ellipsis-component';
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
  publishRequestSave,
  publishRequestModalOpen,
  subscribeRequestDelete,
  listenShortcut
} from '@/utils/event_utils'
import {
  saveRequest, syncRequestInCollection
} from '@/utils/database_utils'
import {TabIconType, TabType, getIconByCode} from '@/enums'
import {UUID, compareObjectIgnoreEmpty, getSpecificFieldObj} from '@/utils/global_utils'
import 'ui/style/request_tabs.css'

const { TabPane } = Tabs;
const  {Text} = Typography

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
  
  /**
   * 处理activeTab的变更
   * @param {*} activeTab 
   * @param {*} refInfo 
   * @returns 
   */
  handleActiveTab = async (activeTab, refInfo) => {
    if (!activeTab) {
      this.setState({activeTabKey: null, requestInfo: null})
      return;
    }
    const {refId, type, id, draft = {}, name} = activeTab;
    let updateObj = {activeTabKey: id};
    switch (type) {
      case TabType.REQUEST.name(): 
        let requestMetaInfo = refInfo ? refInfo : (refId ? await queryRequestMetaById(refId) : {name: name})
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
      await this.addTabMeta({name: 'Untitled Request'})
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
    const {tabData, activeTabKey} = this.state;
    closeTabKey = closeTabKey || activeTabKey;
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
    const {icon, type, name, draft, refId, sourceDeleted} = sourceTab;
    if (sourceDeleted) {
      this.addTabMeta({icon: icon, type: type, name: name, draft: draft});
    } else {
      this.addTabMeta({icon: icon, type: type, name: name, draft: draft, refId: refId});
    }
    
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
      const notSavedCount = tabData.filter(item => item.draft).length;
      let doCloseAll = async () => {
        await multiUpdateTabMeta({closedAt: 0}, {$set: {closedAt: new Date().getTime()}});
        let currentAllClosedTabs = await querySortedTab({}, {closedAt: -1});
        if (currentAllClosedTabs.length >= 10) {
          await multiRemove({id: {$in: currentAllClosedTabs.slice(10).map(item => item.id)}})
        }
        this.setState({tabData: []});
        await this.handleActiveTab(null);
      }
      if (notSavedCount > 0) {
        Modal.confirm({
          title: 'CONFIRM FORCE CLOSE',
          icon: null,
          okText: 'Force Close',
          closable: true,
          content: (
            <Typography.Paragraph>
              {notSavedCount} tab has unsaved changes. Your changes will be lost if you force close this tab. Are you sure you want to force close?
            </Typography.Paragraph>
          ),
          onOk: doCloseAll
        })
      } else {
        await doCloseAll();
      }
    } else {
      this.reqeustTabConfirmRef.show(tabData);
    }
  }

  // 将tab下的草稿保存到request表中
  doSaveDraft = async (targetTab, extendDraft = {}) => {
    const {id: tabId, refId, type} = targetTab;
    // TODO: 需要判断tab类型
    let draft = targetTab.draft || {};
    let setObj = {...extendDraft, ...draft};
    await updateRequestMeta(refId, {$set: setObj});
    console.log('开始同步集合信息');
    console.log(setObj);
    if (setObj.method) {
      console.log('同步集合信息=============');
      await syncRequestInCollection(refId, 'method', setObj.method);
      publishRequestSave({metaData: {}})
    }
    await updateTabMeta(tabId, {$unset: {draft: true, conflict: true, sourceDeleted: true}});
    await multiUpdateTabMeta({ $not: { id: tabId }, $and: [{refId: refId}, {type: type}], draft: { $exists: true } }, {$set: {conflict: true}});
  }

  handleSaveDraft = async (tabInfo, justSave, extendDraft) => {
    const {id} = tabInfo;
    await this.doSaveDraft(tabInfo, extendDraft);
    if (justSave) {
      await this.refreshData()
      return;
    }
    await this.doCloseTab(id);
  }

  handleRequestSave = async (msg, {metaData, extend = {}}) => {
    const {id, name} = metaData;
    if (!id) return;
    let requestInfoId = id;
    if (extend.hasOwnProperty('justSave')) {
      // 通过弹框的另存为的请求，需要将tab的草稿内容更新到该请求上，并且更新该tab的refId
      const {justSave, tabInfo} = extend;
      await updateTabMeta(tabInfo.id, {$set: {refId: id, name: name}});
      let extendDraft = tabInfo.refId ? await queryRequestMetaById(tabInfo.refId) : {};
      const {url, method, body, header, auth, prerequest, test, param} = extendDraft;
      await this.handleSaveDraft({...tabInfo, refId: id}, justSave, {
          url: url,
          method: method,
          body: body,
          header: header,
          auth: auth,
          prerequest: prerequest,
          test: test, 
          param: param
      });
      requestInfoId = tabInfo.refId;
    } else {
      // 普通的修改请求，只需更新tab的name即可
      await multiUpdateTabMeta({refId: id, type: TabType.REQUEST.name()}, {$set: {name: name}});
      await this.refreshData();
    }
    const {requestInfo} = this.state;
    if (requestInfo && (requestInfo.id === requestInfoId)) {
      let newRequestMetaInfo = await queryRequestMetaById(id);
      this.setState({requestInfo: newRequestMetaInfo})
    }

  }

  // 将请求另存为
  handleSaveAs = (tabInfo, justSave) => {
    const {name, icon} = tabInfo;
    let obj = {metaData: {name: name, method: icon}};
    if (justSave !== undefined) {
      obj.extend = {justSave: justSave, tabInfo: tabInfo};
    }
    publishRequestModalOpen(obj)
  }

  // 处理弹框中的保存
  handleConfirmSave = async (tabInfo, justSave) => {
    const {sourceDeleted, refId} = tabInfo;
    if (sourceDeleted || !refId) {
      this.handleSaveAs(tabInfo, justSave)
      return;
    }
    await this.handleSaveDraft(tabInfo, justSave)
  }

  // 不保存
  handleNotSave = async (tabInfo, justSave) => {
    if (justSave) {
      return;
    }
    await this.doCloseTab(tabInfo.id)
  }

  // 保存当前tab
  handleSaveCurrent = async () => {
    const {activeTabKey, tabData} = this.state;
    if (!activeTabKey) return;
    let targetTab = tabData.find(item => item.id === activeTabKey);
    if (targetTab.sourceDeleted) {
      this.handleSaveAs(targetTab, true);
    } else if (targetTab.conflict) {
      this.reqeustTabConfirmRef.show([targetTab], true);
    } else if (!targetTab.refId) {
      this.handleSaveAs(targetTab, true)
    } else {
      await this.doSaveDraft(targetTab);
      await this.refreshData();
    }
  }
  
  // 处理请求删除
  handleRequestDelete = async (msg, {id}) => {
    await multiUpdateTabMeta({refId: id, type: TabType.REQUEST.name()}, {$set: {sourceDeleted: true}});
    const {requestInfo} = this.state;
    await this.refreshData(requestInfo && requestInfo.id === id ? {requestInfo: {...requestInfo, deleted: true}} : {});
  }

  componentDidMount = async () => {
    let tabData = await this.refreshData();
    if (tabData.length > 0) {
      await this.handleActiveTab(tabData[0])
    }
    subscribeNewTabOpen(this.addRequestTab)
    subscribeRequestSelected(this.handleRequestSelected)
    subscribeRequestSave(this.handleRequestSave)
    subscribeRequestDelete(this.handleRequestDelete)
    listenShortcut('saverequest', this.handleSaveCurrent)
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
  
  renderTabBar = (props, DefaultTabBar) => {
    
    return (
      <DefaultTabBar {...props} >
        {
          node => {
            let finalNode = node;
            const {tabData, activeTabKey} = this.state;
            const {key} = node;
            if (node.ref.current) {
            node.ref.current.style.maxWidth = '220px'
            let style = {
                height: 2, 
                borderLeft: '1px solid #f0f0f0', 
                borderRight: '1px solid #f0f0f0', 
                position: 'absolute', bottom: 0, 
                width: window.getComputedStyle(node.ref.current).width
              };
              if (activeTabKey === key) {
                style.background = '#fafafa';
              }
              finalNode = (
                <div>
                  {node}
                  <div style={style} />
                </div>
              )
            }
            const targetNode = tabData.find(item => item.id === key);
              return (
                <WrapTabNode key={key} index={key} moveTabNode={this.moveTabNode}>
                  <div style={{marginRight: 2}}>
                    <Dropdown 
                      overlay={(
                        <Menu onClick={({key: menuKey}) => this.handleRequestTabItemMenuClick(menuKey, key)}>
                          {
                            this.requestItemMenuArr.map((item => (
                              <Menu.Item key={item.key}>{item.label}</Menu.Item>
                            )))
                          }
                        </Menu>
                      )} 
                      trigger={['contextMenu']}>
                      {
                        targetNode && (targetNode.conflict || targetNode.sourceDeleted) ? (
                          <Popover 
                            content={
                              <div style={{width: 300}}>
                                {
                                  targetNode.sourceDeleted ? (
                                    <>
                                      <div>DELETED</div>
                                      <div>This {targetNode.type === TabType.REQUEST.name() ? 'request' : 'example'} has been deleted</div>
                                    </>
                                  ) : (
                                    <>
                                      <div>CONFLICT</div>
                                      <div>This {targetNode.type === TabType.REQUEST.name() ? 'request' : 'example'} has been modified since you last opened this tab</div>
                                    </>
                                  )
                                }
                              </div>
                            } 
                            title={<Typography.Title level={5}>{targetNode.name}</Typography.Title>}>
                              {finalNode}
                          </Popover>
                        ) : finalNode
                      }
                    </Dropdown>
                  </div>
                </WrapTabNode>
              )
          }
        }
      </DefaultTabBar>
    )
  }

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
      danger: true,
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
      danger: true,
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

  removeUndefinedValue = (obj) => {
    let result = {};
    Object.keys(obj).forEach(key => {
      let value = obj[key];
      if (value !== undefined) {
        result[key] = value;
      }
    })
    return result;
  }

  removeTargetField = (obj, deleteField) => {
    let newKeys = Object.keys(obj).filter(key => deleteField !== key);
    let result = {};
    newKeys.forEach(key => {
      result[key] = obj[key];
    })
    return result;
  }

  handleRequestTabContentSave = async (value, saveTabData) => {
    const {requestInfo, activeTabKey, tabData: oldTabData} = this.state;
    let tabData = saveTabData || oldTabData
    if (value.hasOwnProperty('name')) {
      await saveRequest({id: requestInfo.id, ...value});
      publishRequestSave({metaData: {id: requestInfo.id, name: value.name}});
      return;
    } else if (value.hasOwnProperty('description')) {
      await updateRequestMeta(requestInfo.id, {$set: value})
    } else {
      const activeTab = tabData.find(item => item.id === activeTabKey);
      let updateDraft = activeTab.draft;
      console.log('baocun=================');
      console.log(updateDraft);
      if (updateDraft) {
        let setObj = {draft: updateDraft};
        if (value.hasOwnProperty('method')) {
          setObj.icon = value.method;
        }
        await updateTabMeta(activeTabKey, {$set: setObj})
      } else {
        let updateObj = {$unset: {draft: true}};
        if (value.hasOwnProperty('method')) {
          updateObj = {
            ...updateObj,
            $set: {icon: value.method}
          };
        }
        await updateTabMeta(activeTabKey, updateObj)
      }
    }
  }

  handleRequestTabContentChange = async (value, saveFlag) => {
    console.log('病根传过来的参数：');
    console.log(value);
    const {requestInfo, activeTabKey, tabData} = this.state;
    this.setState({requestInfo: {...requestInfo, ...value}});
    if (!(value.hasOwnProperty('name') || value.hasOwnProperty('description'))) {
      let targetTab = tabData.find(item => item.id === activeTabKey);
      console.log('目标对象===================');
      console.log(targetTab);
      let {draft = {}} = targetTab;
      let newDraft = {...draft, ...value};
      let preRequestInfo = targetTab.refId ? await queryRequestMetaById(targetTab.refId) : {method: 'get'};
      let oldDraft = getSpecificFieldObj(preRequestInfo, Object.keys(value))
      console.log('老的草稿');
      console.log(oldDraft);
      console.log('心得草稿');
      console.log(newDraft);
      if (compareObjectIgnoreEmpty(newDraft, oldDraft)) {
        console.log('是否香港等=====');
        targetTab = this.removeTargetField(targetTab, 'draft')
      } else {
        targetTab.draft = newDraft;
      }
     

      console.log('最后的targetTab');
      console.log(targetTab);
      console.log('===变更后的tabdata纸==');
      console.log(tabData);
      if (value.method) {
        targetTab.icon = value.method;
      }
      tabData[tabData.findIndex(item => item.id === activeTabKey)] = targetTab;
      this.setState({tabData: tabData});
      if (saveFlag) {
        this.handleRequestTabContentSave(value, tabData);
      }
      
    }
  }

  handleSaveClick = (saveAs) => {
    if (saveAs) {
      const {tabData, activeTabKey} = this.state;
      let targetTab = tabData.find(item => item.id === activeTabKey);
      this.handleSaveAs(targetTab, true);
    } else {
      this.handleSaveCurrent()
    }
  }

  render() {
    const { tabData, activeTabKey, recentClosedTabs = [], requestInfo } = this.state;
    return (
      <>
        <RequestTabConfirm 
          ref={this.reqeustTabConfirmRef} 
          onSave={this.handleConfirmSave}
          onSaveAs={this.handleSaveAs}
          onNotSave={this.handleNotSave}
          onCancel={this.handleCancel}
        />
      
        <DndProvider backend={HTML5Backend}>
          <Tabs 
            id="request-tabs-id"
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
                        <Menu.Item 
                          key={item.key}
                          danger={item.danger && tabData.length > 0}
                          disabled={tabData.length === 0}>
                          {item.label}
                        </Menu.Item>
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
                    <Space className="vertical-center" align="center">
                      {
                        item.conflict && (
                          <Typography.Text>[CONFLICT]</Typography.Text>
                        )
                      }
                      {
                        item.sourceDeleted && (
                          <Typography.Text>[DELETED]</Typography.Text>
                        )
                      }
                      <div className="vertical-end" style={{marginTop: 2}}>
                        {getIconByCode((item.draft && item.draft.method) ? item.draft.method : item.icon)}
                      </div>
                      <div className="vertical-start">
                        <Ellipsis text={item.name} />
                      </div>
                      <div className="vertical-end request-tab-right-icon" style={{marginTop: 2}}>
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
                      </div>
                    </Space>
                  )} 
                  key={item.id}>
                  
                </TabPane>
              ))
          
            }
          </Tabs>
        </DndProvider>

        {
          tabData.length === 0 ? (
            <Empty style={{height: 'calc(100% - 35px)'}} className="flex-direction-column vertical-center horizontal-center" 
              description={
                <Typography.Title type="secondary" level={5}>
                  Hit Ctrl + T to open a new request or select a new request from the sidebar
                </Typography.Title>
              }
            />
          ) : (
            <div style={{height: 'calc(100% - 35px)',  overflowY: 'scroll', overflowX: 'hidden', paddingBottom: 20}} className="request-tab-content">
              {
                requestInfo && (
                  <RequestTabContent 
                    value={requestInfo} 
                    onSave={this.handleRequestTabContentSave}
                    onSaveClick={this.handleSaveClick}
                    onChange={this.handleRequestTabContentChange}
                  />
                )
              }
              {/* <div style={{height: 900}}></div> */}
            </div>
            
          )
        }
        
        
        
        
      </>
    );
  }
}
export default DraggableTabs