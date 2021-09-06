import React from 'react';
import { Typography, Button, Space, Input, Collapse, Tabs, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined, CaretRightOutlined  } from '@ant-design/icons';
import Icon from '@ant-design/icons';
import ScriptEditor from './script_editor'
import {Rnd} from 'react-rnd';
import {PRE_REQUEST_SCRIPTS_CODE_TIPS, TEST_SCRIPTS_CODE_TIPS} from 'ui/constants/tips';
const { Text, Link } = Typography;
class RndScriptEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            height: 300,
            showScripts: true,
            snippetContainerHeight: 200,
            outContainerHeight: 300
        }
    }

    componentDidMount() {
      
    }

    handleResizeStop = (e, direction, ref, delta, position) => {
        this.setState({
          height: this.state.height + delta.height
        });
      }

    handleShowScripts = () => {
      this.setState({showScripts: !this.state.showScripts})
    }

    handleResize = (e, direction, ref, delta, position) => {
        let newHeight = this.state.height + delta.height;
        this.setState({outContainerHeight: newHeight, snippetContainerHeight: newHeight - 100})
    }

    render() {
     
        const {showScripts, height, snippetContainerHeight, outContainerHeight} = this.state;
        const {scriptType} = this.props;
        return (
            <div style={{width: '100%', height: outContainerHeight,  margin: '10px 0px'}}> 
                <Rnd
                    minHeight={200}
                    maxHeight={600}
                    disableDragging
                    enableResizing={{ 
                        top:false, right:false, 
                        bottom:true, left:false, 
                        topRight:false, bottomRight:false, 
                        bottomLeft:false, topLeft:false 
                    }}
                    size={{ width: '100%', height: height,  }}
                    onResizeStop={this.handleResizeStop}
                    onResize={this.handleResize}>
                    <Row style={{height: '100%', marginRight: 20}}>
                        <Col flex="auto"><ScriptEditor height={outContainerHeight + 'px'} /></Col>
                        <Col flex="none" style={{fontSize: 11, paddingLeft: 10}}>
                            
                            <Space direction="vertical">
                                <Space align="start">
                                    {
                                        showScripts && (
                                            <div style={{width: 233, }}>
                                                {scriptType === 'tests' ? TEST_SCRIPTS_CODE_TIPS : PRE_REQUEST_SCRIPTS_CODE_TIPS} 
                                            </div>
                                        )
                                    }
                                    <Icon style={{marginTop: 10}} component={() => <CaretRightOutlined rotate={showScripts ? 0 : 180} />} onClick={this.handleShowScripts} />
                                      
                                </Space>
                                {
                                    showScripts && (
                                        <Space direction='vertical' style={{width: 250}}>
                                            <div style={{paddingTop: 10}}>SNIPPETS</div>
                                            <div style={{height: snippetContainerHeight, overflowY: 'auto'}}>
                                                <Space direction="vertical" size={10}>
                                                    <Link>Get an environment</Link>
                                                    <Link>Get a global variable</Link>
                                                    <Link>Get a variable</Link>
                                                    <Link>Set an environment varibale</Link>
                                                    <Link>Set a global variable</Link>
                                                    <Link>Clear an environment variable</Link>
                                                    <Link>Clear a global variable</Link>
                                                    <Link>Send a request</Link>
                                                    {
                                                        scriptType === 'tests' && (
                                                            <>
                                                                <Link>Status code: Code is 200</Link>
                                                                <Link>Response body: Contains string</Link>
                                                                <Link>Response body: JSON value check</Link>
                                                                <Link>Response body: Is equal to a string</Link>
                                                                <Link>Response headers: Content-Type header check</Link>
                                                                <Link>Response time is less than 200ms</Link>
                                                                <Link>Status code: Successful POST request</Link>
                                                                <Link>Status code: Code name has string</Link>
                                                                <Link>Response body: Convert XML body to a JSON Object</Link>
                                                                <Link>Use Tiny Validator for JSON data</Link>
                                                            </>
                                                        )
                                                    }
                                                </Space>
                                            </div>
                                            
                                        </Space>
                                    
                                    )
                                }     
                                   </Space>
                                
                        </Col>
                    
                    </Row>
                    
                </Rnd>
            </div>
        )
    }
}

export default RndScriptEditor;







