import React from 'react';
import {Input, Row, Col, Button, Steps , Modal, Space, Typography, Card, Divider, Form} from 'antd';

import MarkdownEditor from 'ui/components/markdown_editor'
import MultiToggle from 'react-multi-toggle';
import PostmanButton from './postman_button';
import {
    VARIABLE_TIPS,
    VARIABLE_VALUE_TIPS,
    COLLECTION_DESCRIPTION_TIPS,
    DESCRIPTION_TIPS,
    DESCRIPTION_MARKDOWN_TIPS,
    AUTHORIZATION_TIPS,
    PRE_REQUEST_SCRIPTS_TIPS,
    TESTS_TIPS
} from 'ui/constants/tips'

import {SQUARE_PLUS_ICON, ADD_REQUEST_ICON, ADD_REQUEST_ICON_48, COLLECTION_ICON_48, COLLECTION_ICON_32, ENVIRONMENT_ICON, ENVIRONMENT_ICON_48,
    MOCK_COLLECTION, MOCK_COLLECTION_48, MONITOR_COLLECTION_ICON, CIRCLE_DOT_ICON, DOCUMENTATION_ICON, DOCUMENTATION_ICON_48, CLOSE_SVG,CLOSE_ICON
} from 'ui/constants/icons';


import ApiTable from './api_table'
const { Step } = Steps;
const { Meta } = Card;
const {Text, Link} = Typography;

class DocumentationModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groupSize: 2,
            currentStep: 0,
            // visible: props.visible
        }
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        console.log('adasdasd');
    }

    handleOk = () => {}

    handleModalCancel = () => {
        this.props.onVisibleChange(false);
    }

    onGroupSizeSelect = value => this.setState({ groupSize: value });

    NEXT_STEPS = [
        {
            title: 'Visit the documentation',
            desc: (
                <Link>GO !</Link>
            )
        },
        {
            title: 'Make the documentation public',
            desc: (
                <Text type="secondary">Add your own branding publish the documentation for everyone to see. <Link href="https://learning.postman.com/docs/publishing-your-api/publishing-your-docs/">Learn more</Link>
                </Text>

            )
        },
        {
            title: 'Organize requests into folders',
            desc: (
                <Text type="secondary">
                    Create a new folder in the sidebar and drag your requests inside the new folder. <Link href="https://learning.postman.com/docs/sending-requests/intro-to-collections/">Learn more</Link>
                </Text>
            )
        },
        {
            title: 'Add sample responses',
            desc: (
                <Text type="secondary">
                    Response are saved as <Text strong>Examples</Text> in a request. <Link href="https://learning.postman.com/docs/sending-requests/examples/">Learn more</Link>
                </Text>
            )
        }
    ]

    handleNextBtnClick = () => {
        this.setState({
            currentStep: 1
        })
    }

    handleCreateBtnClick = () => {
        this.setState({
            currentStep: 2
        })
    }

    handleBackBtnClick = () => {
        let {currentStep} = this.state;
        if (currentStep === 0) {
            this.props.onVisibleChange(false, true);
        }
    }

    render() {
     
        const {workspaceId, collectionId, folderId, visible} = this.props;
        const {groupSize, currentStep} = this.state;
        return (
            <div>
                
            <Modal 
                centered
                // bodyStyle={{ height: 400}}
                destroyOnClose={true}
                okText="Create"
                width={900}
                visible={visible} 
                onOk={this.handleOk} 
                title={
                    <Steps style={{width: 650}} size="small" current={currentStep}>
                        <Step title="Select requests to document"  />
                        <Step title="Configure documentation" />
                        <Step title="Next steps"  />
                    </Steps>
                }
                footer={
                    <Space>
                        {
                            currentStep !== 2 && (
                                <PostmanButton onClick={this.handleBackBtnClick}>Back</PostmanButton>
                            )
                        }
                        {
                            currentStep === 0 && (
                                <Button type="primary" onClick={this.handleNextBtnClick}>Next</Button>
                            )
                        }
                        {
                            currentStep === 1 && (
                                <Button type="primary" onClick={this.handleCreateBtnClick}>Create</Button>
                            )
                        }
                        {
                            currentStep === 2 && (
                                <Button type="primary" onClick={this.handleModalCancel}>Close</Button>
                            )
                        }
                    </Space>
                }
                onCancel={this.handleModalCancel}>
                    
                {
                    currentStep === 0 && (
                        <>
                            <MultiToggle
                                options={[
                                    {
                                    displayName: 'Create a new API',
                                    value: 2
                                    },
                                    {
                                    displayName: 'Use collection from this workspace',
                                    value: 4
                                    },
                                ]}
                                selectedOption={groupSize}
                                onSelectOption={this.onGroupSizeSelect}
                            />
                            <Typography.Paragraph type="secondary">
                            Enter the requests you want to document. Add headers and sample responses to these requests by clicking on the (•••) icon.
                            </Typography.Paragraph>

                            {
                                groupSize === 4 ? (
                                    <Card>
                                        <Space wrap>
                                        {
                                            [1,3,4,5,6].map((item, index) => (
                                                <Card bordered={false} hoverable key={index}>
                                                    <Meta
                                                        avatar={COLLECTION_ICON_32}
                                                        title="collection 1"
                                                        description="6 requests"
                                                    />
                                                </Card>
                                            ))
                                        }
                                        </Space>
                                        
                                    </Card>
                                ) : (
                                    <ApiTable />
                                )
                                
                            }
                        </>
                    )
                }

                {
                    currentStep === 1 && (
                        <Form layout="vertical">
                            <Form.Item label="Name">
                                <Row gutter={[16, 16]}>
                                    <Col span={14}><Input /></Col>
                                    <Col span={10} style={{padding: '0px 8px'}}>
                                    <Typography.Text type="secondary">
                                    Enter a title to describe your requests. This will help you identify your documentation and API collection in Postman.
                                    </Typography.Text>
                                    </Col>
                                </Row>
                                
                            </Form.Item>
                            <Form.Item label="Add a description">
                                <Row gutter={[16, 16]}>
                                    <Col span={14}>
                                        <MarkdownEditor />
                                    </Col>
                                    <Col span={10} style={{padding: '0px 8px'}}>
                                        <Space direction="vertical">
                                        <Typography.Text type="secondary">
                                        Add a general description for your requests, eg. overview and authentication details. 
                                        </Typography.Text>
                                        <Typography.Text type="secondary">
                                        You can use <Typography.Link href="https://learning.postman.com/docs/collaborating-in-postman/commenting-on-collections/">markdowon</Typography.Link> for adding headings, lists, code snippets etc. in your description.
                                        </Typography.Text>
                                        </Space>
                                    
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    )
                }

                {
                    currentStep === 2 && (
                        <>
                            <Card bordered={false}>
                                <Meta
                                    avatar={DOCUMENTATION_ICON_48}
                                    title="collection 1 documentation created"
                                    description="This documentation is generated based on your inputs and is private."
                                />
                            </Card>

                            <Divider orientation="left">NEXT STEPS</Divider>

                            {
                                this.NEXT_STEPS.map((item, index) => (
                                    <Card bodyStyle={{padding: '24px 0px 0px 24px'}} className="next-steps-item-card" bordered={false} key={index}>
                                        <Meta
                                            avatar={CIRCLE_DOT_ICON}
                                            title={item.title}
                                            description={item.desc}
                                        />
                                    </Card>
                                ))
                            }
                        
                        </>
                    )
                    
                }
            </Modal>
        
            </div>
        );
    }
}

export default DocumentationModal;

DocumentationModal.defaultProps = {
    onVisibleChange: () => {},
}






