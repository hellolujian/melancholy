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
        let selectedFiles = openFileSelect();
        this.props.onSelect(selectedFiles || [])
    }

    render() {
        const {buttonProps = {}, defaultLabel = 'Select Files', value = []} = this.props;
        let buttonLabel = defaultLabel;
        if (value.length === 1) {
            let firstFilePath = value[0];
            buttonLabel = firstFilePath.substr(firstFilePath.lastIndexOf(window.require('path').sep) + 1)
        } else if (value.length > 1) {
            buttonLabel = value.length + " files selected";
        }
        return (
            // <Tooltip title={value.length > 0 ? value.join(',\n') : 'No file selected'}>
            //     <Button size="small" {...buttonProps} onClick={this.handleSelectBtnClick}>
            //         {buttonLabel}
            //     </Button>
            // </Tooltip>

            <Popover 
                overlayStyle={{maxWidth: 600}}
                content={value.length > 0 ? value.join(', \r\n') : 'No file selected'} 
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







