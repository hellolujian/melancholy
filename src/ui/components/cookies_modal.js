import React from 'react';
import {Space, Button, Input, Row, Col, Typography, Collapse, Empty } from 'antd';

import ButtonModal from './button_modal'

import TooltipButton from './tooltip_button'
import CookieItem from './cookie_item'
import {CLOSE_SVG} from '@/ui/constants/icons'
import Icon from '@ant-design/icons';
import {
    COOKIE_LEARN_MORE_TIPS
} from 'ui/constants/tips'

import {stopClickPropagation} from '@/utils/global_utils';
import {updateDomainMeta, queryDomainMetaById, insertDomainMeta, queryDomainMeta} from '@/database/domain_meta'

import {UUID} from '@/utils/global_utils'
const { Panel } = Collapse;
class CookiesModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           domains: [],
        }
    }

    refreshData = async (extra = {}) => {
        let domains = await queryDomainMeta();
        this.setState({domains: domains, ...extra});
    }

    componentDidMount() {
        this.refreshData();
    }

    handleAddDomain = async () => {
        const {domainName} = this.state;
        if (domainName && domainName.trim()) {
            await insertDomainMeta({
                id: UUID(),
                name: domainName
            })
            this.refreshData({domainName: ''});
        }
    }

    handleDomainNameChange = (e) => {
        this.setState({domainName: e.target.value})
    }

    handleCloseDomain = async (e, id) => {
        stopClickPropagation(e)
        await updateDomainMeta(id, {$set: {deleted: true }});
        this.refreshData()
    }

    handleCollapseChange = (key) => {
        this.setState({activeKey: key})
    }

    handleSaveCookieItem = async (value, domainId) => {
        await updateDomainMeta(domainId, {$set: {cookies: value}})
        this.refreshData();
    }

    render() {
     
        let {domainName, domains, activeKey} = this.state;
        return (
            <ButtonModal  
                    label="Cookies"
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
                                <Col flex='auto'>
                                    <Input 
                                        placeholder="Type a domain name" 
                                        value={domainName} 
                                        onChange={this.handleDomainNameChange} 
                                    />
                                </Col>
                                <Col flex='none'>
                                    <TooltipButton 
                                        label="Add" 
                                        tooltipProps={{title: "Add domain"}}
                                        buttonProps={{onClick: this.handleAddDomain}}
                                    />
                                </Col>
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
                                        domains.map(domain => {
                                            let {id, name, cookies = []} = domain;
                                            return (
                                                <Panel 
                                                    header={(
                                                        <Space size="large">
                                                            <Typography.Text strong>{name}</Typography.Text>
                                                            <Typography.Text>
                                                                {cookies.length} {cookies.length === 1 ? 'cookie' : 'cookies'}
                                                            </Typography.Text>
                                                        </Space>
                                                    )} 
                                                    key={id} 
                                                    extra={
                                                        <Icon 
                                                            component={() => CLOSE_SVG} 
                                                            onClick={(e) => this.handleCloseDomain(e, id)}
                                                        />}>
                                                    <CookieItem 
                                                        cookies={cookies} 
                                                        domainName={name}
                                                        onSave={(value) => this.handleSaveCookieItem(value, id)}
                                                    />
                                                </Panel>
                                            )
                                        })
                                    }
                                
                            </Collapse>
                        </>
                        
                    }
                />
        )
    }
}

export default CookiesModal;







