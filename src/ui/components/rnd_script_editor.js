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

    componentWillReceiveProps = (nextProps) => {
        const {value} = nextProps;
        this.setState({value: value})
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
    
    commonSnippets = [
        {key: 'getEnvVar', label: 'Get an environment variable', code: 'pm.environment.get("variable_key");'},
        {key: 'getGlobalVar', label: 'Get a global variable', code: 'pm.globals.get("variable_key");'},
        {key: 'getVar', label: 'Get a variable', code: 'pm.variables.get("variable_key");'},
        {key: 'setEnvVar', label: 'Set an environment varibale', code: 'pm.environment.set("variable_key", "variable_value");'},
        {key: 'setGlobalVar', label: 'Set a global variable', code: 'pm.globals.set("variable_key", "variable_value");'},
        {key: 'clearEnvVar', label: 'Clear an environment variable', code: 'pm.environment.unset("variable_key");'},
        {key: 'clearGlobalVar', label: 'Clear a global variable', code: 'pm.globals.unset("variable_key");'},
        {key: 'sendReq', label: 'Send a request', code: 'pm.sendRequest("https://postman-echo.com/get", function (err, response) {\n    console.log(response.json());\n});'},
    ]

    testSnippets = [
        {key: 'statusCode', label: 'Status code: Code is 200', code: 'pm.test("Status code is 200", function () {\n    pm.response.to.have.status(200);\n});'},
        {key: 'containString', label: 'Response body: Contains string', code: "pm.test(\"Body matches string\", function () {\n    pm.expect(pm.response.text()).to.include(\"string_you_want_to_search\");\n});"},
        {key: 'jsonValueCheck', label: 'Response body: JSON value check', code: "pm.test(\"Your test name\", function () {\n    var jsonData = pm.response.json();\n    pm.expect(jsonData.value).to.eql(100);\n});"},
        {key: 'equal', label: 'Response body: Is equal to a string', code: "pm.test(\"Body is correct\", function () {\n    pm.response.to.have.body(\"response_body_string\");\n});"},
        {key: 'headerCheck', label: 'Response headers: Content-Type header check', code: "pm.test(\"Content-Type is present\", function () {\n    pm.response.to.have.header(\"Content-Type\");\n});"},
        {key: 'time', label: 'Response time is less than 200ms', code: "pm.test(\"Response time is less than 200ms\", function () {\n    pm.expect(pm.response.responseTime).to.be.below(200);\n});"},
        {key: 'successReq', label: 'Status code: Successful POST request', code: "pm.test(\"Successful POST request\", function () {\n    pm.expect(pm.response.code).to.be.oneOf([201,202]);\n});"},
        {key: 'hasString', label: 'Status code: Code name has string', code: "pm.test(\"Status code name has string\", function () {\n    pm.response.to.have.status(\"Created\");\n});\n"},
        {key: 'convert', label: 'Response body: Convert XML body to a JSON Object', code: "var jsonObject = xml2Json(responseBody);"},
        {key: 'validator', label: 'Use Tiny Validator for JSON data', code: "var schema = {\r\n  \"items\": {\r\n    \"type\": \"boolean\"\r\n  }\r\n};\r\n\r\nvar data1 = [true, false];\r\nvar data2 = [true, 123];\r\n\r\npm.test('Schema is valid', function() {\r\n  pm.expect(tv4.validate(data1, schema)).to.be.true;\r\n  pm.expect(tv4.validate(data2, schema)).to.be.true;\r\n});"},
    ]

    handleCommonSnippetClick = (snippetKey) => {
        let target = this.commonSnippets.find(snippet => snippet.key === snippetKey);
        if (target) {
            this.props.onChange(target.code);
            this.setState({value: target.code})
            this.scriptEditorRef.insertAtCursor(target.code);
        }
    }

    handleTestSnippetClick = (snippetKey) => {
        let target = this.testSnippets.find(snippet => snippet.key === snippetKey);
        if (target) {
            this.props.onChange(target.code, true)
            this.scriptEditorRef.insertAtCursor(target.code);
        }
    }

    handleScriptChange = (value, callback) => {
        this.setState({value: value}, callback);
        this.props.onChange(value);
    }

    handleScriptBlur = (e) => {
        this.props.onSave(e);
    }

    handleScriptEditorRef = (ref) => {
        if (ref) this.scriptEditorRef = ref
    }

    render() {
     
        const {showScripts, height, snippetContainerHeight, outContainerHeight} = this.state;
        const {scriptType, defaultValue} = this.props;
        let value = this.state.value || defaultValue;
       
        return (
            <div style={{width: '100%', height: outContainerHeight, position: 'relative',  margin: '10px'}}> 
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
                    <Row style={{marginRight: 20}}>
                        <Col flex="auto">
                            <ScriptEditor 
                                ref={this.handleScriptEditorRef}
                                value={value}
                                height={outContainerHeight + 'px'} 
                                onChange={this.handleScriptChange}
                                onBlur={this.handleScriptBlur}
                            />
                        </Col>
                        <Col flex="none" style={{fontSize: 11, paddingLeft: 10}}>
                            
                            <Space direction="vertical">
                                <Space align="start">
                                    {
                                        showScripts && (
                                            <div style={{width: 212, }} >
                                                {scriptType === 'tests' ? TEST_SCRIPTS_CODE_TIPS : PRE_REQUEST_SCRIPTS_CODE_TIPS} 
                                            </div>
                                        )
                                    }
                                    <Icon style={{marginTop: 10}} component={() => <CaretRightOutlined rotate={showScripts ? 0 : 180} />} onClick={this.handleShowScripts} />
                                      
                                </Space>
                                {
                                    showScripts && (
                                        <Space direction='vertical' style={{width: 232}} >
                                            <div style={{paddingTop: 10}}>SNIPPETS</div>
                                            <div style={{height: snippetContainerHeight, overflowY: 'auto'}}>
                                                <Space direction="vertical" size={10}>
                                                    {
                                                        this.commonSnippets.map(item => (
                                                            <Link key={item.key} onClick={() => this.handleCommonSnippetClick(item.key)}>{item.label}</Link>
                                                        ))
                                                    }
                                                    {
                                                        scriptType === 'tests' && (
                                                            this.testSnippets.map(item => (
                                                                <Link key={item.key} onClick={() => this.handleTestSnippetClick(item.key)}>{item.label}</Link>
                                                            ))
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







