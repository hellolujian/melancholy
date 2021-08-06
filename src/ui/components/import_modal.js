import React from 'react';
import {Upload, Tabs , Space, Typography, Button, Input} from 'antd';

import TooltipButton from './tooltip_button'
import ButtonModal from './button_modal'

import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'

const { Dragger } = Upload;
const { TabPane } = Tabs;
class ImportModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    render() {
     
        const {title, color = 'gray', label, type} = this.props
        
        const props = {
            name: 'file',
            multiple: true,
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            onChange(info) {
              const { status } = info.file;
              if (status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
            //   if (status === 'done') {
            //     message.success(`${info.file.name} file uploaded successfully.`);
            //   } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            //   }
            },
            onDrop(e) {
              console.log('Dropped files', e.dataTransfer.files);
            },
          };
        return (
            <ButtonModal 
                label="Import" 
                tooltipProps={{title: IMPORT_TITLE}} 
                modalProps={{title: "IMPORT", okText: 'Import', cancelButtonProps: {style: {display: "none"}}}} 
                modalContent={(
                    <Space direction="vertical">
                        <Typography.Paragraph>Import a Postman Collection, Environment, data dump, curl command, or a RAML / WADL / Open API (1.0/2.0/3.0) / Runscope file.</Typography.Paragraph>
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab="Import File" key="file">
                                <Dragger {...props}>
                                    <Typography.Title level={3} className="ant-upload-text">Drop files here</Typography.Title>
                                    <Button size="large" type="primary">Choose Files</Button>
                                </Dragger>
                            </TabPane>
                            <TabPane tab="Import Folder" key="folder">
                                <Dragger {...props}>
                                    <Typography.Title level={3} className="ant-upload-text">
                                        Drop folders here
                                    </Typography.Title>
                                    <Button size="large" type="primary">Choose Folders</Button>
                                </Dragger>
                            </TabPane>
                            <TabPane tab="Import From Link" key="link">
                                <Input placeholder="Enter a URL and press Import" />
                            </TabPane>
                            <TabPane tab="Paste Raw Text" key="raw">
                                <Input.TextArea rows={12} />
                            </TabPane>
                        </Tabs>
                    </Space>
                )}
            />
        )
    }
}

export default ImportModal;







