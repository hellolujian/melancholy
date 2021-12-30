import React from 'react';
import { Select, Button, Space, Input, Dropdown, Menu, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import RequestIntroCollapse from 'ui/components/request_intro_collapse'
import RequestSendBar from 'ui/components/request_send_bar'
import RequestSendSetting from 'ui/components/request_send_setting'
import RequestMethodSelect from './request_method_select'

import Sticky from "react-sticky-el";
const { Option } = Select;
class RequestTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleChange = (value) => {
        this.props.onChange(value);
    }

    handleSave = (value) => {
        this.props.onSave(value);
    }

    handleSaveClick = (saveAs) => {
        this.props.onSaveClick(saveAs);
    }

    render() {

        const {value} = this.props;
        return (
            <>
                <RequestIntroCollapse 
                    value={value}
                    onSave={this.handleSave}
                    onChange={this.handleChange}
                />
                <Sticky className="main-right-sticky-class" scrollElement=".request-tab-content">
                    
                    <RequestSendBar 
                        value={value}
                        onChange={this.handleChange}
                        onSave={this.handleSave}
                        onSaveClick={this.handleSaveClick}
                    />
                
                </Sticky>

                <RequestSendSetting 
                    value={value}
                    onSave={this.handleSave}
                    onChange={this.handleChange}
                />
                
            </>
        )
    }
}

export default RequestTabContent;

RequestTabContent.defaultProps = {
    onChange: () => {},
    onSave: () => {},
    onSaveClick: () => {},
}







