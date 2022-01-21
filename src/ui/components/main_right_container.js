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
} from '@/utils/event_utils'
import {
  saveRequest, syncRequestInCollection
} from '@/utils/database_utils'
import {TabIconType, TabType, getIconByCode} from '@/enums'
import {UUID, compareObjectIgnoreEmpty, getSpecificFieldObj} from '@/utils/global_utils'

import RequestTabsTop from './request_tabs_top';
import RequestTabsMiddle from './request_tabs_middle';

import 'ui/style/request_tabs.css'

const { TabPane } = Tabs;
const  {Text} = Typography

class MainRightContainer extends React.Component {

  requestTabsMiddleRef = React.createRef();

  requestTabsTopRef = React.createRef();
  
  constructor(props) {
    super(props);
    this.state = {
      tabData: [],
    };
  }

  handleActiveTabChange = (activeTab) => {
    this.requestTabsMiddleRef.current.handleActiveTabChange(activeTab);

  }

  handleTabContentChange = (value) => {
    this.requestTabsTopRef.current.handleRequestTabContentChange(value)
  }

  handleSaveClick = (saveAs) => {
    this.requestTabsTopRef.current.handleSaveClick(saveAs)
  }

  render() {
    return (
      <div className="rightBox" style={{marginLeft: this.props.dynamicWidth}}>
        <RequestTabsTop 
          ref={this.requestTabsTopRef}
          onActiveTabChange={this.handleActiveTabChange}
        />
        <RequestTabsMiddle 
          ref={this.requestTabsMiddleRef}
          onTabContentChange={this.handleTabContentChange}
          onSaveClick={this.handleSaveClick}
        />
      </div>
    );
  }
}
export default MainRightContainer