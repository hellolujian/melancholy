import React from 'react';
import {Tooltip, Button, Typography, Popover} from 'antd';

const {Link} = Typography;
class SelectFileButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
      
    }

    handleSelectBtnClick = () => {
        const openFileSelect = window.require('@electron/remote').getGlobal('OPEN_FILES_ELECT_DIALOG');
        let selectedFiles = openFileSelect({multiple: this.props.multiple});
        this.props.onSelect(selectedFiles || [])
    }

    render() {
        const {buttonProps = {}, defaultLabel = 'Select Files', value = []} = this.props;
        let realValue = Array.isArray(value) ? value : [value];
        let buttonLabel = defaultLabel;
        if (realValue.length === 1) {
            let firstFilePath = realValue[0];
            buttonLabel = firstFilePath.substr(firstFilePath.lastIndexOf(window.require('path').sep) + 1)
        } else if (realValue.length > 1) {
            buttonLabel = realValue.length + " files selected";
        }
        return (
            // <Tooltip title={value.length > 0 ? value.join(',\n') : 'No file selected'}>
            //     <Button size="small" {...buttonProps} onClick={this.handleSelectBtnClick}>
            //         {buttonLabel}
            //     </Button>
            // </Tooltip>

            <Popover 
                overlayStyle={{maxWidth: 600}}
                content={realValue.length > 0 ? realValue.join(', \r\n') : 'No file selected'} 
            >
                <Button size="small" {...buttonProps} onClick={this.handleSelectBtnClick}>
                    {buttonLabel}
                </Button>
            </Popover>
            
        )
    }
}

export default SelectFileButton;

SelectFileButton.defaultProps = {
    onSelect: () => {},
}







