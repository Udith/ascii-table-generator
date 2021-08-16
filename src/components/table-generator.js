import React from "react";
import {Button, Classes, Intent, InputGroup, Label, Card} from "@blueprintjs/core";
import './table-generator.css';
import InputTable from "./input-table";

const DEFAULT_COL_NUM = 3;
export const ALIGNMENT = {
    LEFT: 'left',
    RIGHT: 'right',
    CENTER:'center'
}
export default class TableGenerator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numCols: DEFAULT_COL_NUM,
            columns: this.generateColumns(DEFAULT_COL_NUM),
            rows: [new Array(DEFAULT_COL_NUM).fill('')]
        }
    }

    onNumColChange = (e) => {
        const value = e.target.value;
        this.setState({
            numCols: (isNaN(value) || (value < 1)) ? this.state.numCols : Number(value)
        });
    }

    onColChangeApply = () => {
        this.setState({
            columns: this.generateColumns(this.state.numCols, this.state.columns)
        });
    }

    generateColumns = (numCols, currentColumns = []) => {
        if (numCols < currentColumns.length) {
            return currentColumns.slice(0, numCols);
        } else if (numCols > currentColumns.length) {
            const newColumns = [...currentColumns];
            for (let i = currentColumns.length; i < numCols; i++) {
                newColumns[i] = {name: `Column ${i + 1}`, align: ALIGNMENT.LEFT};
            }
            return newColumns;
        }
        return currentColumns;
    }

    onChangeRows = (rows) => {
      this.setState({rows});
    };

    onChangeColumn = (columnIndex, name, align) => {
        const columns = [...this.state.columns];
        columns[columnIndex] = {name, align}
        this.setState({columns});
    };

    render() {
        return <div className='table-generator'>
            <Label className={Classes.INLINE}>
                Number of Columns
                <InputGroup
                    type='number'
                    placeholder='Number of table columns'
                    value={this.state.numCols}
                    min={1}
                    rightElement={
                        <Button
                            intent={Intent.SUCCESS}
                            outlined={true}
                            onClick={this.onColChangeApply}>Apply</Button>
                    }
                    onChange={this.onNumColChange}>
                </InputGroup>
            </Label>
            <Card>
                <InputTable
                    numColumns={this.state.numCols}
                    columns={this.state.columns}
                    rows={this.state.rows}
                    onChangeRows={this.onChangeRows}
                    onChangeColumn={this.onChangeColumn}/>
            </Card>
        </div>;
    }
}
