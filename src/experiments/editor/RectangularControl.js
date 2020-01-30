import { maxHeaderSize } from "http"

const size = 10
const hSize = size / 2

const control = (x, y, cursor, update) => ({ x, y, cursor, update })

export default class RectangularControl {
    constructor(shape) {
        this.shape = shape
        const that = this
        const rect1 = {
            set x(val) {
                shape.width -= val - this.x 
                shape.x = val
            },
            get x() {return shape.x},
            set y(val) {
                shape.height -= val - this.y 
                shape.y = val
            },
            get y() {return shape.y},
            get x2 () { return shape.x + shape.width },
            set x2 (val) { shape.width = val - shape.x},
            get y2 () { return shape.y + shape.height },
            set y2 (val) { shape.height = val - shape.y},
            update(m) {
                that.controls.forEach(control => control.update(m))
            },
            cursor : "move"
        }
        const tl = control(rect1.x, rect1.y, "nw-resize", m => {
            //left line
            tl.x = bl.x += m.x
            rect1.x += m.x
        
            //top line
            tl.y = tr.y += m.y
            rect1.y += m.y
        })
        const tr = control(rect1.x2, rect1.y, "ne-resize", m => {
            //right line
            tr.x = br.x += m.x
            rect1.x2 += m.x
            
            //top line
            tl.y = tr.y += m.y      
            rect1.y += m.y
        })
        const br = control(rect1.x2, rect1.y2, "se-resize", m => {
            //right line
            tr.x = br.x += m.x
            rect1.x2 += m.x
            
            //bottom line
            br.y = bl.y += m.y
            rect1.y2 += m.y
        })
        const bl = control(rect1.x, rect1.y2, "sw-resize", m => {
            //left line
            tl.x = bl.x += m.x
            rect1.x += m.x
        
            //bottom line
            br.y = bl.y += m.y
            rect1.y2 += m.y
        })
        this.controls = [tl, tr, br, bl]
        this.rect = rect1
    }

    render(context) {
        context.fillStyle = "gray"
        context.strokeStyle = "black"

        context.save()
        context.setLineDash([5, 5])
        context.strokeRect(this.shape.x, this.shape.y, this.shape.width, this.shape.height)
        context.restore()

        this.controls.forEach(rect => {
            context.beginPath()
            context.rect(rect.x - hSize, rect.y - hSize, size, size)
            context.fill()
            context.stroke()
            context.closePath()
        })
    }

    hitTest(m) {
        const control =  this.controls.find(rect => 
            rect.x - hSize < m.x && rect.x + hSize > m.x &&
            rect.y - hSize < m.y && rect.y + hSize > m.y)
        if (control) {
            return control
        }

        const rect = this.rect
        if (rect.x < m.x && rect.x2 > m.x && rect.y < m.y && rect.y2 > m.y) {
            return rect
        }
    }
}