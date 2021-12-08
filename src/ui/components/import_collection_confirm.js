import React from 'react';
import {Modal, Button, Space, Checkbox, Typography} from 'antd';
import {subscribeImportCollectionModalShow} from '@/utils/event_utils'
import {parseCollectionJsonFile, executeDeleteCollection} from '@/utils/business_utils'
import {deleteCollection, } from '@/utils/database_utils'

import PostmanButton from './postman_button'
class ImportCollectionConfirm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            importList: [],
        }
    }

    handleModalShow = (msg, importData) => {
        if (importData) {
            const {importList} = this.state;
            importList.push(importData);
            this.setState({importList: importList, visible: true});
        }
    }

    componentDidMount() {
        subscribeImportCollectionModalShow(this.handleModalShow)
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

    doCopy = (importInfo) => {
        const {fileJson = {}} = importInfo;
        const {info = {}} = fileJson;
        let newInfoObj = {...info, name: info.name + ' Copy'}
        parseCollectionJsonFile({...fileJson, info: newInfoObj})
    }

    doReplace = async (importInfo) => {
        const {existCollectionId, fileJson} = importInfo;
        await executeDeleteCollection(existCollectionId)
        await parseCollectionJsonFile(fileJson)
    }

    handleCopy = () => {
        this.handleClose(this.doCopy);
    }

    handleReplace = () => {
        this.handleClose(this.doReplace)
    }

    render() {
     
        const { visible, importList } = this.state;
        const importInfo = importList.length > 0 ? importList[0] : {};
        const {fileJson = {}} = importInfo;
        const {name = ''} = fileJson;
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

export default ImportCollectionConfirm;

ImportCollectionConfirm.defaultProps = {
    onCopy: () => {},
    onReplace: () => {},
    onCancel: () => {},
}







