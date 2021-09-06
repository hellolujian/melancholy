import React from 'react';
import {Select , Button, Row, Col, Typography, Form, Input, Checkbox, Space} from 'antd';
import {NO_AUTH_TIPS, HAVE_AUTH_TIPS} from 'ui/constants/tips'
const { Option } = Select;
const {Paragraph, Link, Text} = Typography
class AuthorizationSetting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collectionName: 'api-new',
            selectedValue: 'apikey'
        }
    }

    componentDidMount() {
      
    }

    handleChange = (value) => {
        this.setState({ selectedValue: value })
    }

    render() {

        const {collectionName, selectedValue} = this.state;

        const authorizationTypes = [
            {
                label: 'Inherit auth from parent', value: 'inherit',
                content: (
                    <Typography.Paragraph>
                        This request is using an authorization helper from collection <Typography.Link underline>{this.state.collectionName}</Typography.Link>
                    </Typography.Paragraph>
                )
            },
            {
                label: 'No Auth', value: 'noauth',
                content: NO_AUTH_TIPS
            },
            {
                label: 'API Key', value: 'apikey',
                content: (
                    <Form
                        className="full-width"
                        labelAlign="left"
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        >
                        <Form.Item
                            label="Key"
                            name="key"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input placeholder="Key" />
                        </Form.Item>

                        <Form.Item
                            label="Value"
                            name="value"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input placeholder="Value" />
                        </Form.Item>

                        <Form.Item
                            label="Add to"
                            name="position"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Select 
                                options={[
                                    {label: 'Header', value: 'header'}, 
                                    {label: 'Query Params', value: 'params'}
                                ]} 
                            />
                        </Form.Item>
                    </Form>
                )
            },
            {
                label: 'Bearer Token', value: 'bearertoken',
                content: (
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        >
                        <Form.Item
                            label="Token"
                            name="token"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input placeholder="Token" />
                        </Form.Item>

                    </Form>
                )
            },
            {
                label: 'Basic Auth', value: 'basic', 
                content: (
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        
                        >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                            <Checkbox>Show Password</Checkbox>
                        </Form.Item>

                    </Form>
                )
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
        ]
      
        return (
            <Row>
                <Col span={10} style={{borderRight: '1px solid #f0f0f0', padding: '15px 10px'}}>
                    <Space direction="vertical" size={16}>
                        <Space direction="vertical" size={2}>
                            <Text strong>TYPE</Text>
                            <Select defaultValue="apikey" style={{ width: 200 }} onChange={this.handleChange}>
                                {
                                    authorizationTypes.map(type => (
                                        <Option value={type.value}>{type.label}</Option>
                                    ))
                                }
                                
                            </Select>
                        </Space>
                        {HAVE_AUTH_TIPS}
                    </Space>
                    
                </Col>
                <Col span={14} className="horizontal-center vertical-center request-header-form" style={{padding: 20}}>
                    {
                        authorizationTypes.find(type => type.value === selectedValue).content
                    }
                </Col>
            </Row>
        )
    }
}

export default AuthorizationSetting;







