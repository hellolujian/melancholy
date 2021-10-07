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

    show = (tabList, justSave = false) => {
        if (tabList && tabList.length > 0) {
            this.setState({tabList: [...tabList], visible: true, justSave: justSave});
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

    handleSaveAs = () => {
        this.handleClose(this.props.onSaveAs)
    }

    render() {
     
        const { visible, tabList, justSave } = this.state;
        const tabInfo = tabList.length > 0 ? tabList[tabList.length - 1] : {};
        const {conflict} = tabInfo;
        let commonPart = (<>This tab <Typography.Text strong>{tabInfo.name}</Typography.Text> has </>);
        let justSavePart = 'been modified from another tab. Saving these changes will overwrite the response.'
        let closeCommonPart = 'unsaved changes which will be lost if you choose to close it. ';
        let closeConflictPart = 'This request has been modified from another tab. Saving these changes will overwrite the request. ';
        let closeNotConflictPart = 'Save these changes to avoid losing your work. ';
        let cancelButton = (<Button style={{width: 120}} onClick={this.handleCancel}>Cancel</Button>)

        let saveButton = (
            <Button type="primary" onClick={this.handleSave}>
                { conflict ? "Save and overwrite" : "Save changes"}
            </Button>
        )
        let notSaveButton = (
            <Button onClick={this.handleNotSave}>
                { conflict ? 'Discard changes in this tab' : "Don't save" }
            </Button>
        )

        return (
            <Modal
            className="request-tab-confirm-modal"
            visible={visible}
            title="DO YOU WANT TO SAVE? "
            onCancel={this.handleCancel}
            footer={(
                <div className="request-tab-confirm-footer">
                    <div className="justify-content-space-between">
                        {
                            justSave ? (
                                <>
                                    {cancelButton}
                                    {saveButton}
                                </>
                            ) : (
                                <>
                                    {notSaveButton}
                                    <Space>
                                        {!conflict && cancelButton}
                                        {saveButton}
                                    </Space>
                                </>
                            )
                        }
                    </div>
                    {
                        conflict && (
                            <div>
                                <Button type="link" onClick={this.handleSaveAs}>Save as a new request</Button>
                            </div>
                        )
                    }
                </div>
                
            )}>
            <p>
                {commonPart}{justSave ? justSavePart : closeCommonPart + (conflict ?  closeConflictPart : closeNotConflictPart)}
            </p>
            {
                !justSave && (
                    <Space align="start">
                        <Checkbox />
                        <Space direction="vertical" size={0}>
                            <span>Do not ask me again</span>
                            <span style={{color: 'lightgray'}}>You can change this anytime from your Settings</span>
                        </Space>
                    </Space>
                )
            }
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







