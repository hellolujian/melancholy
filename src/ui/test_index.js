import React from 'react';
import { 
    Layout, Menu, 
    Space,Row, Col ,
    Tabs, Input,Tree,
} from 'antd';
import { PlusOutlined, SearchOutlined,} from '@ant-design/icons';

import TooltipButton from 'ui/components/tooltip_button';
import RequestIntroCollapse from 'ui/components/request_intro_collapse'
import RequestSendBar from 'ui/components/request_send_bar'
import RequestTabs from 'ui/components/request_tabs'
import RequestSendSetting from 'ui/components/request_send_setting'
import LayoutHeader from 'ui/components/layout_header'
import CollectionTree from 'ui/components/collection_tree'
import ResponseTab from 'ui/components/response_tab'
import { Resizable } from 'react-resizable';

import 'ui/style/resizable.css'
import 'ui/style/common.css'
import 'ui/style/layout.css'
import 'ui/style/global.css'

const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { DirectoryTree } = Tree;

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          width: 350,
          height: 200,
        }
    }

    componentDidMount() {
      
    }

    onResize = (event, {element, size, handle}) => {
      this.setState({width: size.width, height: size.height});
    }

    handleSelectTreeNode = (selectedKeys, e) => {
      console.log(e);
      this.setState({expandedKeys: selectedKeys});
    }

    render() {
     
        return (
            <Layout>
              <LayoutHeader />
              <Layout>
                <Resizable width={this.state.width} onResize={this.onResize} style={{zIndex: 2, boxShadow: '5px 0px 5px -5px #888888'}}>
                  <Sider theme="light" width={this.state.width} className="site-layout-background">
                    <Row style={{padding: '10px 10px 0px 10px'}}>
                      <Col span={24}>
                        <Input style={{borderRadius:'20px'}} placeholder="Filter" prefix={<SearchOutlined />} />
                      </Col>
                    </Row>

                    <Tabs defaultActiveKey="collections" 
                      onChange={this.callback} 
                      tabBarStyle={{width: '100%'}}  
                      centered 
                    // renderTabBar={
                    //         () => {

                    //         }
                    // }
                    >
                      <TabPane tab="History" key="history">
                        Content of Tab Pane 1
                      </TabPane>
                      <TabPane tab="Collections" key="collections">
                        <Space style={{display: 'flex', justifyContent: 'space-between'}}>
                          <TooltipButton title="Create new Collection" icon={<PlusOutlined />} label="New Collection" type="link" />
                          <TooltipButton title="Recover your deleted collections" label="Trash" type="text" />
                        </Space>
                        
                        <CollectionTree />
                      </TabPane>
                      <TabPane tab="APIs" key="apis">
                        Content of Tab Pane 3
                      </TabPane>
                    </Tabs>
                  </Sider>
                </Resizable>

                <Layout className="site-drawer-render-in-current-wrapper">

                
                 
                  <Content
                    className="site-layout-background"
                    style={{
                     
                      // minHeight: 680,
                    }}
                  >
                    <RequestTabs />
                     
                   

                    <RequestIntroCollapse />

                    <RequestSendBar />
                    <RequestSendSetting />
                    <ResponseTab />
                  </Content>
                </Layout>
            </Layout>
          </Layout>
        )
    }
}

export default Home;







