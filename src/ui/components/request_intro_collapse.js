import React from 'react';
import { Collapse, Typography, Popover, Button   } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import DescriptionEditor from 'ui/components/description_editor'

import { EDIT_ICON } from '@/ui/constants/icons'
import RequiredInput from './required_input'
import RequestExamples from './request_examples'
import '../style/common.css'
import 'ui/style/request_intro_collapse.css'
const { Panel } = Collapse;
const { Text,Title } = Typography;

class RequestIntro extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    componentDidMount() {
      
    }

    handleNameChange = (e) => {
      this.props.onChange({name: e.target.value})
    }

    handleSave = (value) => {
      this.props.onSave(value)
    }

    handleNameSave = (value) => {
      this.handleSave({name: value})
    }

    handleDescSave = (value) => {
      this.handleSave({description: value})
    }

    handleDescChange = (value) => {
      this.props.onChange({description: value})
    }

    render() {
     
      const {value} = this.props;
      let {name, description} = value;
      let header = (
      
        <RequiredInput 
            value={name}
            size="small"
            editIcon={{className: "request-intro-edit-icon"}}
            onSave={this.handleNameSave}
            onValueChange={this.handleNameChange}
        />
                                        
      )
        return (
            <Collapse
              bordered={false}
              // defaultActiveKey={['1']}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              // className="site-collapse-custom-collapse"
            >
              <Panel 
                header={header} 
                className="site-collapse-custom-collapse-panel"
                key="1" 
                extra={<RequestExamples />}>
               
                <DescriptionEditor 
                  value={description}
                  onSave={this.handleDescSave}
                  onChange={this.handleDescChange}
                />
              </Panel>
            
            </Collapse>
        )
    }
}

export default RequestIntro;

RequestIntro.defaultProps = {
  onChange: () => {},
  onSave: () => {},
}







