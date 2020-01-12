import "reset-css"
import "./core/core.styl"
import "./index.styl"

import Vector from "./core/vector"
import Circle from "./circle"
import { getInput, createCanvas } from "./core/dom"




const pInput:HTMLInputElement = getInput("#primary-color")
const sInput:HTMLInputElement = getInput("#secondary-color")
const cInput:HTMLInputElement = getInput("#circles")

const canvas = createCanvas()
const context = canvas.getContext("2d")

let circles:Circle[] = []
let background:CanvasGradient
let overlay:CanvasGradient
let mouseVector:Vector
let speedVector:Vector

const onResize = (canvas: HTMLCanvasElement) => {
    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width
    canvas.height = height

    mouseVector = new Vector(width / 2, height/ 2)

    updateBackground(canvas)
    updateOverlay(canvas)
}

const updateBackground = ({ width, height }) => {
    const centerX = width / 2
    const centerY = height / 2
    const r1 = Math.max(centerX, centerY)

    background = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, r1)
    background.addColorStop(0, "#666")
    background.addColorStop(1, "#000")
}

const updateOverlay = ({ width, height }) => {
    overlay = context.createLinearGradient(0, 0, width, height)
    overlay.addColorStop(0.25, pInput.value)
    overlay.addColorStop(0.75, sInput.value)
}

const render = (context:CanvasRenderingContext2D, { width, height }) => {
    //context.fillStyle = background
    //context.fillRect(0, 0, width, height)
    context.clearRect(0, 0, width, height)

    
    circles.forEach(circle => circle.render(context))

    
    context.save()
    context.globalCompositeOperation = "xor";
    context.font = "bold 100px Roboto"
    context.lineWidth = 2
    context.strokeStyle = "white"
    context.fillStyle = "white"

    context.textAlign = "left"
    context.textBaseline = "top"
    let text = "Teal"
    context.fillText(text, 30, 30)
    context.strokeText(text, 30, 30)

    context.textAlign = "right"
    context.textBaseline = "bottom"
    text = "Orange"
    context.fillText(text, width - 30, height - 30)
    context.strokeText(text, width - 30, height - 30)
    context.restore()

    context.save()
    context.globalCompositeOperation = "overlay"
    context.fillStyle = overlay
    context.fillRect(0, 0, width, height)
    context.restore()
}

onResize(canvas)
render(context, canvas)
document.body.appendChild(canvas)

const update = ({ width, height}) => {

    circles.forEach(circle =>  circle.update())

    const count = circles.length
    for (let i = 0; i < count; i++) {
        const circle = circles[i]
        for (let j = 0; j < count; j++) {
            if (i == j) {
                continue
            }
            const circle2 = circles[j]
            circle.collide(circle2)
        }
    }

    
    circles = circles
    .filter(circle => circle.age <= 255 &&
        circle.position.x + circle.r > 0 && circle.position.y + circle.r > 0 &&
        circle.position.x - circle.r < width && circle.position.y - circle.r < height)
    cInput.value = "" + circles.length
}

const animate = () => {
    update(canvas)
    render(context, canvas)
    requestAnimationFrame(animate)
}

animate()


const updateColors = () => updateOverlay(canvas)

pInput.addEventListener("change", updateColors)
sInput.addEventListener("change", updateColors)

addEventListener("resize", () => onResize(canvas))

speedVector = new Vector(0, 2)
const createCircle = (x:number, y:number) => {
    const prevMouseVector = mouseVector
    mouseVector = new Vector(x, y)
    //speedVector = mouseVector.sub(prevMouseVector)
    addCircle(mouseVector.x, mouseVector.y)
    addCircle(mouseVector.x, mouseVector.y,)
    addCircle(mouseVector.x, mouseVector.y)
}
canvas.addEventListener("mousemove", (e:MouseEvent) => createCircle(e.clientX, e.clientY))
canvas.addEventListener("touchmove", (e:TouchEvent) => {
    e.preventDefault()
    const touches:Touch[] = [...e.changedTouches]
    touches.forEach(e => createCircle(e.clientX, e.clientY));
})

const addCircle = (x:number, y:number) => {
    const circle = new Circle(x, y)
    circle.r = 10 + Math.random() * 30
    circles.push(circle)
}
