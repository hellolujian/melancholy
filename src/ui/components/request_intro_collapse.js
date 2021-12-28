import React from 'react';
import { Collapse, Typography, Popover, Button, Row, Col  } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import DescriptionEditor from 'ui/components/description_editor'
import AceMarkdownEditor from 'ui/components/ace_markdown_editor'
import { EDIT_ICON } from '@/ui/constants/icons'
import EditableText from './editable_text'
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
      
        <Row className="panel-head-customize" align="middle" style={{flexFlow: 'row nowrap'}}>
          <Col flex="auto">
            <EditableText 
              value={name}
              editIconClass={sourceRequestExist ? "request-intro-edit-icon" : 'request-intro-edit-icon-none'}
              onSave={this.handleNameSave}
              onChange={this.handleNameChange}
            />
          </Col>
          <Col flex="none">
            <RequestExamples />
          </Col>
        </Row>                      
      )
        return (
            <Collapse
              bordered={false}
              activeKey={activeKey}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              onChange={this.handleActiveKeyChange}
              className="site-collapse-custom-collapse"
            >
              <Panel 
                header={header} 
                className="site-collapse-custom-collapse-panel"
                key="description" 
                showArrow={sourceRequestExist ? true : false} 
                // extra={<RequestExamples />}
                >
                {/* TODO: 重新赋值，切换tab时 */}
                {
                  sourceRequestExist && (
                    <DescriptionEditor 
                      value={description}
                      defaultValue={description}
                      onSave={this.handleDescSave}
                      // onChange={this.handleDescChange}
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







