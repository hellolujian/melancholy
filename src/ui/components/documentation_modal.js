import React from 'react';
import {Input, Row, Col, Button, Steps , Modal, Space, Typography, Card, Divider, Form} from 'antd';

import DescriptionEditor from 'ui/components/description_editor'
import MultiToggle from 'react-multi-toggle';
import PostmanButton from './postman_button';
import {
    DOCUMENTATION_NAME_TIPS,
    DOCUMENTATION_DESC_TIPS,
    DOCUMENTATION_DESC_MARKDOWN_TIPS,
    COLLECTION_DESCRIPTION_TIPS,
    DESCRIPTION_TIPS,
    DESCRIPTION_MARKDOWN_TIPS,
    AUTHORIZATION_TIPS,
    PRE_REQUEST_SCRIPTS_TIPS,
    TESTS_TIPS
} from 'ui/constants/tips'

import {
    COLLECTION_ICON_32, COLLECTION_ICON_48, DARK_THEME_DOCUMENTATION_ICON_48, DARK_THEME_COLLECTION_ICON_48,
    CIRCLE_DOT_ICON, DARK_THEME_COLLECTION_ICON_32, DOCUMENTATION_ICON_48, DARK_THEME_CIRCLE_DOT_ICON, CLOSE_ICON
} from 'ui/constants/icons';

import {insertCollectionMeta, queryCollectionMetaById, updateCollectionMeta} from '@/database/collection_meta'
import {
    loadCollection,
    addCollectionWithRequests
} from '@/utils/database_utils'

import {
    getByTheme,
} from '@/utils/style_utils'

import {UUID} from '@/utils/global_utils'
import {parseFullUrl} from '@/utils/common_utils'

import ApiTable from './api_table'
const { Step } = Steps;
const { Meta } = Card;
const {Text, Link} = Typography;

class DocumentationModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            createDocWay: 'newapi',
            currentStep: 0,
            // visible: props.visible,
            description: `# Introduction
What does your API do?

# Overview
Things that the developers should know about

# Authentication
What is the preferred way of using the API?

# Error Codes
What errors and status codes can a user expect?

# Rate limit
Is there a limit to the number of requests an user can send?`
            
        }
    }

    componentDidMount = async () => {

        let collectionList = await loadCollection();
        this.setState({collectionList: collectionList})
        
    }

    componentWillUnmount() {
        console.log('adasdasd');
    }

    handleOk = () => {}

    handleModalCancel = () => {
        this.props.onVisibleChange(false);
    }

    handleCreateDocWaySelect = value => this.setState({ createDocWay: value });

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

    handleCreateBtnClick = async () => {
        const {collectionId, documentationName, description, requestList} = this.state;
        if (collectionId) {
            await updateCollectionMeta(collectionId, {$set: {description: description}});
        } else {
            let collectionMetaId = UUID();
            await addCollectionWithRequests({
                name: documentationName,
                id: collectionMetaId,
                description: description
            }, requestList.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                parentId: collectionMetaId,
                method: item.method,
                ...parseFullUrl(item.url),
                body: {
                    mode: 'raw',
                    raw: item.body
                }
            })))
        }
        this.setState({
            currentStep: 2
        })
    }

    handleBackBtnClick = () => {
        let {currentStep} = this.state;
        if (currentStep === 0) {
            this.props.onVisibleChange(false, true);
        }
        if (currentStep === 1) {
            this.setState({currentStep: 0})
        }
    }

    handleDescriptionChange = (value) => {
        this.setState({description: value})
    }

    handleCollectionItemClick = async (item) => {
        let collectionMeta = await queryCollectionMetaById(item.id);
        console.log(collectionMeta);
        if (collectionMeta) {
            this.setState({currentStep: 1, collectionId: item.id, documentationName: collectionMeta.name, description: collectionMeta.description})
        }
    }

    handleDomainNameChange = (e) => {
        this.setState({documentationName: e.target.value})
    }

    handleRequestTableChange = (dataList) => {
        this.setState({requestList: dataList})
    }

    render() {
     
        const {workspaceId, collectionId, folderId, visible} = this.props;
        const {createDocWay, currentStep, description, documentationName, 
            collectionList = [], requestList = []} = this.state;
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
                                <Button type="primary" disabled={requestList.length === 0} onClick={this.handleNextBtnClick}>Next</Button>
                            )
                        }
                        {
                            currentStep === 1 && (
                                <Button type="primary" disabled={documentationName ? false : true} onClick={this.handleCreateBtnClick}>Create</Button>
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
                                    value: 'newapi'
                                    },
                                    {
                                    displayName: 'Use collection from this workspace',
                                    value: 'fromexist'
                                    },
                                ]}
                                selectedOption={createDocWay}
                                onSelectOption={this.handleCreateDocWaySelect}
                            />
                            <Typography.Paragraph type="secondary">
                            Enter the requests you want to document. Add headers and sample responses to these requests by clicking on the (•••) icon.
                            </Typography.Paragraph>

                            {
                                createDocWay === 'fromexist' ? (
                                    <Card>
                                        <Space wrap>
                                        {
                                            collectionList.map((item, index) => (
                                                <Card bordered={false} hoverable key={index} onClick={() => this.handleCollectionItemClick(item)}>
                                                    <Meta
                                                        avatar={getByTheme(COLLECTION_ICON_32, DARK_THEME_COLLECTION_ICON_32)}
                                                        title={item.name}
                                                        description={`${item.requestCount} ${item.requestCount > 1 ? 'requests' : 'request'}`}
                                                    />
                                                </Card>
                                            ))
                                        }
                                        </Space>
                                        
                                    </Card>
                                ) : (
                                    <ApiTable 
                                        onChange={this.handleRequestTableChange}
                                    />
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
                                    <Col span={14}>
                                        <Input 
                                            value={documentationName} 
                                            disabled={createDocWay === 'fromexist'}
                                            autoFocus
                                            onChange={this.handleDomainNameChange}
                                        />
                                    </Col>
                                    <Col span={10} style={{padding: '0px 8px'}}>
                                    {DOCUMENTATION_NAME_TIPS}
                                    </Col>
                                </Row>
                                
                            </Form.Item>
                            <Form.Item label="Add a description">
                                <Row gutter={[16, 16]}>
                                    <Col span={14}>
                                        <DescriptionEditor 
                                            mdEditorShow
                                            scene="document"
                                            // mdEditorProps={{style: {height: "300px"}}} 
                                            defaultValue={description} 
                                            onChange={this.handleDescriptionChange}
                                        />
                                    </Col>
                                    <Col span={10} style={{padding: '0px 8px'}}>
                                        <Space direction="vertical">
                                        {DOCUMENTATION_DESC_TIPS}
                                        {DOCUMENTATION_DESC_MARKDOWN_TIPS}
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
                                    avatar={getByTheme(DOCUMENTATION_ICON_48, DARK_THEME_DOCUMENTATION_ICON_48)}
                                    title={documentationName + " documentation created"}
                                    description="This documentation is generated based on your inputs and is private."
                                />
                            </Card>
                            {
                                createDocWay === 'newapi' && (
                                    <Card bordered={false}>
                                        <Meta
                                            avatar={getByTheme(COLLECTION_ICON_48, DARK_THEME_COLLECTION_ICON_48)}
                                            title={documentationName + " collection created"}
                                            description="This collection contains all the requests which are being documented"
                                        />
                                    </Card>
                                )
                            }

                            <Divider orientation="left">NEXT STEPS</Divider>

                            {
                                this.NEXT_STEPS.map((item, index) => (
                                    <Card bodyStyle={{padding: '24px 0px 0px 24px'}} className="next-steps-item-card" bordered={false} key={index}>
                                        <Meta
                                            avatar={getByTheme(CIRCLE_DOT_ICON, DARK_THEME_CIRCLE_DOT_ICON)}
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






