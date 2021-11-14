import React from 'react';
import {Space, Button, Input, Row, Col, Card, Collapse } from 'antd';
import {CLOSE_SVG} from '@/ui/constants/icons'
import {PlusOutlined} from '@ant-design/icons'
import Icon from '@ant-design/icons';
import {stopClickPropagation, UUID} from '@/utils/global_utils';
class CookieItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // cookies: props.cookies ? props.cookies : [],
        }
    }

    componentDidMount() {
      
    }

    handleAddCookie = async () => {
        const { cookies, domainName } = this.props;
        let suffix = cookies.length + 1;
        let insertObj = {
            id: UUID(),
            name: 'Cookie_' + suffix,
            value: 'value',
        };
        cookies.push(insertObj)
        this.props.onSave(cookies)
        let cookieItemValue = [[insertObj.name, insertObj.value], ['path', '/'], ['domain', '.' + domainName]].map(item => item.join("=")).join(";");
        this.setState({editingId: insertObj.id, cookieItemValue: cookieItemValue})
    }

    handleUpdateCookie = (cookie) => {
        const {id, name, value, path} = cookie;
        const { domainName } = this.props;
        let cookieItemValue = [[name, value], ['path', path || '/'], ['domain', '.' + domainName]].map(item => item.join("=")).join(";");
        this.setState({editingId: id, cookieItemValue: cookieItemValue})
    }

    handleCloseCookie = (e, id) => {
        stopClickPropagation(e)
        const { cookies } = this.props;
        this.props.onSave(cookies.filter(cookie => cookie.id !== id));
        this.setState({editingId: null, cookieItemValue: ''})
    }

    handleSaveCookie = () => {
        const {editingId, cookieItemValue} = this.state;
        const {cookies} = this.props;
        if (cookieItemValue && cookieItemValue.trim()) {
            let keyValueTextArr = cookieItemValue.split(";");
            if (keyValueTextArr.length === 0) {
                return;
            }
            let updateObj = {}
            keyValueTextArr.forEach((item, index) => {
                if (item && item.trim()) {
                    let keyValueArr = item.trim().split("=");
                    let key = keyValueArr[0];
                    let value = keyValueArr.length > 0 ? keyValueArr[1] : ''
                    if (index === 0) {
                        updateObj.name = key;
                        updateObj.value = value;
                    } else if (key === 'path' && value && value !== '/') {
                        updateObj.path = value;
                    }
                }
            })
            let targetIndex = cookies.findIndex(cookie => cookie.id === editingId);
            cookies[targetIndex] = {...cookies[targetIndex], ...updateObj}
            this.props.onSave(cookies)
        }
        this.setState({editingId: null, cookieItemValue: ''})
    }

    handleCancel = () => {
        this.setState({editingId: null, cookieItemValue: ''})
    }

    handleCookieValueChange = (e) => {
        this.setState({cookieItemValue: e.target.value})
    }

    render() {
     
        const { editingId, cookieItemValue} = this.state;
        const {cookies} = this.props;
        let cookieList = cookies.map(cookie => {
            let {id, name} = cookie;
            return (
                <Button 
                    type="text" 
                    key={id} 
                    className={editingId === id ? 'background-lightgray-clas' : ''}
                    onClick={(e) => this.handleUpdateCookie(cookie)}>
                    <div className="vertical-center">
                        <label style={{paddingRight: 10, paddingBottom: 2}}>{name}</label>   
                        <Icon 
                            component={() => CLOSE_SVG} 
                            onClick={(e) => this.handleCloseCookie(e, id)} 
                        />
                    </div>
                </Button>
            )
        }) 
        return (
            <>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Space size={[16, 32]} wrap>
                            {cookieList}
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />} 
                                onClick={this.handleAddCookie}>
                                Add Cookie
                            </Button>
                        </Space>
                        
                    </Col>
                    {
                        editingId && (
                            <>
                                <Col span={24}>
                                    <Input.TextArea 
                                        rows={4}
                                        value={cookieItemValue} 
                                        onChange={this.handleCookieValueChange}
                                    />
                                </Col>
                                <Col className="justify-content-flex-end" span={24}>
                                    <Button type="link" onClick={this.handleCancel}>Cancel</Button>
                                    <Button type="primary" onClick={this.handleSaveCookie}>Save</Button>
                                </Col>
                            </>
                        )
                    }
                    
                </Row>
            </>
        )
    }
}

export default CookieItem;







