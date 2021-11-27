import React from 'react';
import {Upload, Tabs , Space, Typography, Button, Input, Row, Col} from 'antd';

import TooltipButton from './tooltip_button'
import ButtonModal from './button_modal'
import { 
    UserOutlined, CaretDownFilled, PlusSquareFilled,SyncOutlined,
    ReadOutlined, ToolFilled ,NotificationFilled , EnvironmentFilled ,
    FolderViewOutlined ,DatabaseOutlined  , PullRequestOutlined  
} from '@ant-design/icons';

import GeneralSettings from './settings/general_settings'
import ShortcutsSettings from './settings/shortcuts_settings'
import DataSettings from './settings/data_settings'
import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'

const { Dragger } = Upload;
const { TabPane } = Tabs;

class SettingsModal extends React.Component {

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

        const tabs = [
            {
                label: 'General',
                value: 'general',
                content: <GeneralSettings />
            },
            {
                label: 'Themes',
                value: 'themes',
                content: (
                    null
                )
            },
            {
                label: 'Shortcuts',
                value: 'shortcuts',
                content: <ShortcutsSettings />
            },
            {
                label: 'Data',
                value: 'data',
                content: (
                    <DataSettings />
                )
            },
            {
                label: 'Add-ons',
                value: 'addons',
                content: (
                    null
                )
            },
            {
                label: 'Certificates',
                value: 'certificates',
                content: (
                    null
                )
            },
            {
                label: 'Proxy',
                value: 'proxy',
                content: (
                    null
                )
            },
            {
                label: 'Update',
                value: 'update',
                content: (
                    null
                )
            },
            {
                label: 'About',
                value: 'about',
                content: (
                    null
                )
            },
        ]

        return (
            <ButtonModal 
            // modalVisible={true}
                buttonProps={{shape: 'circle', icon: <ToolFilled  />}}
                tooltipProps={{title: SETTINGS_TITLE}} 
                modalProps={{title: "SETTINGS", footer: null, width: 800, bodyStyle:{height: 600, overflowY: 'auto' }}} 
                modalContent={(

                        <Tabs defaultActiveKey="data" onChange={this.callback}>
                            {
                                tabs.map(tab => (
                                    <TabPane tab={tab.label} key={tab.value}>
                                        {tab.content}
                                    </TabPane>
                                ))
                            }      
                        </Tabs>
                    
                )}
            />
        )
    }
}

export default SettingsModal;







