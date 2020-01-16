import "./core/core.styl"
import "./index.styl"
import { createCanvas } from "./core/dom"
import Circle from "./circle"
import Vector from "./core/vector"


const canvas = createCanvas({ width : window.innerWidth, height : 150 })
document.body.appendChild(canvas)
const circlesCanvas:OffscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height)
const textCanvas:OffscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height)
const canvasList = [ canvas, circlesCanvas, textCanvas ]

const mainContext:CanvasRenderingContext2D = canvas.getContext("2d")
const circlesContext:OffscreenCanvasRenderingContext2D = circlesCanvas.getContext("2d")
const textContext:OffscreenCanvasRenderingContext2D = textCanvas.getContext("2d")

const resizeCanvas = (canvas:HTMLCanvasElement|OffscreenCanvas, width:number, height:number) => Object.assign(canvas, { width, height })
const onResize = () => {
    const width = window.innerWidth
    const height = 150
    canvasList.forEach(canvas => resizeCanvas(canvas, width, height))

    textContext.fillStyle = "white"
    addText(textContext, textCanvas)
}

const creatGradient = (context:CanvasRenderingContext2D, {width, height}:HTMLCanvasElement) => {
    const overlay:CanvasGradient = context.createLinearGradient(0, 0, width, height)
    overlay.addColorStop(0.25, "teal")
    overlay.addColorStop(0.75, "orange")
    return overlay
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

const clear = (context:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D, {width, height}:HTMLCanvasElement|OffscreenCanvas) => {
    context.clearRect(0, 0, width, height)
}

let circles:Circle[] = []
onResize()
const update  = () => {
    const left = canvas.width / 2 - 385
    const right = canvas.width / 2 + 385
    const top = canvas.height / 2 - 65
    const bottom = canvas.height / 2 + 65
    circles = circles.filter(circle => 
        circle.age <= 255 && 
        circle.position.x > left && 
        circle.position.x < right &&
        circle.position.y > top &&
        circle.position.y < bottom
        )
    circles.forEach(circle => {
        circle.update()
    })

}
const render  = () => {
    clear(mainContext, canvas)
    
    mainContext.save()

    const gradient = creatGradient(mainContext, canvas)
    mainContext.fillStyle = gradient
    addText(mainContext, canvas)

    renderCircleCanvas()
    
    mainContext.drawImage(circlesCanvas, 0, 0)
    mainContext.strokeStyle = circles.length < 10 ? gradient : "white"
    addText(mainContext, canvas, true)

    mainContext.restore()
}

const renderCircleCanvas = () => {
    clear(circlesContext, circlesCanvas)
    circlesContext.fillStyle = "rgba(255, 255, 255, 0.5)"
    circles.forEach(circle => {
        circle.update()
        circle.render(circlesContext)
    })
    
    circlesContext.save()
    circlesContext.globalCompositeOperation = "xor"
    circlesContext.fillStyle = "white"
    addText(circlesContext, circlesCanvas)
    
    
    circlesContext.globalCompositeOperation = "destination-in"
    circlesContext.drawImage(textCanvas, 0, 0)
    circlesContext.restore()
}

let angle = 0
const addCircles = ({x, y}:Vector) => {
    const length = circles.length;
    let circle = new Circle(x, y)
    circle.r = 50
    circle.speed = new Vector(Math.cos(angle), Math.sin(angle)).multiply(5)
    circles.push(circle)
    circle = new Circle(x, y)
    circle.speed = new Vector(Math.sin(angle), Math.cos(angle)).multiply(10)
    circles.push(circle)
    angle += 0.5
    if (!length) animate()
}

const location = (x:number, y:number) => {
    const rect = canvas.getBoundingClientRect()
    return new Vector(x, y - rect.top)
}

canvas.addEventListener("mousemove", e => addCircles(location(e.clientX, e.clientY)))

canvas.addEventListener("touchmove", (e:TouchEvent) => {
    e.preventDefault()
    const touches:Touch[] = [...e.changedTouches]
    touches.forEach(e => addCircles(location(e.clientX, e.clientY)));
})

addEventListener("resize", () => {
    onResize()
    update()
})

const animate = () => {
    update()
    render()
    if (circles.length) requestAnimationFrame(animate)
}
animate()
