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

    handleActiveKeyChange = (key) => {
      const {value} = this.props;
      if (value.deleted || !value.id) {
        return;
      }
      this.setState({activeKey: key})
    }

    render() {
     
      const {activeKey} = this.state;
      const {value} = this.props;
      let {name, description, deleted, id} = value;
      let sourceRequestExist = !deleted && id;
      let header = (
      
        <div className="justify-content-space-between-inline border" style={{width: '95%'}}>
        <RequiredInput 
            value={name}
            size="small"
            editIcon={sourceRequestExist ? {className: "request-intro-edit-icon"} : false}
            onSave={this.handleNameSave}
            onValueChange={this.handleNameChange}
        />
        <RequestExamples />
        </div>

                                        
      )
        return (
            <Collapse
              bordered={false}
              activeKey={activeKey}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              onChange={this.handleActiveKeyChange}
              // className="site-collapse-custom-collapse"
            >
              <Panel 
                header={header} 
                className="site-collapse-custom-collapse-panel"
                key="description" 
                showArrow={sourceRequestExist ? true : false} 
                // extra={<RequestExamples />}
                >
               
                {
                  sourceRequestExist && (
                    <DescriptionEditor 
                      value={description}
                      onSave={this.handleDescSave}
                      onChange={this.handleDescChange}
                    />
                  )
                }
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







