import {render, screen} from '@testing-library/react';
import App from './App';
import {generateTable} from "./util/generator-util";
import {ALIGNMENT} from "./components/table-generator";

test('Renders main header', () => {
    render(<App/>);
    const mainHeader = screen.getByText(/ASCII Table Generator/i);
    expect(mainHeader).toBeInTheDocument();
});

test('Single column & single row (without row sep)', () => {
    const columns = [getColumn('Column 1')];
    const rows = [['hello']];
    const table = generateTable(columns, rows, false);
    expect(table).toBe(tableToString(`
    +----------+
    | Column 1 |
    +----------+
    | hello    |
    +----------+
    `));
});

test('Single column & single row (with row sep)', () => {
  const columns = [getColumn('Column 1')];
  const rows = [['hello']];
  const table = generateTable(columns, rows, true);
  expect(table).toBe(tableToString(`
    +----------+
    | Column 1 |
    +----------+
    | hello    |
    +----------+
    `));
});

test('Multi column & single row (without row sep)', () => {
  const columns = [getColumn('Column 1'), getColumn('Column 2')];
  const rows = [['hello', 'world']];
  const table = generateTable(columns, rows, false);
  expect(table).toBe(tableToString(`
    +----------+----------+
    | Column 1 | Column 2 |
    +----------+----------+
    | hello    | world    |
    +----------+----------+
    `));
});

test('Multi column & single row (with row sep)', () => {
  const columns = [getColumn('Column 1'), getColumn('Column 2')];
  const rows = [['hello', 'world']];
  const table = generateTable(columns, rows, true);
  expect(table).toBe(tableToString(`
    +----------+----------+
    | Column 1 | Column 2 |
    +----------+----------+
    | hello    | world    |
    +----------+----------+
    `));
});

test('Multi column & multi row (without row sep)', () => {
  const columns = [getColumn('Column 1'), getColumn('Column 2')];
  const rows = [['hello', 'world'], ['Sri', 'Lanka']];
  const table = generateTable(columns, rows, false);
  expect(table).toBe(tableToString(`
    +----------+----------+
    | Column 1 | Column 2 |
    +----------+----------+
    | hello    | world    |
    | Sri      | Lanka    |
    +----------+----------+
    `));
});

test('Multi column & multi row (with row sep)', () => {
  const columns = [getColumn('Column 1'), getColumn('Column 2')];
  const rows = [['hello', 'world'], ['Sri', 'Lanka']];
  const table = generateTable(columns, rows, true);
  expect(table).toBe(tableToString(`
    +----------+----------+
    | Column 1 | Column 2 |
    +----------+----------+
    | hello    | world    |
    |..........|..........|
    | Sri      | Lanka    |
    +----------+----------+
    `));
});

test('Multi column & multi row (Left Aligned)', () => {
  const columns = [getColumn('Column 1', ALIGNMENT.LEFT), getColumn('Column 2')];
  const rows = [['hello', 'world'], ['Sri', 'Lanka']];
  const table = generateTable(columns, rows, true);
  expect(table).toBe(tableToString(`
    +----------+----------+
    | Column 1 | Column 2 |
    +----------+----------+
    | hello    | world    |
    |..........|..........|
    | Sri      | Lanka    |
    +----------+----------+
    `));
});

test('Multi column & multi row (Center Aligned)', () => {
  const columns = [getColumn('Column 1', ALIGNMENT.CENTER), getColumn('Column 2')];
  const rows = [['hello', 'world'], ['Sri', 'Lanka']];
  const table = generateTable(columns, rows, true);
  expect(table).toBe(tableToString(`
    +----------+----------+
    | Column 1 | Column 2 |
    +----------+----------+
    |  hello   | world    |
    |..........|..........|
    |   Sri    | Lanka    |
    +----------+----------+
    `));
});

test('Multi column & multi row (Right Aligned)', () => {
  const columns = [getColumn('Column 1', ALIGNMENT.RIGHT), getColumn('Column 2')];
  const rows = [['hello', 'world'], ['Sri', 'Lanka']];
  const table = generateTable(columns, rows, true);
  expect(table).toBe(tableToString(`
    +----------+----------+
    | Column 1 | Column 2 |
    +----------+----------+
    |    hello | world    |
    |..........|..........|
    |      Sri | Lanka    |
    +----------+----------+
    `));
});

function getColumn(name, align) {
    return {name, align};
}

function tableToString(table) {
    return table.trim().replace(new RegExp(/\n\s+/, 'g'), '\n');
}
