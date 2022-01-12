import {useEffect, useLayoutEffect, useState} from 'react'
import {useRef} from "react";
import {niceScale} from "./utility";

function GetRandomColor() {
    let color,
        letters = '0123456789ABCDEF'.split('')

    function AddDigitToColor(limit) {
        color += letters[Math.round(Math.random() * limit)]
    }

    color = '#'
    AddDigitToColor(5)
    for (var i = 0; i < 5; i++) {
        AddDigitToColor(15)
    }
    return color
}


export function BubbleChart(props = {offset: {left: 20, right: 20, bottom: 20, top: 20}}) {

    const [canvas, setCanvas] = useState(null)
    const [context, setContext] = useState(null)
    const [xScaled, setXScaled] = useState({min: 0, max: 0, tick: 0})
    const [yScaled, setYScaled] = useState({min: 0, max: 0, tick: 0})
    const ref = useRef(null)
    useEffect(() => {
        setCanvas(ref.current)
        setContext(ref.current.getContext('2d'))
        console.log('inner')
        let xMax, xMin, yMax, yMin, zMax, zMin, xScaled, yScaled;
        const xValues = props.data.map((e) => e.x);
        const yValues = props.data.map((e) => e.y);
        const zValues = props.data.map((e) => e.z);
        xMax = Math.max.apply(Math, xValues)
        xMin = Math.min.apply(Math, xValues)
        yMax = Math.max.apply(Math, yValues)
        yMin = Math.min.apply(Math, yValues)
        zMax = Math.max.apply(Math, zValues)
        zMin = Math.min.apply(Math, zValues)
        const xscaled = niceScale(Math.min(xMin, 0), Math.max(props.width, xMax), 20)
        const yscaled = niceScale(Math.min(yMin, 0), Math.max(props.height, yMax), 20)
        console.log(xscaled)
        console.log(yscaled)
        setXScaled(xscaled)
        setYScaled(yscaled);
        console.log(xValues)
        console.log(xScaled)
        console.log(yValues)
        console.log(yScaled)
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height)
            createAxes()
            createAxes(false)
            props.data.forEach((el) => {
                // const el = props.data[key];
                const zScaled = ((el.z - zMin) / (zMax - zMin)) * (40 - 20) + 20
                plotPoint(el.x, el.y, el.title || '', zScaled)
            })
        }


    }, [props.data])

    function plotPoint(x, y, title, value) {
        context.globalAlpha = 0.5
        context.fillStyle = GetRandomColor();
        context.beginPath();
        context.arc(x + props.offset.left, y + props.offset.top, value, 0, 2 * Math.PI);
        context.fill();
        context.globalAlpha = 1
        context.fillStyle = "white";
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '9px sans-serif ';
        context.fillText(title, x + props.offset.left, y + props.offset.top);

    }

    function createAxes(xAxes = true) {
        const width = canvas.width
        const height = canvas.height;

        if (xAxes) {
            context.moveTo(props.offset.left, (height) / 2)
            context.lineTo(width - props.offset.right, (height) / 2)
            context.stroke()
            console.log(width)
            for (let i = 0; i < width-props.offset.left-props.offset.right; i = i + xScaled.tick) {
                if (i !== width / 2) {
                    console.log('creating numbers and wedges')
                    context.moveTo(i + props.offset.left, (height) / 2)
                    context.lineTo(i + props.offset.left, (height) / 2 + 10)
                    context.stroke()
                    context.fillStyle = "black";
                    const wedgeWidth = (height) / 2 + 10
                    const textPosition = wedgeWidth + 10;
                    context.font = '10px sans-serif';
                    context.fillText(i, i + props.offset.left, textPosition);
                }

            }
        } else {
            context.moveTo(((width) / 2) + props.offset.left, props.offset.top)
            context.lineTo(((width) / 2) + props.offset.left, height - props.offset.bottom)
            context.stroke()
            for (let i = 0; i < height-props.offset.bottom-props.offset.top; i = i + yScaled.tick) {

                if (i !== height-props.offset.bottom-props.offset.top / 2) {
                    const wedgeWidth = (width / 2) + 10 + props.offset.left
                    const textPosition = wedgeWidth + 10;
                    context.moveTo((width / 2) + props.offset.left, i + props.offset.top)
                    context.lineTo(wedgeWidth, i + props.offset.top)
                    context.stroke()
                    context.fillStyle = "black";
                    context.font = '10px sans-serif';
                    context.fillText(i, textPosition, i + props.offset.top);
                }

            }
        }

    }


    return (
        <canvas style={{border: '1px solid grey'}} width={props.width ?? 400} height={props.height ?? 400} ref={ref}>
        </canvas>
    )
}