import data from "../data/savefiletest"
import { createCanvas } from "../../app/core/dom"
import * as renderActions from "../editor/renderActions"

if (!window.OffscreenCanvas) {
    window.OffscreenCanvas = (width, height) => {
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        return canvas
    }
}

const mainCanvasData = data.mainCanvas
const mainCanvasProps = {}
if (mainCanvasData.size === "window") {
    mainCanvasProps.width = window.innerWidth
    mainCanvasProps.height = window.innerHeight
}
const mainCanvas = createCanvas(mainCanvasProps)
const mainContext = mainCanvas.getContext("2d")
document.body.appendChild(mainCanvas)

const render = (canvas, context, actions) => {
    actions.forEach(action => {
        const actionFn = renderActions[action.action]
        if (actionFn) {
            actionFn(context, canvas, action)
        } else {
            console.log("Fixme", action.action)
        }
    })
}

const createOffscreenCanvas = ({ width, height}, data, list) => {
    let image = undefined
    return () => {
        if (!image) {
            //Fixme resolve dimensions
            image = new OffscreenCanvas(width, height)
            const context = image.getContext("2d")
            const actions = data.render.map(action => updateImageReferences(action, list))
            render(image, context, actions)
        }
        const position = data.position || [0, 0]
        return { image, position }
    }
}

const updateImageReferences = (action, canvasList) => {
    if (action.action && action.action === "drawImage" && action.ref) {
        const { ref, ...rest } = action
        const image = canvasList[ref]
        return { ...rest, image}
    }
    return action
}

const resolveReferences = (canvas, context, data) => {
    const styles = data.styles.reduce((acc, style) => {
        acc[style.name] = renderActions.processStyle(canvas, context, style)
        return acc
    }, {})

    const list = {}
    const canvasList = data.canvas.reduce((acc, data) => {
        acc[data.name] = createOffscreenCanvas(canvas, data, list)
        return acc
    }, list)

    return data.render.map(action => {
        if (action.fillStyle && action.fillStyle.ref) {
            const fillStyle = styles[action.fillStyle.ref]
            return { ...action, fillStyle }
        }
        if (action.strokeStyle && action.strokeStyle.ref) {
            const strokeStyle = styles[action.strokeStyle.ref]
            return { ...action, strokeStyle }
        }
        
        return updateImageReferences(action, canvasList)
    })
}

const actions = resolveReferences(mainCanvas, mainContext, data)
render(mainCanvas, mainContext, actions)