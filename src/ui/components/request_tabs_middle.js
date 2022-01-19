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

class RequestTabsMiddle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleActiveTabChange = async (activeTab, refInfo) => {

    let newstate = {activeTab: activeTab};
    if (activeTab) {
      const {refId, type, draft = {}, name} = activeTab;
      switch (type) {
        case TabType.REQUEST.name(): 
          let requestMetaInfo = refInfo ? refInfo : (refId ? await queryRequestMetaById(refId) : {name: name})
          newstate.requestInfo = {...requestMetaInfo, ...draft};
          break;
        default: break;
      }
    }

    this.setState(newstate)

  }

  handleRequestTabContentChange = async (value) => {
    this.props.onTabContentChange(value);
    const {requestInfo} = this.state;
    this.setState({requestInfo: {...requestInfo, ...value}});
  }

  handleRequestTabContentSave = async (value) => {
    const {requestInfo, activeTab} = this.state;

    const {activeTabKey} = activeTab;

    // tab下方的请求名称和详情直接保存至元数据，不存为草稿
    if (value.hasOwnProperty('name')) {
      await saveRequest({id: requestInfo.id, ...value});
      publishRequestSave({metaData: {id: requestInfo.id, name: value.name}});
    } else if (value.hasOwnProperty('description')) {
      await updateRequestMeta(requestInfo.id, {$set: value})
    } else {
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
    this.setState({requestInfo: {...requestInfo, ...value}});
  }

  render() {
    const { activeTab, requestInfo } = this.state;
    return (
      <>
        {
          activeTab ? (
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
          ) : (
            <Empty style={{height: 'calc(100% - 35px)'}} className="flex-direction-column vertical-center horizontal-center" 
              description={
                <Typography.Title type="secondary" level={5}>
                  Hit Ctrl + T to open a new request or select a new request from the sidebar
                </Typography.Title>
              }
            />
            
          )
        }
      </>
    );
  }
}
export default RequestTabsMiddle