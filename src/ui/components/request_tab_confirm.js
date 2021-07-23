import React from 'react';
import {Modal, Button, Space, Checkbox, Typography} from 'antd';

class RequestTabConfirm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    show = (tabInfo) => {
        this.setState({tabInfo: tabInfo, visible: true});
    }

    handleCancel = () => {
        this.setState({visible: false});
    }

    render() {
     
        const { visible, tabInfo = {} } = this.state;
        
        return (
            <Modal
            className="request-tab-confirm-modal"
            visible={visible}
            title="DO YOU WANT TO SAVE? "
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={(
                <div className="justify-content-space-between request-tab-confirm-footer">
                    <Button onClick={this.handleCancel}>Don't save</Button>
                    <Space>
                        <Button onClick={this.handleOk}>Cancel</Button>,
                        <Button type="primary" onClick={this.handleOk}>Save changes</Button>
                    </Space>
                </div>
            )}>
            <p>
                This tab <Typography.Text strong>{tabInfo.name}sdfs</Typography.Text> has unsaved changes which will be lost if you choose to close it. Save these changes to avoid losing your work.
            </p>
            <Space align="start">
                <Checkbox />
                <Space direction="vertical" size={0}>
                    <span>Do not ask me again</span>
                    <span style={{color: 'lightgray'}}>You can change this anytime from your Settings</span>
                </Space>
            </Space>
            </Modal>
        )
    }
}

export default RequestTabConfirm;







