import React from 'react';
import {Popover, Button, Typography, Table, Space, Divider, Alert} from 'antd';
import TooltipButton from './tooltip_button'
import {
    VARIABLE_TIPS,
    VARIABLE_VALUE_TIPS,
    ENVIRONMENT_TEXT_TIPS,
    ENVIRONMENT_LINK_TIPS,
    NO_ENVIRONMENT_VARIABLES_TIPS,
    AUTHORIZATION_TIPS,
    PRE_REQUEST_SCRIPTS_TIPS,
    TESTS_TIPS
} from 'ui/constants/tips'
import { EyeOutlined, SettingFilled  } from '@ant-design/icons';

class EnvironmentDetailCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            envVariables: [
                {
                    id: 'api-new',
                    key: 'api-new',
                    initialValue: 'api-new',
                    currentValue: 'api-new2'

                }
            ],
            globalVariables: [
                {
                    id: 'test',
                    key: 'test',
                    initialValue: 'test',
                    currentValue: 'test2'

                }
            ],
            environmentInfo: {
                id: 'qa', name: 'qa'
            }
        }
    }

    componentDidMount() {
      
    }

    columns: [
        {
            title: "VARIABLE", 
            dataIndex: 'variable',
        },
        {
            title: "INITIAL VALUE", 
            dataIndex: 'initialValue',
        },
        {
            title: "CURRENT VALUE", 
            dataIndex: 'currentValue',
        },
    ]

    render() {
     
        let {environmentInfo, globalVariables, envVariables} = this.state;
      
        let columns = [
            {
                title: "VARIABLE", 
                dataIndex: 'id',
            },
            {
                title: "INITIAL VALUE", 
                dataIndex: 'initialValue',
            },
            {
                title: "CURRENT VALUE", 
                dataIndex: 'currentValue',
            },
        ]
        let cardContent = (
            <Space direction="vertical">
                <Space direction="vertical" className="full-width">
                    <div className="justify-content-space-between vertical-center">
                        <Typography.Text strong>qa</Typography.Text>
                        <Button type="link">Edit</Button>
                    </div>
                    
                    

                    <Space direction="vertical" align="center" className="full-width">
                        {NO_ENVIRONMENT_VARIABLES_TIPS}
                        {ENVIRONMENT_TEXT_TIPS}
                        {ENVIRONMENT_LINK_TIPS}
                    </Space>
                    <Table columns={columns} dataSource={envVariables} pagination={false} />
                </Space>

                <Space direction="vertical" className="full-width">
                    <div className="justify-content-space-between vertical-center">
                        <Typography.Text strong>Globals</Typography.Text>
                        <Button type="link">Edit</Button>
                    </div>
                    <Table columns={columns} dataSource={globalVariables} pagination={false} />
                </Space>

                {/* <Space direction="vertical" align="center" className="full-width">
                    <Typography.Text strong>No global variables</Typography.Text>
                    <span>Global variables are a set of variables that are always available in a workspace.</span>
                    <Typography.Link>Learn more about globals</Typography.Link>
                </Space> */}
                <Alert
                    // style={{position: 'absolute', bottom: 70}}
                    description={VARIABLE_VALUE_TIPS}
                    type="info"
                    showIcon
                    closable
                    onClose={this.handleVariableValuesTipClose}
                />
            </Space>
            
        );
        return (
            <Popover content={cardContent} overlayStyle={{width: 800}}>
                <TooltipButton type="default" icon={<EyeOutlined />} />
            </Popover>
        )
    }
}

export default EnvironmentDetailCard;







