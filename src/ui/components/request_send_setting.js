import React from 'react';
import { Typography, Button, Space, Input, Collapse, Tabs, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined, CaretRightOutlined  } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import KeyValueTable from './key_value_table'
import RequestBodyTab from './request_body_tab'
import CookieModal from './cookies_modal'
import ButtonModal from './button_modal'
import ScriptEditor from './script_editor'

import { Resizable, ResizableBox  } from 'react-resizable';
import 'ui/style/test.css'
import {Rnd} from 'react-rnd';
import {PRE_REQUEST_SCRIPTS_CODE_TIPS} from 'ui/constants/tips';
const { TabPane } = Tabs;

const { Panel } = Collapse;

const { Text, Link } = Typography;
const style = {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    // border: "solid 1px red"
  };
class RequestSendSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 50,
            height: 250,
            x: 10,
            y: 10,
            showScripts: true,
        }
    }

    componentDidMount() {
      
    }

    onResize = (event, {element, size, handle}) => {
        this.setState({width: size.width, height: size.height});
    }

    handleShowScripts = () => {
      this.setState({showScripts: !this.state.showScripts})
    }

    render() {
     
       const {showScripts} = this.state;
       let test = this.state.height - 200;
        return (
            <Tabs type="card" size='small' defaultActiveKey="prerequestscripts" onChange={this.callback} tabBarExtraContent={
                <>
                <CookieModal />
                <Button type="link">Code</Button>
                
                </>
            }>
                <TabPane tab="Params" key="params">
                <KeyValueTable scene="params" />
                </TabPane>
                <TabPane tab="Authorization" key="authorization">
                Content of Tab Pane 2
                </TabPane>
                <TabPane tab="Headers" key="headers">
                <KeyValueTable scene="headers" />
                </TabPane>
                <TabPane tab="Body" key="body">
                <RequestBodyTab />
                </TabPane>
                <TabPane tab="Pre-request Script" key="prerequestscripts">
                
                <Rnd
                disableDragging
                enableResizing={{ top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
        style={style}
        size={{ width: '100%', height: this.state.height }}
        // position={{ x: this.state.x, y: this.state.y }}
        minHeight={200}
        onResizeStop={(e, direction, ref, delta, position) => {
          this.setState({
            // width: ref.style.width,
            height: ref.style.height,
            ...position
          });
        }}
      >
        <Row style={{height: '100%', marginRight: 20}}>
          <Col flex="auto"><ScriptEditor /></Col>
          <Col flex="none" style={{}}>
            <div  className="border" style={{height: '100%',display: 'flex', flexDirection: 'column'}}>
              {
                showScripts && (
                  <>
                  <div direction="vertical"  style={{height: 100, width: '250px', fontSize: 11, border: '1px solid blue',}}>
                    <p>{PRE_REQUEST_SCRIPTS_CODE_TIPS}</p>
                    <span>SNIPPETS</span>
                    
                    
                  </div>
                  <div className="border" style={{flex: 1,}} >
                    <div style={{height: this.state.height - 100, overflowY: 'hidden'}}>



                    <Space direction="vertical"  className="border" >
                    <Link>Get an environment</Link>
                    <Link>Get a global variable</Link>
                    <Link>Get a variable</Link>
                    <Link>Set an environment varibale</Link>
                    <Link>Set a global variable</Link>
                    <Link>Clear a global variable</Link>
                    <Link>Send a request</Link>
                    </Space>
                    </div>
                  
                  </div>
                  </>
                  
                  
                )
              }
              
              {/* <Icon component={() => <CaretRightOutlined />} onClick={this.handleShowScripts} /> */}
              
            </div>
          </Col>
        </Row>
        
      </Rnd>
                </TabPane>
                <TabPane tab="Tests" key="tests">
                <ScriptEditor />
                </TabPane>
            </Tabs>
        )
    }
}

export default RequestSendSetting;







