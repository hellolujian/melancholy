import React from 'react';
import {Modal, Button, Dropdown, Menu} from 'antd';

import { EllipsisOutlined, InfoCircleFilled ,CaretDownOutlined } from '@ant-design/icons';
import TooltipButton from './tooltip_button'
class ButtonModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: props.defaultVisible ? true : false,
        }
    }

    componentDidMount() {
      
    }

    componentWillReceiveProps (nextProps) {
        const { modalVisible: newVisibleValue } = nextProps;
        const { modalVisible: currentVisibleValue } = this.state;
        // console.log('newVisibleValue: %s, currentVisibleValue: %s', newVisibleValue, currentVisibleValue);
        // if (currentVisibleValue !== newVisibleValue) {
        //     this.setState({modalVisible: newVisibleValue, currentVisibleValue: newVisibleValue})
        // } 
    }

    handleModalVisible = (visible) => {
        this.setState({modalVisible: visible});
        this.props.onVisibleChange(visible)
    }
 
    handletriggerBtnClick = () => {
        this.handleModalVisible(true)
    }

    handleModalCancel = () => {
        this.handleModalVisible(false)
    }

    render() {
    
        let {buttonProps = true, modalProps, modalContent, label = "", tooltipProps, icon, title} = this.props;
        let {modalVisible} = this.state;
        if (this.props.hasOwnProperty('modalVisible')) {
            modalVisible = this.props.modalVisible;
        }
        if (!tooltipProps && title) {
            tooltipProps={title: title};
        }
        
        return (
            <>
            {
                buttonProps && (
                    tooltipProps ? (
                        <TooltipButton 
                            buttonProps={buttonProps}
                            tooltipProps={tooltipProps}
                            label={label} 
                            title={title}
                            icon={icon}
                            onClick={this.handletriggerBtnClick} 
                        />
                    ) : (
                        <Button 
                            icon={icon} 
                            onClick={this.handletriggerBtnClick} 
                            {...buttonProps}>
                            {label}
                        </Button>
                    )
                    
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

ButtonModal.defaultProps = {
    onVisibleChange: () => {},
}







