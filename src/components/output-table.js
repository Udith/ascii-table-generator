import React, {Fragment} from "react";
import {Button, Card, H3, Intent, Switch} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import './output-table.css';
import {ALIGNMENT} from "./table-generator";
import {TOAST_UTIL} from "../util/toast-util";

const BORDER_CHAR = '|';
const CORNER_CHAR = '+';
const HEADER_SEP_CHAR = '-';
const ROW_SEP_CHAR = '.';

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
        const columnWidths = this.getColumnWidths(columns, rows);

        const alignments = columns.map(col => col.align);

        let asciiTable = '';
        const headerSep = this.getHeaderSeparator(columnWidths);
        const rowSep = (this.state.addRowSep) ? this.getRowSeparator(columnWidths) : '';

        asciiTable = this.addLineToTable(asciiTable, headerSep, true);
        // Generate header with center aligned
        asciiTable = this.addLineToTable(asciiTable, this.generateRow(columnWidths,
            new Array(columns.length).fill(ALIGNMENT.CENTER), columns.map(col => col.name)));
        asciiTable = this.addLineToTable(asciiTable, headerSep);

        // Generate rows
        rows.forEach((row, index) => {
            asciiTable = this.addLineToTable(asciiTable, this.generateRow(columnWidths, alignments, row));
            if ((this.state.addRowSep) && (index < (rows.length - 1))) {
                asciiTable = this.addLineToTable(asciiTable, rowSep);
            }
        });
        asciiTable = this.addLineToTable(asciiTable, headerSep);

        this.setState({asciiTable, version: this.state.version + 1});
    };

    getColumnWidths = (columns, rows) => {
        const widths = [];

        columns.forEach((column, index) => {
            let maxWidth = column.name ? column.name.length : 0;
            rows.forEach(row => {
                const cellValue = row[index];
                if ((cellValue) && (cellValue.length > maxWidth)) {
                    maxWidth = cellValue.length;
                }
            });
            widths[index] = maxWidth + 2; // extra 2 for padding on sides
        });

        return widths;
    };

    generateRow = (columnWidths, alignments, row) => {
        const cellValues = [];
        row.forEach((cell, index) => {
            const colWidth = columnWidths[index];
            const alignment = alignments[index];

            let cellValue = cell;
            switch (alignment) {
                case ALIGNMENT.LEFT:
                default: {
                    cellValue = cellValue.padStart(cell.length + 1, ' ');
                    cellValue = cellValue.padEnd(colWidth, ' ');
                    break;
                }
                case ALIGNMENT.RIGHT: {
                    cellValue = cellValue.padEnd(cell.length + 1, ' ');
                    cellValue = cellValue.padStart(colWidth, ' ');
                    break;
                }
                case ALIGNMENT.CENTER: {
                    cellValue = cellValue.padStart(cell.length + ((colWidth - cell.length) / 2), ' ');
                    cellValue = cellValue.padEnd(colWidth, ' ');
                    break;
                }
            }
            cellValues[index] = cellValue;
        });
        return (BORDER_CHAR + cellValues.join(BORDER_CHAR) + BORDER_CHAR);
    };

    getHeaderSeparator(columnWidths) {
        let headerSeparator = CORNER_CHAR;
        columnWidths.forEach(colWidth => {
            headerSeparator += HEADER_SEP_CHAR.repeat(colWidth) + CORNER_CHAR;
        });
        return headerSeparator;
    }

    getRowSeparator(columnWidths) {
        let rowSeparator = BORDER_CHAR;
        columnWidths.forEach(colWidth => {
            rowSeparator += ROW_SEP_CHAR.repeat(colWidth) + BORDER_CHAR;
        });
        return rowSeparator;
    }

    addLineToTable(table, line, noNewLinePrefix = false) {
        return (table + (noNewLinePrefix ? '' : '\n') + line);
    }

}
