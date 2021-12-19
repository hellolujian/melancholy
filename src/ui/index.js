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

const {PropertyList, QueryParam, Url, RequestAuth, VariableScope, EventList, Even, Collection} = PostmanSDK;

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
      let urlopt = Url.parse("https://localhost:8000/api/getuserInfo");
      console.log(urlopt);
      let postmanUrl = new Url(urlopt);
      postmanUrl.addQueryParams({disabled: true, key: 'hello', value: 'world', description: 'sdfweertw'})
      postmanUrl.addQueryParams({key: 'hello11', value: 'world11'})
      // postmanUrl.query = new PropertyList(() => new QueryParam({key: 'hello', value: 'world'}));
      // postmanUrl.update({query: new PropertyList(new QueryParam({disabled: true, key: 'hello', value: 'world'}))})
      // console.log(new QueryParam({ key: 'hello', value: 'world'}));
      // console.log('protocol :%s', postmanUrl.protocol)
      // console.log("host: %s", postmanUrl.getHost())
      // console.log('path: %s', postmanUrl.getPath())
      // console.log('getpathwithquery: %s', postmanUrl.getPathWithQuery())
      // console.log('getQueryString: %s', postmanUrl.getQueryString());
      // console.log(postmanUrl.query);
      // console.log('getRemote:%s', postmanUrl.getRemote());
      // console.log('toString', postmanUrl.toString());
      console.log(postmanUrl);
      console.log('toJson==========');
      console.log(postmanUrl.toJSON());
      // postmanUrl.query = new PropertyList();
      console.log('to_string: %s', postmanUrl.toString());

      // console.log('new url');
      // console.log(QueryParam.unparse([{disabled: true, key: 'hello', value: 'world'}, {key: 'name', value: 'lujian'}]));
      
      // console.log(QueryParam.parse(""));
      // alert('来自渲染页面：' + getStoreValue('workspaceId'))
      this.setState({contentWidth: window.innerWidth - this.state.width})
      window.addEventListener('resize', this.handleWindowResize)
      
      // var url=require("url");//引入url模块
      // var result=url.parse("hello=world&name=lujian",true);
        
      //   console.log(result);

      // var auth = new RequestAuth({
      //   type: 'basic',
      
      //   basic: [
      //     { key: "username", value: "postman" },
      //     { key: "password", value: "secrets" }
      //   ]
      // });

      // console.log(auth);
      // console.log(auth.toJSON());
      // console.log(auth.parameters());
      // console.log(auth.parameters().toObject());
      
      let vscope = new VariableScope({
        "id": "de80b3fe-ce0a-4fe3-84ee-5b8a3bc83ba3",
        "name": "localhost_qa",
        "values": [
          {
            "key": "api-ocs",
            "value": "http://qacourseware-ocs.hjapi.com",
            "enabled": true
          },
          {
            "key": "bi-search",
            "value": "http://localhost:8081",
            "enabled": true
          },
          {
            "key": "bi",
            "value": "http://qaaiportal.hjapi.com",
            "enabled": false
          },
          {
            "key": "hj-search",
            "value": "http://localhost:8080",
            "enabled": true
          },
          {
            "key": "order-query",
            "value": "http://qa.query-order.soa.yeshj.com",
            "enabled": false
          },
          {
            "key": "api-open",
            "value": "localhost:8070",
            "enabled": true
          }
        ],
        "_postman_variable_scope": "environment",
        "_postman_exported_at": "2021-12-02T09:45:40.458Z",
        "_postman_exported_using": "Postman/7.3.6"
      })

      console.log(vscope);
      console.log(vscope.toJSON());

      console.log('========================一下为eventlist')
      let eventList = new EventList();
      [
        {
          "listen": "prerequest",
          "script": {
            "id": "7d16759e-c036-4837-af80-4f149b20935e",
            "exec": [
              "console.log('请求的用户执行脚本');",
              "console.log('换行');"
            ],
            "type": "text/javascript"
          }
        },
        {
          "listen": "test",
          "script": {
            "id": "0577e315-526f-4802-9ae9-92fcdc218028",
            "exec": [
              "console.log('请求的test执行脚本');",
              "console.log('换行');"
            ],
            "type": "text/javascript"
          }
        }
      ].forEach(item => {
        eventList.add(new Event(item))
      })

      console.log(eventList);

      console.log("一下以为从良了次年通过==========================");
      var fs = window.require('fs')
      let myCollection = new Collection(JSON.stringify(fs.readFileSync('C:\\Users\\lujian\\Desktop\\空集合.postman_collection.json').toString()));
      console.log(myCollection);
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




