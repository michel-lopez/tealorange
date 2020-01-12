import Vector from "./core/vector"

const white = "rgba(255, 255, 255, 0.7)"
const red = "rgba(255, 0, 0, 0.7)"

const defaultR = 30

export default class Circle {
    position:Vector
    r:number = defaultR
    speed:Vector = new Vector()
    age:number = 0

    constructor(x:number, y:number) {
        this.position = new Vector(x, y)
    }

    update() {
        this.position = this.position.add(this.speed)
        this.age = this.age + 2
    }

    color(start = 200) {
        const alpha = (start - this.age) / 255
        return `rgba(255, 255, 255, ${alpha})`
    }

    render(context: CanvasRenderingContext2D) {
        const { x, y } = this.position
        context.strokeStyle = this.color()
        context.fillStyle = this.color(100)
        context.beginPath()
        context.arc(x, y, this.r, 0, Math.PI * 2)
        context.fill()
        // context.stroke()
    }

    collide(circle:Circle) {
        const dVector = this.position.sub(circle.position)
        const distance = dVector.magnitude()
        if (this.r + circle.r > distance) {
            this.speed = dVector.normal().multiply(1)
            this.position = this.position.add(this.speed)
        }
    }
}