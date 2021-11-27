import React from 'react';
import { 
    Layout, Menu, 
    Space,Row, Col ,
    Tabs, Input,Tree, Select, Button
} from 'antd';
import { PlusOutlined, SearchOutlined,} from '@ant-design/icons';
import CollectionModal from 'ui/components/collection_modal'
import TooltipButton from 'ui/components/tooltip_button';
import RequestTabs from 'ui/components/request_tabs'
import LayoutHeader from 'ui/components/layout_header'
import CollectionRCTree from 'ui/components/collection_rc_tree'
import ResponseTab from 'ui/components/response_tab'

import {Rnd} from 'react-rnd';
import {ADD_ICON} from 'ui/constants/icons'
import {publishCollectionModalOpen} from '@/utils/event_utils'
import {getStoreValue} from '@/utils/store_utils'
import TextareaAutosize from "react-autosize-textarea"
import 'ui/style/common.css'
import 'ui/style/layout.css'
import 'ui/style/global.css'

import 'react-toastify/dist/ReactToastify.css';
import PostmanSDK from 'postman-collection'

import { ToastContainer, toast } from 'react-toastify';

const {PropertyList, QueryParam, Url} = PostmanSDK;

const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const { DirectoryTree } = Tree;
const {Option} = Select;

class Home extends React.Component {

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

    

    handleResizeStop = (e, direction, ref, delta, position) => {
      this.setState({
        width: this.state.width + delta.width
      });
    }

  handleResize = (e, direction, ref, delta, position) => {
    console.log(delta.width);
      let newWidth = this.state.width + delta.width;
      this.setState({dynamicWidth: newWidth });
  }



    handleWindowResize = (e) => {
      console.log(document.body.clientHeight);
      this.setState({contentWidth: e.target.innerWidth - this.state.width, collectionTreeHeight: document.body.clientHeight - 240})
    }

    componentDidMount() {
      let urlopt = Url.parse("https://localhost:8000/api/getuserInfo?");
      console.log(urlopt);
      let postmanUrl = new Url(urlopt);
      console.log('protocol :%s', postmanUrl.protocol)
      console.log("host: %s", postmanUrl.getHost())
      console.log('path: %s', postmanUrl.getPath())
      console.log('getpathwithquery: %s', postmanUrl.getPathWithQuery())
      console.log('getQueryString: %s', postmanUrl.getQueryString());
      console.log(postmanUrl.query);
      console.log('getRemote:%s', postmanUrl.getRemote());
      console.log('toString', postmanUrl.toString());
      console.log('toJson==========');
      console.log(postmanUrl);
      postmanUrl.query = new PropertyList();
      console.log('to_string: %s', postmanUrl.toString());

      console.log('new url');
      console.log(QueryParam.unparse([{disabled: true, key: 'hello', value: 'world'}, {key: 'name', value: 'lujian'}]));
      
      console.log(QueryParam.parse(""));
      // alert('来自渲染页面：' + getStoreValue('workspaceId'))
      this.setState({contentWidth: window.innerWidth - this.state.width})
      window.addEventListener('resize', this.handleWindowResize)
      
      // var url=require("url");//引入url模块
      // var result=url.parse("hello=world&name=lujian",true);
        
      //   console.log(result);

      
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize)
    }

    onResize = (event, {element, size, handle}) => {
      if (size.width < 250) {
        return;
      }
      this.setState({width: size.width, height: size.height});
    }

    handleSelectTreeNode = (selectedKeys, e) => {
      console.log(e);
      this.setState({expandedKeys: selectedKeys});
    }

    handleNewCollectionClick = () => {
      publishCollectionModalOpen();
    }

    handleTabChange = (key) => {
      this.setState({tabActiveKey: key})
    }

    render() {

      const {tabActiveKey, dynamicWidth} = this.state;
        return (

          <div id="rootPage">
            <ToastContainer />
            <LayoutHeader />
            <div class="mainBox">
                <Rnd  
                    style={{zIndex: 11}}
                    // minHeight={200}
                    // maxHeight={600}
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
                <div className="leftBox" style={{boxShadow: '5px 0px 5px -5px #888888', width: dynamicWidth}}>

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
                      {/* </StickyContainer> */}
                    </div>
                    
                </div>
                </Rnd>
                <div className="rightBox" style={{marginLeft: dynamicWidth}}>
                  {/* <div style={{width: 2000, height: 200, background: 'lightgray', left: 400, zIndex: 99999999}}>sdfsdf</div> */}
                <RequestTabs />
                </div>
            </div>
            <div className="bottom">底部，高度40px</div>
          </div>
            
        )
    }
}

export default Home;




