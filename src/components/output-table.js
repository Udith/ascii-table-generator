import React, {Fragment} from "react";
import {Button, Card, H3, Intent, Switch} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import './output-table.css';
import {TOAST_UTIL} from "../util/toast-util";
import {generateTable} from "../util/generator-util";

/**
 * @author Udith Gunaratna
 */
export default class OutputTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            asciiTable: '',
            addRowSep: true,
            version: 1
        };
    }

    componentDidMount() {
        this.generateTable();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.version === this.state.version) {
            // Prop update
            this.generateTable();
        }
    }

    render() {
        return <Fragment>
            <div className='section-title-bar'>
                <H3>Output</H3>
                <div className='section-title-buttons'>
                    <Switch
                        inline={true}
                        labelElement={<strong>Add Row Separators</strong>}
                        checked={this.state.addRowSep}
                        onChange={this.toggleRowSeparators}
                    />
                    <Button outlined={true} minimal={true} icon={IconNames.REFRESH} intent={Intent.SUCCESS}
                            onClick={this.regenerateTable}>
                        Regenerate Table
                    </Button>
                    <Button outlined={true} minimal={true} icon={IconNames.CLIPBOARD} intent={Intent.PRIMARY}
                            onClick={this.copyToClipboard}>
                        Copy to clipboard
                    </Button>
                </div>
            </div>
            <Card id='output-table-container'>{this.state.asciiTable}</Card>
        </Fragment>
    }

    toggleRowSeparators = (e) => {
        this.setState({addRowSep: e.target.checked});
    };

    regenerateTable = () => {
        this.generateTable();
        TOAST_UTIL.showSuccessToast('Table Re-Generated');
    };

    copyToClipboard = () => {
        let selection = window.getSelection();
        let range = document.createRange();
        range.selectNode(document.getElementById('output-table-container'));
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        TOAST_UTIL.showSuccessToast('Copied table to clipboard');
    };

    generateTable = () => {
        const {columns, rows} = this.props;
        const asciiTable = generateTable(columns, rows, this.state.addRowSep);
        this.setState({asciiTable, version: this.state.version + 1});
    };
}
