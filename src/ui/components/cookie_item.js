import React from 'react';
import {Space, Button, Input, Row, Col, Card, Collapse } from 'antd';
import {CLOSE_SVG} from '@/ui/constants/icons'
import {PlusOutlined} from '@ant-design/icons'
import Icon from '@ant-design/icons';
import {stopClickPropagation} from '@/utils/global_utils';
class CookieItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cookies: props.cookies ? props.cookies : [],
        }
    }

    componentDidMount() {
      
    }

    handleAddCookie = () => {
        const { cookies } = this.state;
        let suffix = cookies.length + 1;
        cookies.push({
            id: suffix + "",
            key: 'test_' + suffix,
            value: 'test_' + suffix,
        })
        this.setState({cookies: cookies, editingId: suffix + ""})
    }

    handleUpdateCookie = (id) => {
        this.setState({editingId: id})
    }

    handleCloseCookie = (e, id) => {
        stopClickPropagation(e)
        const { cookies } = this.state;
        this.setState({cookies: cookies.filter(cookie => cookie.id !== id), editingId: null})
    }

    handleSaveCookie = () => {
        this.setState({editingId: null})
    }

    handleCancel = () => {
        this.setState({editingId: null})
    }

    render() {
     
        const {cookies, editingId} = this.state;
        let cookieList = cookies.map(cookie => (
            <Button type="text" key={cookie.id} onClick={(e) => this.handleUpdateCookie(cookie.id)}>
                <div className="vertical-center">
                    <label style={{paddingRight: 10, paddingBottom: 2}}>{cookie.key}</label>   
                    <Icon component={() => CLOSE_SVG} onClick={(e) => this.handleCloseCookie(e, cookie.id)} />
                </div>
            </Button>
        )) 
        return (
            <>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Space size={[0, 16]} wrap>
                        {cookieList}
                        <Button type="primary" icon={<PlusOutlined />} onClick={this.handleAddCookie}>Add Cookie</Button>
                        </Space>
                        
                    </Col>
                    {
                        editingId && (
                            <>
                                <Col span={24}><Input.TextArea rows={4} /></Col>
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







