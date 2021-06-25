import React from 'react';
import { 
    Layout, 
    Menu, 
    Space,Row, Col ,
    Tabs, Input,Tree,
    Button, Rate,Drawer,
    Dropdown } from 'antd';
import { UserOutlined, CaretRightOutlined, PlusOutlined, CaretDownFilled, PlusSquareFilled,SyncOutlined,
  ReadOutlined, SearchOutlined,EllipsisOutlined,
                    SettingFilled,NotificationFilled , EnvironmentFilled ,FolderViewOutlined ,DatabaseOutlined  , PullRequestOutlined  } from '@ant-design/icons';

import TooltipButton from 'ui/components/tooltip_button';
import Tooltipbutton from 'ui/components/tooltip_button'
import RequestIntroCollapse from 'ui/components/request_intro_collapse'
import RequestSendBar from 'ui/components/request_send_bar'
import RequestTabs from 'ui/components/request_tabs'
import RequestSendSetting from 'ui/components/request_send_setting'
import LayoutHeader from 'ui/components/layout_header'
import { Resizable } from 'react-resizable';
import 'ui/style/resizable.css'
import 'ui/style/tree.css'

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

    handleCollectionDrawerOpen = (e) => {
      e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
          this.setState({collectionDrawerVisible: true});
        }
    
treeData = [
  {
    title: (
      <Dropdown overlay={
        <Menu>
                  <Menu.ItemGroup title="BUILDING BLOCKS">
                    <Menu.Item key="request" icon={<PullRequestOutlined />}>Request</Menu.Item>
                    <Menu.Item key="collection" icon={<EnvironmentFilled />}>Collection</Menu.Item>
                    <Menu.Item key="environment" icon={<EnvironmentFilled />}>Environment</Menu.Item>
                  </Menu.ItemGroup>
                    <Menu.ItemGroup title="ADVANCED">
                      <Menu.Item key="documentation" icon={<ReadOutlined /> }>Documentation</Menu.Item>
                      <Menu.Item key="mockServer" icon={<DatabaseOutlined />}>Mock Server</Menu.Item>
                      <Menu.Item key="monitor" icon={<FolderViewOutlined />}>Monitor</Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
      } trigger={['contextMenu']}>
<Space style={{display: 'flex', flexdirection: 'row', justifyContent: 'space-between', width: '100%'}}>
            <div>
              <div>请求名称 <Rate count={1} /></div>
              <div>sdfsd</div>
            </div>
            <Space direction="vertical" size={0}>
              <TooltipButton title="View more actions" type="ghost"  icon={<CaretRightOutlined />} onClick={this.handleCollectionDrawerOpen}/>
              <TooltipButton title="View more actions" type="ghost" icon={<EllipsisOutlined />} />
            </Space>
          </Space>
      </Dropdown>
      
    ),
    key: '0-0',
    children: [
      {
        title: 'leaf 0-0',
        key: '0-0-0',
        isLeaf: true,
      },
      {
        title: 'leaf 0-1',
        key: '0-0-1',
        isLeaf: true,
      },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      {
        title: 'leaf 1-0',
        key: '0-1-0',
        isLeaf: true,
      },
      {
        title: 'leaf 1-1',
        key: '0-1-1',
        isLeaf: true,
      },
    ],
  },
];

handleCollectionDrawerClose = () => {
  this.setState({collectionDrawerVisible: false});
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
              <Header className="header" style={{padding: "0 10px"}}>
                <LayoutHeader />
              </Header>
              <Layout>
                <Resizable height={this.state.height} width={this.state.width} onResize={this.onResize} >
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
                        <Tree autoExpandParent={true} 
                          titleRender={
                            ({title}) => {
                              return <div>{title}</div>
                            }
                          }
                          expandedKeys={this.state.expandedKeys}
                          // defaultExpandAll
                          onExpand={this.onExpand}
                          treeData={this.treeData}
                          onSelect={this.handleSelectTreeNode}
                          draggable
                            blockNode
                            onDragEnter={this.onDragEnter}
                            onDrop={this.onDrop}
                        />
                      </TabPane>
                      <TabPane tab="APIs" key="apis">
                        Content of Tab Pane 3
                      </TabPane>
                    </Tabs>
                  </Sider>
                </Resizable>

                <Layout style={{ padding: '0 24px 24px' }} className="site-drawer-render-in-current-wrapper">

                <Drawer
                    title="Basic Drawer"
                    mask={false}
                    placement="left"
                    closable
                    onClose={this.handleCollectionDrawerClose}
                    visible={this.state.collectionDrawerVisible}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                  >
                    <p>Some contents...</p>
                  </Drawer>
                 
                  <Content
                    // className="site-layout-background"
                    style={{
                      padding: 24,
                      margin: 0,
                      minHeight: 280,
                    }}
                  >
                    <RequestTabs>
                      <TabPane tab="tab 1" key="first">
                        Content of Tab Pane 1
                      </TabPane>
                      <TabPane tab="tab 2" key="second">
                        Content of Tab Pane 2
                      </TabPane>
                      <TabPane tab="tab 3" key="three">
                        Content of Tab Pane 3
                      </TabPane>
                    </RequestTabs>

                    {/* <RequestIntroCollapse /> */}

                    <RequestSendBar />
                    <RequestSendSetting />
                  </Content>
                </Layout>
            </Layout>
          </Layout>
        )
    }
}

export default Home;







