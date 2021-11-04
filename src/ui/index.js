import React from 'react';
import { 
    Layout, Menu, 
    Space,Row, Col ,
    Tabs, Input,Tree, Select
} from 'antd';
import { PlusOutlined, SearchOutlined,} from '@ant-design/icons';
import CollectionModal from 'ui/components/collection_modal'
import TooltipButton from 'ui/components/tooltip_button';
import RequestTabs from 'ui/components/request_tabs'
import LayoutHeader from 'ui/components/layout_header'
import CollectionTree from 'ui/components/collection_tree'
import ResponseTab from 'ui/components/response_tab'

import {Rnd} from 'react-rnd';
import {ADD_ICON} from 'ui/constants/icons'
import {publishCollectionModalOpen} from '@/utils/event_utils'
import TextareaAutosize from "react-autosize-textarea"
import 'ui/style/common.css'
import 'ui/style/layout.css'
import 'ui/style/global.css'

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
      this.setState({contentWidth: e.target.innerWidth - this.state.width})
    }

    componentDidMount() {
      this.setState({contentWidth: window.innerWidth - this.state.width})
      window.addEventListener('resize', this.handleWindowResize)
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

          <div>
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

                    
                    <div style={{height: 'calc(100% - 90px)',  overflowY: 'scroll', overflowX: 'hidden', paddingBottom: 20}} >
                      {
                        tabActiveKey === 'collections' && (
                          <>
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

                            <CollectionTree />
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




