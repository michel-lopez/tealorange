export const clear = (context, canvas, data) => {
    const size = data.size
    if (size === "full") {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }
}

export const save = (context) => {
    context.save()
}

export const restore = (context) => {
    context.restore()
}

const getX = (canvas, value) => {
    if (value === "center") {
        return canvas.width / 2
    }
    if (value === "max") {
        return canvas.width
    }
    return value
}

const getY = (canvas, value) => {
    if (value === "middle") {
        return canvas.height / 2
    }
    if (value === "max") {
        return canvas.height
    }
    return value
}

const getPosition = (canvas, position) => {
    if (Array.isArray(position)) {
        return {
            x : getX(canvas, position[0]),
            y : getY(canvas, position[1])
        }
    }
}

export const text = (context, canvas, data) => {
    if ( context.font) context.font = data.font
    if (data.textAlign) {
        context.textAlign = data.textAlign[0]
        context.textBaseline = data.textAlign[1]
    }
    context.text = data.text
    const positionProps = getPosition(canvas, data.position)
    if (data.fillStyle) {
        context.fillStyle = data.fillStyle
        context.fillText(data.text, positionProps.x, positionProps.y)
    }
    if (data.strokeStyle) {
        context.strokeStyle = data.strokeStyle
        context.strokeText(data.text, positionProps.x, positionProps.y)
    }
}


export const processStyle = (canvas, context, style) => {
    if (style.value) {
        return style.value
    }
    if (style.linearGradient) {
        const linearGradient = style.linearGradient
        const x0 = getX(canvas, linearGradient.x0)
        const y0 = getY(canvas, linearGradient.y0)
        const x1 = getX(canvas, linearGradient.x1)
        const y1 = getY(canvas, linearGradient.y1)
        const gradient = context.createLinearGradient(x0, y0, x1, y1)
        linearGradient.colorStops.forEach(stop => {
            gradient.addColorStop(stop.offset, stop.color)
        });
        return gradient
    }
    return "blue"
}

export const drawImage = (context, canvas, data) => {
    const imageData = data.image()
    const position = getPosition(canvas, imageData.position)
    context.drawImage(imageData.image, position.x, position.y)
}

export const fillStyle = (context, canvas, data) => {
    if (data.rgba) {
        const { r, g, b, a} = data.rgba
       context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    }
}

export const globalCompositeOperation = (context, canvas, data) => {
    context.globalCompositeOperation = data.name
}

export const arc = (context, canvas, data) => {
    const position = getPosition(canvas, data.position)
    context.beginPath()
    context.arc(position.x, position.y, data.r, 0, Math.PI * 2)
    if (data.fill) {
        context.fill()
    } else {
        context.closePath()
    }
}