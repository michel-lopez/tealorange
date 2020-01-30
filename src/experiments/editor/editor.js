import "reset-css"
import "../../app/core/core.styl"

import { createCanvas } from "../../app/core/dom"
import Vector from "../../app/core/vector"
import RectangularControl from "./RectangularControl"

class Rectangle {

    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    render(context) {
        context.beginPath()
        context.fillStyle = this.fillStyle
        context.rect(this.x, this.y, this.width, this.height)
        if (this.fillStyle) context.fill()
        if (this.strokeStyle) context.stroke()
        context.closePath()
    }
}

const width = window.innerWidth
const height = window.innerHeight
const canvas = createCanvas({ width, height})
canvas.style.background = "black"
document.body.appendChild(canvas)

const context = canvas.getContext("2d")
context.strokeStyle = "black"



const shapes = []

const rect1 = new Rectangle(100, 100, 160, 160)
rect1.fillStyle = "red"
const rect2 = new Rectangle(180, 180, 160, 160)
rect2.fillStyle = "green"
const rect3 = new Rectangle(180, 100, 160, 160)
rect3.fillStyle = "blue"

shapes.push(rect1)
shapes.push(rect2)
shapes.push(rect3)

let control //= new RectangularControl(rect1)

const render = context => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()
    shapes.forEach(shape => shape.render(context))
    context.globalCompositeOperation = "xor"
    if (control) control.render(context)
    context.restore()
}

render(context)

const mouseVector = e => {
    const x = e.clientX
    const y = e.clientY
    return new Vector(
        x > 0 ? x < canvas.width ? x : canvas.width : 0, 
        y > 0 ? y < canvas.height ? y : canvas.height: 0)
}

let target
let prevMouseVector = new Vector(0, 0)

const mouseDown = e => {
    const m = mouseVector(e)

    if (control) {
        target = control.hitTest(m)
    }

    if (!target) {
        const shape = [...shapes].reverse().find(rect => 
            rect.x < m.x && rect.x + rect.width > m.x &&
            rect.y < m.y && rect.y + rect.height > m.y)
            control = shape ? new RectangularControl(shape) : undefined
    }

    prevMouseVector = m
    render(context)
}

const mouseUp = e => target = undefined

const mouseMove = e => {
    const m = mouseVector(e)
    if (target) {
        const moveVector = m.sub(prevMouseVector)
        target.update(moveVector)
        render(context)
        prevMouseVector = m
    } else if (control) {
        const hit = control.hitTest(m)
        canvas.style.cursor = hit ? hit.cursor : "default"
    }
}

document.addEventListener("mousemove", mouseMove)
document.addEventListener("mousedown", mouseDown)
document.addEventListener("mouseup", mouseUp)
