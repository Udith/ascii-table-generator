import {ALIGNMENT} from "../components/table-generator";

const BORDER_CHAR = '|';
const CORNER_CHAR = '+';
const HEADER_SEP_CHAR = '-';
const ROW_SEP_CHAR = '.';

/**
 * @author Udith Gunaratna
 */
export function generateTable(columns, rows, addRowSep) {
    const columnWidths = getColumnWidths(columns, rows);

    const alignments = columns.map(col => col.align);

    let asciiTable = '';
    const headerSep = getHeaderSeparator(columnWidths);
    const rowSep = (addRowSep) ? getRowSeparator(columnWidths) : '';

    asciiTable = addLineToTable(asciiTable, headerSep, true);
    // Generate header with center aligned
    asciiTable = addLineToTable(asciiTable, generateRow(columnWidths,
        new Array(columns.length).fill(ALIGNMENT.CENTER), columns.map(col => col.name)));
    asciiTable = addLineToTable(asciiTable, headerSep);

    // Generate rows
    rows.forEach((row, index) => {
        asciiTable = addLineToTable(asciiTable, generateRow(columnWidths, alignments, row));
        if ((addRowSep) && (index < (rows.length - 1))) {
            asciiTable = addLineToTable(asciiTable, rowSep);
        }
    });
    asciiTable = addLineToTable(asciiTable, headerSep);
    return asciiTable;
}

function getColumnWidths(columns, rows) {
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
}

function generateRow(columnWidths, alignments, row) {
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
}

function getHeaderSeparator(columnWidths) {
    let headerSeparator = CORNER_CHAR;
    columnWidths.forEach(colWidth => {
        headerSeparator += HEADER_SEP_CHAR.repeat(colWidth) + CORNER_CHAR;
    });
    return headerSeparator;
}

function getRowSeparator(columnWidths) {
    let rowSeparator = BORDER_CHAR;
    columnWidths.forEach(colWidth => {
        rowSeparator += ROW_SEP_CHAR.repeat(colWidth) + BORDER_CHAR;
    });
    return rowSeparator;
}

function addLineToTable(table, line, noNewLinePrefix = false) {
    return (table + (noNewLinePrefix ? '' : '\n') + line);
}
