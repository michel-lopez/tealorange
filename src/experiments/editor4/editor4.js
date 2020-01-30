import "reset-css"
import "@fortawesome/fontawesome-free/css/all.css"
import "../editor3/editor3-dom"
import { create } from "../editor3/editor3-dom"
import "./editor4.styl"
import { canvasBackground, resizeCanvas, textPanel, fontPanel } from "./editor4-panels"
import dataobject from "../editor3/editor3-dataobject"


const projectDiv = create("div", { id: "project" })
document.body.appendChild(projectDiv)
const editorDiv = create("div", { id: "properties" })
document.body.appendChild(editorDiv)
const panels = create("div", { class : "panels" })
editorDiv.appendChild(panels)

const mainCanvas = create("canvas")
canvasBackground(mainCanvas)
projectDiv.appendChild(mainCanvas)

const resize = resizeCanvas(mainCanvas, projectDiv)
resize()


const data = dataobject({
    text : "Red",
    fillStyle : "red",
    font : "bold 140px Roboto"
})

const fontToString = data => {
    const fontStyle = data["font-sytle"] || ""
    const fontVariant = data["font-variant"] || ""
    const fontWeight = data["font-weight"] || ""
    const fontSize = data["font-size/line-height"] || ""
    const fontFamily = data["font-family"] || ""
    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`
}
const font = dataobject({})
font.__read(null, () => data.font = fontToString(font))
fontPanel(panels, font)
textPanel(panels, data)
textPanel(panels, data)

const mainContext = mainCanvas.getContext("2d")
const render = () => {
    const context = mainContext
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
    context.save()
    context.translate(0, 0)
    context.rotate(0)
    context.fillStyle = data.fillStyle
    context.font = data.font
    context.textAlign = "left"
    context.textBaseline = "top"
    context.fillText(data.text, 0, 0)
    context.restore()
}
render()

data.__read(null, render)

addEventListener("resize", () => {
    resize()
    render()
})