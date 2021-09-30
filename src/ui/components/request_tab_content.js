import React from 'react';
import { Select, Button, Space, Input, Dropdown, Menu, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';
import RequestIntroCollapse from 'ui/components/request_intro_collapse'
import RequestSendBar from 'ui/components/request_send_bar'
import RequestSendSetting from 'ui/components/request_send_setting'
import RequestMethodSelect from './request_method_select'
const { Option } = Select;
class RequestTabContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleIntroChange = (value) => {
        this.props.onChange(value);
    }

    render() {

        const {value} = this.props;
        return (
            <>
                <RequestIntroCollapse 
                    value={value}
                    onChange={this.handleIntroChange}
                />
                <RequestSendBar />
                <RequestSendSetting />
            </>
        )
    }
}

export default RequestTabContent;

RequestTabContent.defaultProps = {
    onChange: () => {},
}







