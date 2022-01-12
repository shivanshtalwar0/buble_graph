import './App.css';
import {BubbleChart} from "./components/bubble_chart";
import {useEffect, useLayoutEffect, useRef, useState} from "react";

function App() {
    const [data, setItems] = useState([])

    useEffect(() => {
        const getData= async ()=> {
            return (await fetch('https://mocki.io/v1/18936d28-2f79-4840-b146-5622e8ad1e77')).json()
        }
        getData().then((a) => {
            console.log(a)
            const val = a.map((el) => ({x: el.compratio, y: el.headcount, z: el.salary, title: el.title}));
            setItems(val)
        })
    }, [])

    return (
        <div className="App">
            <BubbleChart
                width="600"
                height="600"
                offset={{left: 20, bottom: 20, right: 20, top: 20}}
                data={data}
            />
        </div>
    );
}

export default App;
