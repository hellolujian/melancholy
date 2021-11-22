import React from 'react';
import {Select , Button, Row, Col, Typography, Form, Input, Checkbox, Space} from 'antd';
import {NO_AUTH_TIPS, HAVE_AUTH_TIPS} from 'ui/constants/tips'
import {TabIconType, TabType, AuthSceneType} from '@/enums'

import {loadCollection, getParentArr, newCollection} from '@/utils/database_utils'
import {queryRequestMetaById, insertRequestMeta, updateRequestMeta} from '@/database/request_meta'
import {publishCollectionModalOpen, publishRequestModalOpen} from '@/utils/event_utils'

const { Option } = Select;
const {Paragraph, Link, Text} = Typography
class AuthorizationSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collectionName: 'api-new',
            auth: props.value || {}
        }
    }

    refreshParentArr = async (parentId) => {
        if (parentId) {
            let parentArr = await getParentArr(parentId);
            this.setState({parentArr: parentArr});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.parentId !== this.props.parentId) {
            this.refreshParentArr(nextProps.parentId);
        }
        if (nextProps.hasOwnProperty('value')) {
            this.setState({auth: nextProps.value})
        }
    }

    componentDidMount() {
        this.refreshParentArr(this.props.parentId)
    }

    getRealAuth = () => {
        return this.props.hasOwnProperty('value') ? this.props.value : this.state.auth
    }

    handleAuthTypeChange = (value) => {
        const {auth} = this.state;
        auth.type = value;
        
        this.setState({ auth: auth })
        this.props.onChange({
            type: value, 
            [auth.type]: auth[auth.type]
        });
    }

    handleItemChange = (value, key) => {
        const {auth} = this.state;
        let keys = auth[auth.type] || [];

        let targetItem = keys.find(keyItem => keyItem.key === key);
        if (targetItem) {
            targetItem.value = value;
        } else {
            keys.push({key: key, value: value});
        }
        auth[auth.type] = keys;
        this.setState({ auth: auth });
       
        this.props.onChange({
            type: auth.type,
            [auth.type]: keys
        });
    }

    handleOpenCollectionModal =  () => {
        publishCollectionModalOpen({collectionId: this.props.parentId, scene: 'edit', extend: {activeKey: 'authorization'}})
    }

    render() {

        const {parentArr = [], auth = {}} = this.state;

        const {parentId, scene, deleted} = this.props;
        const authorizationTypes = [
            {
                label: 'No Auth', 
                value: 'noauth',
                content: NO_AUTH_TIPS(AuthSceneType.REQUEST.name() === scene ? 'request' : (parentId ? 'folder' : 'collection'))
            },
            {
                label: 'API Key', 
                value: 'apikey',
                items: [
                    { label: 'Key', key: 'key' },
                    { label: 'Value', key: 'value' },
                    { label: 'Add to', key: 'in', type: 'select', defaultValue: 'params', options: [
                        {label: 'Header', value: 'header'}, 
                        {label: 'Query Params', value: 'params'}] 
                    }
                ],
            },
            {
                label: 'Bearer Token', value: 'bearer',
                items: [
                    { label: 'Token', key: 'token' }
                ]
            },
            {
                label: 'Basic Auth', value: 'basic', 
                items: [
                    { label: 'Username', key: 'username' },
                    { label: 'Password', key: 'password', type: 'password' },
                ]
            },
            {
                label: 'Digest Auth', value: 'digest'
            },
            {
                label: 'OAuth 1.0', value: 'oauth1'
            },
            {
                label: 'OAuth 2.0', value: 'oauth2'
            },
            {
                label: 'Hawk Authentication', value: 'hawk'
            },
            {
                label: 'AWS Signature', value: 'aws'
            },
            {
                label: 'NTLM Authentication [Beta]', value: 'ntlm'
            }
        ];
        console.log('-=======================ssene: %s', scene);
        if (scene === AuthSceneType.REQUEST.name() || parentId) {
            let contentText = '', targetParentName = '';
            const hasSetAuthParent = parentArr.filter(item => item.auth && item.auth.type && item.auth.type !== 'noauth' && item.auth.type !== 'inherit');
            const targetParent = hasSetAuthParent.length === 0 ? (parentArr.length > 0 ? parentArr[0] : null) : hasSetAuthParent[hasSetAuthParent.length - 1];
            if (AuthSceneType.REQUEST.name() === scene) {
                if (!parentId || deleted) {
                    contentText = "This request is not inheriting any authorization helper at the moment. Save it in a collection to use the parent's authorization helper.";
                } else {
                    contentText = `This request is using an authorization helper from ${hasSetAuthParent.length === 0 ? 'collection' : 'folder'} `;
                    targetParentName = targetParent ? targetParent.name : '';
                    targetParentName = <Typography.Link underline onClick={this.handleOpenCollectionModal}>{targetParentName}</Typography.Link>
                }
                
            } else {
                contentText = `This folder is using ${targetParent && targetParent.auth ? authorizationTypes.find(item => item.value === targetParent.auth.type).label : authorizationTypes[0].label} from ${targetParent && targetParent.parentId ? 'folder' : 'collection'} ${targetParent ? targetParent.name : ''}`
                targetParentName = <Typography.Link underline onClick={this.handleOpenCollectionModal}>{targetParentName}</Typography.Link>
            }
            authorizationTypes.unshift(
                {
                    label: 'Inherit auth from parent', 
                    value: 'inherit',
                    content: (
                        <Typography.Paragraph>
                            {contentText}{targetParentName}
                        </Typography.Paragraph>
                    )
                },
            )
        }

        let {type: authType = authorizationTypes[0].value} = auth;
        let authValue = auth[authType] || [];
      
        let selectedType = authorizationTypes.find(type => type.value === authType);
        return (
            <Row>
                <Col span={10} style={{borderRight: '1px solid #f0f0f0', padding: '15px 10px'}}>
                    <Space direction="vertical" size={16}>
                        <Space direction="vertical" size={2}>
                            <Text strong>TYPE</Text>
                            <Select defaultValue="apikey" style={{ width: 200 }} onChange={this.handleAuthTypeChange} value={authType}>
                                {
                                    authorizationTypes.map(type => (
                                        <Option key={type.value} value={type.value}>{type.label}</Option>
                                    ))
                                }
                                
                            </Select>
                        </Space>
                        {HAVE_AUTH_TIPS}
                    </Space>
                    
                </Col>
                <Col span={14} className="horizontal-center vertical-center request-header-form" style={{padding: 20}}>
                    {
                        selectedType.content ? selectedType.content : (
                            <Form
                                name="basic"
                                colon={false}
                                className="full-width"
                                labelAlign="left"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                >
                                {
                                    selectedType.items && selectedType.items.map((item, index) => {
                                        const {label, key, content, type, options, defaultValue} = item;

                                        let itemConfig = authValue.find(item => item.key === key);
                                        let realDefaultValue = (itemConfig && itemConfig.value) || defaultValue;
                                        let renderComponent;
                                        switch (type) {
                                            case 'select': 
                                                renderComponent = <Select defaultValue={realDefaultValue} options={options} onChange={(value) => this.handleItemChange(value, key)} />;
                                                break;
                                            case 'customize': 
                                                renderComponent = content;
                                                break;
                                            case 'password': 
                                                renderComponent = <Input.Password placeholder={label} defaultValue={realDefaultValue} onChange={(e) => this.handleItemChange(e.target.value, key)} />
                                                break;
                                            default:  
                                                renderComponent = <Input defaultValue={realDefaultValue} placeholder={label} onChange={(e) => this.handleItemChange(e.target.value, key)} />
                                                break;
                                        }
                                        return <Form.Item key={selectedType.value + '-' + key} label={label}>{renderComponent}</Form.Item>;
                                    })
                                }
                            </Form>
                        )
                    }
                    
                </Col>
            </Row>
        )
    }
}

export default AuthorizationSetting;

AuthorizationSetting.defaultProps = {
    onChange: () => {},
}







