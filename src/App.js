import './App.css';
import {H1} from "@blueprintjs/core";
import TableGenerator from "./components/table-generator";

function App() {
    return (
        <div className="App">
            <H1>ASCII Table Generator</H1>
            <TableGenerator/>
        </div>
    );
}

export default App;
