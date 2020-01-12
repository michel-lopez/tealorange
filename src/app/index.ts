import "./core/core.styl"
import "./index.styl"

import { createCanvas } from "./core/dom"
console.log("Loading")

//const width = 600
//const height = 600
const canvas = createCanvas({width : window.innerWidth, height : window.innerHeight})
document.body.appendChild(canvas)

const mainContext:CanvasRenderingContext2D = canvas.getContext("2d")

const createBackgroundGradient = (context:CanvasRenderingContext2D, {width, height}:HTMLCanvasElement):CanvasGradient => {
    const centerX = width / 2
    const centerY = height / 2
    const r1 = Math.max(centerX, centerY)

    const background:CanvasGradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, r1)
    background.addColorStop(0, "#666")
    background.addColorStop(1, "#000")
    return background
}

const creatGradient2 = (context:CanvasRenderingContext2D, {width, height}:HTMLCanvasElement) => {
    const overlay:CanvasGradient = context.createLinearGradient(0, 0, width, height)
    overlay.addColorStop(0.25, "teal")
    overlay.addColorStop(0.75, "orange")
    return overlay
}


const background = (context:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D, {width, height}:HTMLCanvasElement|OffscreenCanvas) => {
    //context.fillStyle = backgroundGradient
    context.fillRect(0, 0, width, height)
}

const addCircle = (context:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D, x:number, y:number) => {
    context.beginPath()
    context.arc(x, y, 50, 0, Math.PI * 2)
    context.fill()
}

const addText = (context:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D, {width, height}:HTMLCanvasElement|OffscreenCanvas, stroke = false) => {
    const centerX = width / 2
    const centerY = height / 2
    context.font = "bold 140px Roboto"
    context.textAlign = "center"
    context.textBaseline = "middle"
    if (stroke) {
        context.strokeText("Teal Orange", centerX, centerY)
    } else{
        context.fillText("Teal Orange", centerX, centerY)
    }
}

const clear = (context:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D, {width, height}:HTMLCanvasElement|OffscreenCanvas, stroke = false) => {
    context.clearRect(0, 0, width, height)
}

const circlesCanvas:OffscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height)
const circlesContext:OffscreenCanvasRenderingContext2D = circlesCanvas.getContext("2d")

const textCanvas:OffscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height)
const textContext:OffscreenCanvasRenderingContext2D = textCanvas.getContext("2d")
textContext.fillStyle = "white"
addText(textContext, textCanvas)

const circles = []

const update  = (x:number, y:number) => {
    clear(mainContext, canvas)
    clear(circlesContext, circlesCanvas)
    
    circlesContext.fillStyle = "rgba(255, 255, 255, 0.5)"
    addCircle(circlesContext, x, y)
    circles.forEach(circle => addCircle(circlesContext, circle.x, circle.y))
    
    circlesContext.save()
    circlesContext.globalCompositeOperation = "xor"
    circlesContext.fillStyle = "white"
    addText(circlesContext, circlesCanvas)
    
    
    circlesContext.globalCompositeOperation = "destination-in"
    circlesContext.drawImage(textCanvas, 0, 0)
    circlesContext.restore()
    
    mainContext.fillStyle = creatGradient2(mainContext, canvas)
    background(mainContext, canvas)
    mainContext.drawImage(circlesCanvas, 0, 0)
    mainContext.strokeStyle = "white"
    addText(mainContext, canvas, true)
}
    
    
update(200, 200)

canvas.addEventListener("mousemove", e => update(e.clientX, e.clientY))
canvas.addEventListener("mousedown", e => circles.push({x : e.clientX, y: e.clientY}))