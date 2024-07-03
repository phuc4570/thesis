import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from "./component/Header"
import Paint from "./component/Paint";
import Gallery from "./component/Gallery";
import React, {useState} from "react";

function App() {
    //variable to get size of Paint
    const [paintDimension, setPaintDimension] = useState({
        width: 0,
        height: 0,
    });

    //variable to store the Paint Editor
    const [paintEditor, setPaintEditor] = useState()

    return(
        <div style={{height: '100%'}}>
            <Header></Header>
            <div className="background-image"></div>
            <div className="content">
                <Paint setEditor={setPaintEditor} setDimension={setPaintDimension}></Paint>
                <Gallery editor={paintEditor} dimension={paintDimension}></Gallery>
            </div>
        </div>
    )
}

export default App;
