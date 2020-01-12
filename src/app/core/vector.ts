export default class Vector {
    x:number
    y:number

    constructor(x:number = 0, y:number = 0)  {
        this.x = x
        this.y = y
    }
 
    add(vector: Vector) {
        return new Vector(this.x + vector.x, this.y + vector.y)
    }
 
    sub(vector: Vector) {
        return new Vector(this.x - vector.x, this.y - vector.y)
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    multiply(value:number) {
        return new Vector(this.x * value, this.y * value)
    }

    normal() {
        const m = this.magnitude()
        return new Vector(this.x / m, this.y / m)
    }
}