import React from 'react';
import { Select, Button, Space, Input, Dropdown, Menu, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import RequestMethodSelect from './request_method_select'

import {UUID, compareObjectIgnoreEmpty, getSpecificFieldObj} from '@/utils/global_utils'
import PostmanSDK from 'postman-collection'
const {Url, QueryParam, PropertyList} = PostmanSDK
const { Option } = Select;
class RequestSendBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleUrlChange = (e) => {
        const {param = []} = this.props.value;
        let disabledParams = param.filter(item => item.disabled);
        let fullUrl = e.target.value;
    
        if (!fullUrl) {
            this.props.onChange({url: '', param: disabledParams})
        } else {
            let urlJson = Url.parse(fullUrl);
            const postmanUrl = new Url(urlJson);
            let queryString = postmanUrl.getQueryString();
            let queryStringArr = [];
            if (queryString) {
                queryStringArr = QueryParam.parse(queryString);
                postmanUrl.query = new PropertyList();
            }
            let urlString = postmanUrl.toString();
            let newParam = [...queryStringArr.map(item => {return {...item, id: UUID()}}), ...disabledParams];
            
            this.props.onChange({url: urlString, param: newParam});
        }
    }

    handleMethodChange = (value) => {
        this.props.onChange({method: value}, true)
    }

    handleUrlSave = (e) => {
        const {param = []} = this.props.value;
        let disabledParams = param.filter(item => item.disabled);
        let fullUrl = e.target.value;
    
        if (!fullUrl) {
            this.props.onSave({url: '', param: disabledParams})
        } else {
            let urlJson = Url.parse(fullUrl);
            const postmanUrl = new Url(urlJson);
            let queryString = postmanUrl.getQueryString();
            let queryStringArr = [];
            if (queryString) {
                queryStringArr = QueryParam.parse(queryString);
                postmanUrl.query = new PropertyList();
            }
            let urlString = postmanUrl.toString();
            let newParam = [...queryStringArr.map(item => {return {...item, id: UUID()}}), ...disabledParams];
            
            this.props.onSave({url: urlString, param: newParam});
        }
    }

    handleSaveClick = (e) => {
        this.props.onSaveClick();
    }

    handleSaveMenuClick = () => {
        this.props.onSaveClick(true)
    }
    
    render() {
        const {value = {}} = this.props;
        const {url = '', method = 'get', param = []} = value;
        let queryString = QueryParam.unparse(param);
        console.log('render querystring: ' + queryString);
        let urlWithQuery = url + (queryString ? ("?" + queryString) : "")
        const methodSelect = (
            <RequestMethodSelect 
                value={method}
                onChange={this.handleMethodChange} 
            />
        )
        return (
            <Row gutter={[32, 32]} style={{padding: 10, background: 'white'}} >
                
                <Col flex='auto'>
                    <Input 
                        value={urlWithQuery}
                        size="large" 
                        addonBefore={methodSelect} 
                        onChange={this.handleUrlChange} 
                        onBlur={this.handleUrlSave}
                        onPressEnter={this.handleUrlSave}
                    />
                </Col>

                <Col flex='none'>
                    <Space>
                        <Dropdown.Button 
                            overlay={(
                                <Menu onClick={this.handleMenuClick}>
                                    <Menu.Item key="1">
                                        Send and Download
                                    </Menu.Item>
                                </Menu>)
                            } 
                            type="primary"
                            size="large"
                            placement="bottomCenter" icon={<CaretDownOutlined />}>
                            Send
                        </Dropdown.Button>
                        <Dropdown.Button overlay={(
                                <Menu onClick={this.handleSaveMenuClick}>
                                    <Menu.Item key="1">
                                        Save as ...
                                    </Menu.Item>
                                </Menu>)
                            } 
                            size="large"
                            onClick={this.handleSaveClick}
                            placement="bottomCenter" icon={<CaretDownOutlined />}>
                            Save
                        </Dropdown.Button>
                    </Space>
                </Col>
            </Row>
        )
    }
}

export default RequestSendBar;

RequestSendBar.defaultProps = {
    onChange: () => {},
    onSave: () => {},
    onSaveClick: () => {},
}







