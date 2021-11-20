import React from 'react';
import {Modal, Button, Space, Checkbox, Typography} from 'antd';

import PostmanButton from './postman_button'
class ImportFileConfirm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            importList: [],
        }
    }

    componentDidMount() {
      
    }

    show = (importData) => {
        if (importData) {
            const {importList} = this.state;
            importList.push(importData);
            this.setState({importList: importList, visible: true});
        }
    }

    handleClose = async (callback) => {
        const {importList} = this.state;
        if (importList.length === 0) {
            this.setState({visible: false});
        }
        const importInfo = importList.pop();
        await callback(importInfo);
        if (importList.length > 0) {
            this.setState({importList: importList})
        } else {
            this.setState({visible: false, importList: importList})
        }
    }

    handleCancel = () => {
        this.handleClose(this.props.onCancel);
    }

    handleCopy = () => {
        this.handleClose(this.props.onCopy);
    }

    handleReplace = () => {
        this.handleClose(this.props.onReplace)
    }

    render() {
     
        const { visible, importList } = this.state;
        const importInfo = importList.length > 0 ? importList[importList.length - 1] : {};
        const {name} = importInfo;
        return (
            <Modal
                visible={visible}
                zIndex={2000}
                title="COLLECTION EXISTS"
                onCancel={this.handleCancel}
                footer={(
                    <Space className="justify-content-flex-end">
                        <PostmanButton onClick={this.handleReplace}>
                            Replace
                        </PostmanButton>
                        <Button 
                            type="primary" 
                            onClick={this.handleCopy}>
                            Import as Copy
                        </Button>
                    </Space>
                )}>

                    <div>
                        A collection {name} already exists .
                    </div>
                    <div>
                        What would you like to do ?
                    </div>
                        
            </Modal>
        )
    }
}

export default ImportFileConfirm;

ImportFileConfirm.defaultProps = {
    onCopy: () => {},
    onReplace: () => {},
    onCancel: () => {},
}







