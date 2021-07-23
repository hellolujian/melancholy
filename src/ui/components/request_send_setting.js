import React from 'react';
import { Select, Button, Space, Input, Collapse, Tabs } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import KeyValueTable from './key_value_table'
import RequestBodyTab from './request_body_tab'
import CookieModal from './cookies_modal'
import ButtonModal from './button_modal'
import ScriptEditor from './script_editor'

import { Resizable, ResizableBox  } from 'react-resizable';
import 'ui/style/test.css'
import {Rnd} from 'react-rnd';
const { TabPane } = Tabs;

const { Panel } = Collapse;

const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0"
  };
class RequestSendSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 200,
            height: 200,
            x: 10,
            y: 10
        }
    }

    componentDidMount() {
      
    }

    onResize = (event, {element, size, handle}) => {
        this.setState({width: size.width, height: size.height});
    }

    

    render() {
     
       let text = "wertwere"
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
                {/* <ScriptEditor /> */}
                <Rnd
        style={style}
        size={{ width: this.state.width, height: this.state.height }}
        position={{ x: this.state.x, y: this.state.y }}
        onDragStop={(e, d) => {
          this.setState({ x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          this.setState({
            width: ref.style.width,
            height: ref.style.height,
            ...position
          });
        }}
      >
        Rnd
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







