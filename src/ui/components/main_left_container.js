import React from 'react';
import { 
    Layout, Menu, 
    Space,Row, Col ,
    Tabs, Input,Tree, Select, Button
} from 'antd';
import { PlusOutlined, SearchOutlined,} from '@ant-design/icons';
import CollectionModal from 'ui/components/collection_modal'
import TooltipButton from 'ui/components/tooltip_button';
import LayoutHeader from 'ui/components/layout_header'
import CollectionRCTree from 'ui/components/collection_rc_tree'
import ResponseTab from 'ui/components/response_tab'

import MainRightContainer from 'ui/components/main_right_container';
import { setTheme } from '@/utils/style_utils';
import {Rnd} from 'react-rnd';
import {ADD_ICON} from 'ui/constants/icons'
import {publishCollectionModalOpen, subscribeThemeChange} from '@/utils/event_utils'
import {setStoreValue, getStoreValue} from '@/utils/store_utils'
import 'ui/style/common.css'
import 'ui/style/layout.css'
import 'ui/style/global.css'

import 'react-toastify/dist/ReactToastify.css';
import PostmanSDK from 'postman-collection'

import { ToastContainer, toast } from 'react-toastify';

const {PropertyList, QueryParam, Url, RequestAuth, VariableScope, EventList, Even, Collection} = PostmanSDK;

const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const { DirectoryTree } = Tree;
const {Option} = Select;

class MainLeftContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          width: getStoreValue('leftSideBarWidth', 280),
          tabActiveKey: 'collections',
          
          // snippetContainerHeight: 200,
          // outContainerHeight: 350, 
          // dynamicWidth: 350
        }
    }

    

    handleResizeStop = (e, direction, ref, delta, position) => {
      let newWidth = this.state.width + delta.width;
      this.setState({
        width: newWidth
      });
      setStoreValue('leftSideBarWidth', newWidth);
    }

  handleResize = (e, direction, ref, delta, position) => {
    // console.log(delta.width);
      let newWidth = this.state.width + delta.width;
      // this.setState({dynamicWidth: newWidth });
      console.log(newWidth)
      // if (newWidth < 200) {
      //   return;
      // }
      this.props.onResize(newWidth)
  }



    handleWindowResize = (e) => {
      console.log(document.body.clientHeight);
      this.setState({contentWidth: e.target.innerWidth - this.state.width, collectionTreeHeight: document.body.clientHeight - 240})
    }

    componentDidMount() {
     
    }

    handleNewCollectionClick = () => {
      publishCollectionModalOpen();
    }

    handleTabChange = (key) => {
      this.setState({tabActiveKey: key})
    }

    render() {

      const {dynamicWidth} = this.props;
      const {tabActiveKey, } = this.state;
        return (

          
          <Rnd  
          style={{zIndex: 11}}
          // minHeight={300}
          // maxHeight={600}
          minWidth={250}
          maxWidth={500}
          disableDragging
          enableResizing={{ 
              top:false, right:true, 
              bottom:false, left:false, 
              topRight:false, bottomRight:false, 
              bottomLeft:false, topLeft:false 
          }}
          size={{ width: dynamicWidth, height: '100%' }}
          onResizeStop={this.handleResizeStop}
          onResize={this.handleResize}>
            <div className="leftBox" style={{boxShadow: '5px 0px 5px -5px #888888', 
            width: dynamicWidth, 
            display: dynamicWidth === 0 ? 'none' : 'unset',
            // minWidth: 300,
          }}>

                <Row style={{padding: '10px 10px 0px 10px'}}>
                  <Col span={24}>
                    <Input style={{borderRadius:'20px'}} placeholder="Filter" prefix={<SearchOutlined />} />
                  </Col>
                </Row>

                <Tabs 
                  defaultActiveKey="collections" 
                  className="common-tabs-class left-side-tabs"
                  onChange={this.handleTabChange} 
                  tabBarStyle={{width: '100%'}}  >
                  <TabPane tab="History" key="history" />
                    
                  <TabPane tab="Collections" key="collections" />
                    
                  <TabPane tab="APIs" key="apis" />
                </Tabs>

                {
                  tabActiveKey === 'collections' && (
                    <Space className="justify-content-space-between" style={{margin: '8px 0px'}}>
                          <TooltipButton 
                            label="New Collection"
                            onClick={this.handleNewCollectionClick}
                            tooltipProps={{title: 'Create new Collection'}}
                            buttonProps={{icon: ADD_ICON, type: 'link'}}
                          />
                          <TooltipButton 
                            label="Trash" 
                            tooltipProps={{title: "Recover your deleted collections"}}
                            buttonProps={{type: 'text'}}
                          />

                        </Space>
                  )
                }

                
                <div style={{height: 'calc(100% - 140px)',  overflowY: 'auto', overflowX: 'hidden', paddingBottom: 20}} >
                  {
                    tabActiveKey === 'collections' && (
                      <>
                        <CollectionRCTree 
                          // height={this.state.collectionTreeHeight} 
                        />
                      </>
                    )
                  }
                </div>
                
            </div>
          </Rnd>
            
        )
    }
}

export default MainLeftContainer;




