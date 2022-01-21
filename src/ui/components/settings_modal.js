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
import ThemeSettings from './settings/theme_settings'
import {IMPORT_TITLE, SYNC_DATA_TITLE, CREATE_NEW, ACCOUNT_TITLE, NOTIFICATIONS_TITLE, SETTINGS_TITLE, RUNNER_TITLE} from '@/ui/constants/titles'
import {
    listenShortcut,
} from '@/utils/event_utils'
  
import 'ui/style/theme.css'
const { Dragger } = Upload;
const { TabPane } = Tabs;

class SettingsModal extends React.Component {

    settingsBtnRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    handleTabChange = (activeKey) => {
        this.setState({activeKey: activeKey});
    }

    handleModalOpen = () => {
        this.settingsBtnRef.current.handletriggerBtnClick()
    }

    openShortcutHelp = () => {
        this.handleModalOpen()
        this.handleTabChange("shortcuts")
    }

    componentDidMount() {
        listenShortcut('settings', this.handleModalOpen)
        listenShortcut('openshortcuthelp', this.openShortcutHelp)
    }

    render() {
     
        const {title, color = 'gray', label, type} = this.props

        const {activeKey} = this.state;
      
        const tabs = [
            {
                label: 'General',
                value: 'general',
                content: <GeneralSettings />
            },
            {
                label: 'Themes',
                value: 'themes',
                content: <ThemeSettings />
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
                ref={this.settingsBtnRef}
                buttonProps={{shape: 'circle', icon: <ToolFilled  />}}
                tooltipProps={{title: SETTINGS_TITLE}} 
                modalProps={{title: "SETTINGS", footer: null, width: 800, bodyStyle:{height: 600, overflowY: 'auto' }}} 
                modalContent={(

                        <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
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







