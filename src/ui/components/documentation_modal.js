import React from 'react';
import {Input, Tabs, Button, Steps , Modal, Space, Typography, Card, Divider} from 'antd';

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

const { Step } = Steps;
const { Meta } = Card;
const {Text, Link} = Typography;

class DocumentationModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groupSize: 2
            // visible: props.visible
        }
    }

    componentDidMount() {
        
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

    render() {
     
        const {workspaceId, collectionId, folderId, visible} = this.props;
        const {groupSize} = this.state;
        return (
            <Modal 
                centered
                // bodyStyle={{ height: 600}}
                okButtonProps={{}}
                okText="Create"
                width={800}
                visible={visible} 
                onOk={this.handleOk} 
                title={
                    <Steps style={{width: 650}} size="small" current={1}>
                        <Step title="Select requests to document"  />
                        <Step title="Configure documentation" />
                        <Step title="Next steps"  />
                    </Steps>
                }
                footer={
                    <Space>
                        <PostmanButton>Back</PostmanButton>
                        <Button type="primary">Next</Button>
                        <Button type="primary">Close</Button>
                    </Space>
                }
                onCancel={this.handleModalCancel}>
                    
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
                            <Card bordered={false} key={index}>
                                <Meta
                                    avatar={CIRCLE_DOT_ICON}
                                    title={item.title}
                                    description={item.desc}
                                />
                            </Card>
                        ))
                    }
                
            </Modal>
        );
    }
}

export default DocumentationModal;

DocumentationModal.defaultProps = {
    onVisibleChange: () => {},
}






