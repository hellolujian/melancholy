import React from 'react';
import { Select, Button, Space, Input, Dropdown, Menu, Row, Col } from 'antd';
import { EyeOutlined, CaretDownOutlined  } from '@ant-design/icons';

const { Option } = Select;
class RequestMethodSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    methodArr = [
        { label: 'GET', value: 'get' },
        { label: 'POST', value: 'post' },
        { label: 'PUT', value: 'put' },
        { label: 'PATCH', value: 'patch' },
        { label: 'DELETE', value: 'delete' },
        { label: 'COPY', value: 'copy' },
        { label: 'HEAD', value: 'head' },
        { label: 'OPTIONS', value: 'options' },
        { label: 'LINK', value: 'link' },
        { label: 'UNLINK', value: 'unlink' },
        { label: 'PURGE', value: 'purge' },
        { label: 'LOCK', value: 'lock' },
        { label: 'UNLOCK', value: 'unlock' },
        { label: 'PROPFIND', value: 'propfind' },
        { label: 'VIEW', value: 'view' },
        { label: 'TRACE', value: 'trace' }
    ]

    handleChange = (value) => {
        this.props.onChange(value)
    }

    render() {
        return (
            <Select  
                style={{width: 120}}
                defaultValue="get"
                {...this.props} 
                options={this.methodArr} 
                onChange={this.handleChange}
            />
        )
    }
}

export default RequestMethodSelect;

RequestMethodSelect.defaultProps = {
    onChange: () => {},
}






