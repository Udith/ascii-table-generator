import React, {Fragment} from "react";
import {Cell, Column, ColumnHeaderCell, EditableCell2, EditableName, Table2} from "@blueprintjs/table";
import {Button, Intent, Classes, UL, Callout, H3} from "@blueprintjs/core";
import {Tooltip2} from "@blueprintjs/popover2";
import {IconNames} from "@blueprintjs/icons";
import './input-table.css';
import {ALIGNMENT} from "./table-generator";
import randomWords from "random-words";

export default class InputTable extends React.Component {

    render() {
        const columns = this.props.columns.map((column, index) => {
            return (
                <Column key={index} cellRenderer={this.renderCell} columnHeaderCellRenderer={this.renderColumnHeader}/>
            );
        });

        const actionColumn = <Column key='actions'
                                     columnHeaderCellRenderer={() => <ColumnHeaderCell name=''/>}
                                     cellRenderer={this.renderActionCell}/>;

        return (
            <Fragment>
                <div className='section-title-bar'>
                    <H3>Input</H3>
                    <div className='section-title-buttons'>
                        <Button outlined={true} minimal={true} icon={IconNames.RANDOM} intent={Intent.WARNING}
                                onClick={this.autoFill}>
                            Auto fill with Random Words
                        </Button>
                    </div>
                </div>
                <Callout className='instructions'>
                    <UL>
                        <li>Click on a Column Header to edit the Column Name</li>
                        <li>Double-Click on a Cell to edit the Cell value</li>
                    </UL>
                </Callout>

                <Table2 numRows={this.props.rows.length} numFrozenColumns={1}>
                    {[actionColumn].concat(columns)}
                </Table2>
            </Fragment>
        );
    }

    renderColumnHeader = (columnIndex) => {
        const columnName = (name) => {
            return (
                <EditableName
                    name={name}
                    onChange={name => this.setColumnName(columnIndex - 1, name)}
                    onCancel={name => this.setColumnName(columnIndex - 1, name)}
                    onConfirm={name => this.setColumnName(columnIndex - 1, name)}
                />
            );
        };
        const {name, align} = this.props.columns[columnIndex - 1];
        return <ColumnHeaderCell
            className='column-header-with-align'
            name={name}
            nameRenderer={columnName}>
            <Tooltip2 content={`Align ${align}`}>
                <Button minimal={true}
                        intent={Intent.PRIMARY}
                        icon={this.getAlignmentIcon(align)}
                        onClick={() => this.changeColumnAlignment(columnIndex - 1)}/>
            </Tooltip2>
        </ColumnHeaderCell>;
    };

    renderCell = (rowIndex, columnIndex) => {
        const {align} = this.props.columns[columnIndex - 1];
        const value = this.props.rows[rowIndex][columnIndex - 1];
        return (
            <EditableCell2
                className={this.getAlignmentClass(align)}
                value={value}
                onChange={value => this.setCellValue(rowIndex, columnIndex - 1, value)}
                onCancel={value => this.setCellValue(rowIndex, columnIndex - 1, value)}
                onConfirm={value => this.setCellValue(rowIndex, columnIndex - 1, value)}
            />
        );
    };

    setCellValue = (rowIndex, columnIndex, value) => {
        const newRows = [...this.props.rows];
        newRows[rowIndex][columnIndex] = value;
        this.props.onChangeRows(newRows);
    }

    setColumnName = (columnIndex, value) => {
        const {align} = this.props.columns[columnIndex];
        this.props.onChangeColumn(columnIndex, value, align);
    }

    changeColumnAlignment = (columnIndex) => {
        const {name, align} = this.props.columns[columnIndex];
        this.props.onChangeColumn(columnIndex, name, this.getNextAlignment(align));
    };

    getNextAlignment = (currentAlignment) => {
        switch (currentAlignment) {
            case ALIGNMENT.LEFT:
                return ALIGNMENT.CENTER;
            case ALIGNMENT.CENTER:
                return ALIGNMENT.RIGHT;
            case ALIGNMENT.RIGHT:
            default:
                return ALIGNMENT.LEFT;
        }
    }

    renderActionCell = (rowIndex) => {
        return (
            <Cell>
                <Button title='Add a new Row'
                        className='row-action-btn'
                        minimal={true}
                        intent={Intent.SUCCESS}
                        small={true}
                        icon={IconNames.ADD}
                        onClick={() => this.addNewRow(rowIndex)}/>
                <Button title='Duplicate Row'
                        className='row-action-btn'
                        minimal={true}
                        intent={Intent.PRIMARY}
                        small={true}
                        icon={IconNames.DUPLICATE}
                        onClick={() => this.duplicateRow(rowIndex)}/>
                <Button title='Move Row Up'
                        className='row-action-btn'
                        disabled={rowIndex === 0}
                        minimal={true}
                        intent={Intent.PRIMARY}
                        small={true}
                        icon={IconNames.ARROW_UP}
                        onClick={() => this.moveRowUp(rowIndex)}/>
                <Button title='Move Row Down'
                        className='row-action-btn'
                        disabled={rowIndex === (this.props.rows.length - 1)}
                        minimal={true}
                        intent={Intent.PRIMARY}
                        small={true}
                        icon={IconNames.ARROW_DOWN}
                        onClick={() => this.moveRowDown(rowIndex)}/>
                <Button title='Remove this Row'
                        className='row-action-btn'
                        minimal={true}
                        intent={Intent.DANGER}
                        small={true}
                        icon={IconNames.TRASH}
                        onClick={() => this.deleteRow(rowIndex)}/>
            </Cell>
        );
    };

    addNewRow(rowIndex) {
        const newRows = [...this.props.rows];
        newRows.splice(rowIndex + 1, 0, new Array(this.props.numColumns).fill(''));
        this.props.onChangeRows(newRows);
    }

    deleteRow(rowIndex) {
        const newRows = [...this.props.rows];
        if (newRows.length > 1) {
            newRows.splice(rowIndex, 1);
            this.props.onChangeRows(newRows);
        }
    }

    duplicateRow(rowIndex) {
        const newRows = [...this.props.rows];
        newRows.splice(rowIndex + 1, 0, [...(this.props.rows[rowIndex])]);
        this.props.onChangeRows(newRows);
    }

    moveRowDown(rowIndex) {
        const newRows = [...this.props.rows];
        const currentRow = newRows[rowIndex];
        newRows[rowIndex] = newRows[rowIndex + 1];
        newRows[rowIndex + 1] = currentRow;
        this.props.onChangeRows(newRows);
    }

    moveRowUp(rowIndex) {
        const newRows = [...this.props.rows];
        const currentRow = newRows[rowIndex];
        newRows[rowIndex] = newRows[rowIndex - 1];
        newRows[rowIndex - 1] = currentRow;
        this.props.onChangeRows(newRows);
    }

    getAlignmentIcon = (alignment) => {
        switch (alignment) {
            case ALIGNMENT.RIGHT:
                return IconNames.ALIGN_RIGHT;
            case ALIGNMENT.CENTER:
                return IconNames.ALIGN_CENTER;
            case ALIGNMENT.LEFT:
            default:
                return IconNames.ALIGN_LEFT;
        }
    }

    getAlignmentClass = (alignment) => {
        switch (alignment) {
            case ALIGNMENT.RIGHT:
                return Classes.ALIGN_RIGHT;
            case ALIGNMENT.CENTER:
                return 'bp3-align-center';
            case ALIGNMENT.LEFT:
            default:
                return Classes.ALIGN_LEFT;
        }
    }

    autoFill = () => {
        // Fill Column names
        this.props.columns.forEach((column, index) => {
            const {name, align} = this.props.columns[index];
            if (!name || name.trim() === '') {
                this.props.onChangeColumn(index, `Column ${index + 1}`, align);
            }
        });

        const numCols = this.props.numColumns;
        // Fill the rows
        const newRows = [];
        for (let i = 0; i < this.props.rows.length; i++) {
            // Generate half as 2 letter words
            const halfCount = numCols / 2;
            let words = randomWords({exactly: halfCount, wordsPerString: 2});
            // Generate rest as one letter words
            words = words.concat(randomWords({exactly: numCols - halfCount, wordsPerString: 1}));
            // Shuffle words
            words = words.sort(() => Math.random() - 0.5);
            newRows.push(words);
        }
        this.props.onChangeRows(newRows);
    };

}
