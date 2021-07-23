import React from 'react';
import {Space, Button, Input, Row, Col, Typography, Collapse } from 'antd';

import ButtonModal from './button_modal'

import TooltipButton from './tooltip_button'
import CookieItem from './cookie_item'
import {CLOSE_SVG} from '@/ui/constants/icons'
import Icon from '@ant-design/icons';
import {
    COOKIE_LEARN_MORE_TIPS
} from 'ui/constants/tips'

import {stopClickPropagation} from '@/utils/global_utils';

const { Panel } = Collapse;
class CookiesModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           domains: [
               {
                   id: '1',
                   name: 'domain1',
                   cookies: [
                    {
                        id: '1-1',
                        key: 'cookie_1',
                        value: 'sdfsdfsdf'

                    },
                    {
                        id: '1-2',
                        key: 'cookie_2',
                        value: 'sdfsdfsdf'

                    },
                   ]
               },
               {
                   id: '2',
                   name: 'domain2',
                   cookies: [
                    {
                        id: '2-1',
                        key: 'cookie_21',
                        value: 'sdfsdfsdf'

                    },
                    {
                        id: '2-2',
                        key: 'cookie_22',
                        value: 'sdfsdfsdf'

                    },
                   ]
               }
           ],
        }
    }

    componentDidMount() {
      
    }

    handleAddDomain = () => {
        const {domains} = this.state;
        let suffix = domains.length + 1;
        domains.push({
            id: suffix + "",
            name: 'domain_' + suffix,
            cookies: []
        })

        this.setState({domains: domains, activeKey: suffix + ""})
    }

    handleDomainNameChange = (e) => {
        this.setState({cookieName: e.target.value})
    }

    handleCloseDomain = (e, id) => {
        stopClickPropagation(e)
        const {domains} = this.state;
        this.setState({domains: domains.filter(domain => domain.id !== id)})
    }

    handleCollapseChange = (key) => {
        this.setState({activeKey: key})
    }

    render() {
     
        let {domainName, domains, activeKey} = this.state;
        return (
            <ButtonModal  
                    buttonLabel="Cookies"
                    // modalVisible={true}
                    buttonProps={{
                        type: 'link'
                    }}
                    modalProps={{
                        title: 'MANAGE COOKIES',
                        footer: (
                            <div style={{textAlign: 'left'}}>
                            {COOKIE_LEARN_MORE_TIPS}
                            </div>
                            
                        ),
                        width: 750,
                        bodyStyle: { height: 600, overflowY: 'auto'},
                    }}
                    modalContent={
                        <>
                            <Row gutter={[16, 16]}>
                                <Col flex='auto'><Input placeholder="Type a domain name" value={domainName} onChange={this.handleDomainNameChange} /></Col>
                                <Col flex='none'><TooltipButton label="Add" title="Add domain" onClick={this.handleAddDomain} /></Col>
                            </Row>

                            <Collapse
                                defaultActiveKey={['1']}
                                activeKey={activeKey}
                                style={{marginTop: 20}}
                                onChange={this.handleCollapseChange}
                                // expandIconPosition={expandIconPosition}
                                expandIcon={() => null}
                                >
                                    {
                                        domains.map(domain => (
                                            <Panel header={(
                                                <Space size="large">
                                                    <Typography.Text strong>{domain.name}</Typography.Text>
                                                    <Typography.Text>{domain.cookies.length} cookies</Typography.Text>
                                                </Space>
                                                
                                            )} 
                                            key={domain.id} 
                                            extra={<Icon component={() => CLOSE_SVG} onClick={(e) => this.handleCloseDomain(e, domain.id)}/>}>
                                                <CookieItem cookies={domain.cookies} />
                                            </Panel>
                                        ))
                                    }
                                
                            </Collapse>
                        </>
                        
                    }
                />
        )
    }
}

export default CookiesModal;







