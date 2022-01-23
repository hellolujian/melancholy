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
import MainLeftContainer from 'ui/components/main_left_container';
import { setTheme } from '@/utils/style_utils';
import {Rnd} from 'react-rnd';
import {ADD_ICON} from 'ui/constants/icons'
import {listenShortcut, subscribeThemeChange} from '@/utils/event_utils'
import {getStoreValue} from '@/utils/store_utils'
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
          dynamicWidth: getStoreValue('leftSideBarWidth', 280)
        }
    }

    handleWindowResize = (e) => {
      console.log(document.body.clientHeight);
      this.setState({contentWidth: e.target.innerWidth - this.state.width, collectionTreeHeight: document.body.clientHeight - 240})
    }

    componentWillMount() {
      setTheme()
    }

    handleChangeTheme = (theme, data) => {
        this.setState({currentTheme: data})
    }

    handleToggleSidebar = () => {
      const {dynamicWidth, lastTimeWidth} = this.state;
      if (dynamicWidth === 0) {
        this.setState({dynamicWidth: lastTimeWidth})
      } else {
        this.setState({dynamicWidth: 0, lastTimeWidth: dynamicWidth})
      }
    }

    componentDidMount() {
      const fs = window.require('fs');
      const path = window.require('path')
      
      // console.log(fs.readFileSync(path.join(path.dirname(window.__dirname), '/node_modules/antd/dist/antd.dark.css')).toString());
      // console.log(path.join(path.dirname(window.__dirname), '/node_modules/antd/dist/antd.dark.css'));
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
      let myCollection = new Collection(JSON.stringify(fs.readFileSync('C:\\Users\\lujian\\Desktop\\空集合.postman_collection.json').toString()));
      console.log(myCollection);



      
        
      subscribeThemeChange(this.handleChangeTheme);
      listenShortcut('togglesidebar', this.handleToggleSidebar)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize)
    }

    handleSideBarRize = (width) => {
      this.setState({dynamicWidth: width})
    }

    render() {

      const {dynamicWidth} = this.state;
        return (

          <div id="rootPage">
            <ToastContainer />
            <LayoutHeader />
            <div class="mainBox">
                <MainLeftContainer 
                  dynamicWidth={dynamicWidth}
                  onResize={this.handleSideBarRize} 
                />
                <MainRightContainer 
                  dynamicWidth={dynamicWidth}
                />
            </div>
            <div className="bottom">底部，高度40px</div>
          </div>
            
        )
    }
}

export default Home;




