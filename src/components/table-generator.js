import React from "react";
import {Classes, Label} from "@blueprintjs/core";
import './table-generator.css';

const DEFAULT_COL_NUM = 3;
export default class TableGenerator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numCols: DEFAULT_COL_NUM,
            columnNames: this.generateColumnNames(DEFAULT_COL_NUM)
        }
    }

    onNumColChange = (e) => {
        const value = e.target.value;
        this.setState({
            numCols: (isNaN(value) || (value < 1)) ? this.state.numCols : Number(value)
        });
    }

    generateColumnNames = (numCols, currentNames = []) => {
        if (numCols < currentNames) {
            return currentNames.slice(0, numCols);
        } else if (numCols > currentNames) {
            const newColumnNames = [...currentNames];
            for (let i = currentNames.length; i < numCols; i++) {
                newColumnNames[i] = `Column ${i + 1}`;
            }
        }
        return currentNames;
    }

    render() {
        return <div className='table-generator'>
            <Label inline={true} className={Classes.INLINE}>
                Number of Columns
                <input className={Classes.INPUT} type='number'
                       placeholder='Number of table columns'
                       value={this.state.numCols}
                       min={1}
                       onChange={this.onNumColChange}/>
            </Label>
        </div>;
    }
}
