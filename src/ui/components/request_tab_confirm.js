import React from 'react';
import {Modal, Button, Space, Checkbox, Typography} from 'antd';

class RequestTabConfirm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
           tabList: [],
        }
    }

    componentDidMount() {
      
    }

    show = (tabList) => {
        if (tabList && tabList.length > 0) {
            this.setState({tabList: [...tabList], visible: true});
        }
    }

    handleClose = (callback) => {
        const {tabList} = this.state;
        const tabInfo = tabList.pop();
        this.setState({visible: false}, async () => {
            await callback(tabInfo);
            if (tabList.length > 0) {
                this.show(tabList);
            }
        });
        
    }

    handleCancel = () => {
        this.handleClose(this.props.onCancel);
    }

    handleNotSave = (saved) => {
        this.handleClose(this.props.onNotSave);
    }

    handleSave = () => {
        this.handleClose(this.props.onSave);
    }

    render() {
     
        const { visible, tabList } = this.state;

        const tabInfo = tabList.length > 0 ? tabList[tabList.length - 1] : {};
        
        return (
            <Modal
            className="request-tab-confirm-modal"
            visible={visible}
            title="DO YOU WANT TO SAVE? "
            onCancel={this.handleCancel}
            footer={(
                <div className="justify-content-space-between request-tab-confirm-footer">
                    <Button onClick={this.handleNotSave}>Don't save</Button>
                    <Space>
                        <Button onClick={this.handleCancel}>Cancel</Button>,
                        <Button type="primary" onClick={this.handleSave}>Save changes</Button>
                    </Space>
                </div>
            )}>
            <p>
                This tab <Typography.Text strong>{tabInfo.name}</Typography.Text> has unsaved changes which will be lost if you choose to close it. Save these changes to avoid losing your work.
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

RequestTabConfirm.defaultProps = {
    onSave: () => {},
    onNotSave: () => {},
    onCancel: () => {},
}







