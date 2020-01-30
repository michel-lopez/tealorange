import "reset-css"
import Vector from "../../app/core/vector"

const create = (tag, props, events) => {
    const element = document.createElement(tag)
    if (props) {
        const { class: className, ...properties } = props
        if (className) element.classList.add(...className.split(" "))
        Object.assign(element, properties)
    }
    return element
}




const width = window.innerWidth
const height = window.innerHeight
const canvas = create("canvas", { width, height})
document.body.appendChild(canvas)

const hudCanvas = new OffscreenCanvas(width, height)
const hudContext = hudCanvas.getContext("2d")

const linearGradientData = {
    x0: 0,
    y0: 0,
    x1: width,
    y1: height,
    colorStops: [{
        offset: 0.25,
        color: "white"
    }, {
        offset: 0.5,
        color: "orange"
    }, {
        offset: 0.75,
        color: "black"
    }]
}

const start = {
    x : 0,
    y : 0
}

const end = {
    x : width,
    y : height
}


const context = canvas.getContext("2d")

const createGradient = fillStyleData => {
    const { x0, y0, x1, y1, colorStops } = fillStyleData
    //TODO validate colors
    const fillStyle = context.createLinearGradient(x0, y0, x1, y1)
    colorStops.forEach(cs => fillStyle.addColorStop(cs.offset, cs.color))
    return fillStyle
}

canvas.style.background = "red"

const fillStyle = createGradient(linearGradientData)
const renderCanvas = () => {
    hudContext.clearRect(0, 0, width, height)
    // hudContext.strokeStyle = "gray"
    hudContext.moveTo(start.x, start.y)
    hudContext.lineTo(end.x, end.y)
    hudContext.fillRect(start.x - 5, start.y - 5, 10, 10)
    hudContext.fillRect(end.x - 5, end.y - 5, 10, 10)
    hudContext.stroke()

    context.clearRect(0, 0, width, height)
    context.save()
    context.fillStyle = fillStyle
    context.fillRect(0, 0, width, height)

    context.globalCompositeOperation = "overlay"
    context.drawImage(hudCanvas, 0, 0)

    context.restore()
}

renderCanvas()