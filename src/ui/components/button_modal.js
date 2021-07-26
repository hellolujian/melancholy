import React from 'react';
import {Modal, Button, Dropdown, Menu} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,CaretDownOutlined } from '@ant-design/icons';
import TooltipButton from './tooltip_button'
class ButtonModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.modalVisible
        }
    }

    componentDidMount() {
      
    }

    handletriggerBtnClick = () => {
        this.setState({modalVisible: true});
    }

    handleModalCancel = () => {
        this.setState({modalVisible: false});
    }

    render() {
    
        let {buttonProps = true, modalProps, modalContent, label = ""} = this.props;
        let {modalVisible} = this.state;
        return (
            <>
            {
                buttonProps && (
                    <TooltipButton 
                        label={label} 
                        buttonProps={{...buttonProps}} 
                        onClick={this.handletriggerBtnClick} 
                    />
                )
            }
            <Modal 
                title="CREATE A NEW COLLECTION" 
                // centered
                // bodyStyle={{ height: 600}}
                okText="Create"
                // width={800}
                visible={modalVisible} onOk={this.handleOk} onCancel={this.handleModalCancel}
                {...modalProps}
                >
                
                {modalContent}
                
            </Modal>
            </>
        )
    }
}

export default ButtonModal;







