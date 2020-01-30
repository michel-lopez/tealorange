import { create } from "../editor3/editor3-dom"
import { createTextField, createPositionButtonsField, createNumberField, createTextAlignButtonsField } from "./editor4-fields"

const bgCanvas = document.createElement("canvas")
bgCanvas.width = 20
bgCanvas.height = 20
const context = bgCanvas.getContext("2d")
context.fillStyle = "gray"
context.fillRect(0, 0, 10, 10)
context.fillRect(10, 10, 10, 10)

export const canvasBackground = canvas => canvas.style.background = `url(${bgCanvas.toDataURL()})`

const screenRatio = window.screen.width / window.screen.height
export const resizeCanvas = (canvas, div) => () => {
    const { clientWidth: width, clientHeight: height } = div
    const projectDivRatio = width / height
    const alignTop = screenRatio < projectDivRatio
    canvas.width = alignTop ? height * screenRatio : width
    canvas.height = alignTop ? height : width / screenRatio
}

export const fontPanel = (parent, data) => {
    const panel = create("div", { class: "panel" })
    parent.appendChild(panel)

    const previewDiv = create("div", { class: "preview" })
    panel.appendChild(previewDiv)

    panel.appendChild(create("span", { class: "title", innerHTML: "font" }))

    const content = create("div", { class: "content" })
    panel.appendChild(content)

    const fields = create("ul", { class: "fields" })
    content.appendChild(fields)

    fields.appendChild(createTextField(data, "font-style"))
    fields.appendChild(createTextField(data, "font-variant"))
    fields.appendChild(createTextField(data, "font-weight"))
    fields.appendChild(createTextField(data, "font-size/line-height"))
    fields.appendChild(createTextField(data, "font-family"))
    

    const alignButtons = create("div")
    alignButtons.appendChild(create())
    fields.appendChild(alignButtons)

    const previewCanvas = create("canvas")
    canvasBackground(previewCanvas)
    const resizePreviewCanvas = resizeCanvas(previewCanvas, previewDiv)
    resizePreviewCanvas()
    previewDiv.appendChild(previewCanvas)
    previewDiv.addEventListener("resize", resizePreviewCanvas)
}

export const textPanel = (parent, data) => {
    const panel = create("div", { class: "panel" })
    parent.appendChild(panel)

    const previewDiv = create("div", { class: "preview" })
    panel.appendChild(previewDiv)

    panel.appendChild(create("span", { class: "title", innerHTML: "text" }))

    const content = create("div", { class: "content" })
    panel.appendChild(content)

    const fields = create("ul", { class: "fields" })
    content.appendChild(fields)

    fields.appendChild(createTextField(data, "text"))
    fields.appendChild(createTextField(data, "fillStyle"))
    fields.appendChild(createTextField(data, "strokeStyle"))
    fields.appendChild(createPositionButtonsField("translate"))
    fields.appendChild(createNumberField(data, "x"))
    fields.appendChild(createNumberField(data, "y"))
    fields.appendChild(createTextAlignButtonsField("text-align"))
    fields.appendChild(createTextField(data, "font"))

    const alignButtons = create("div")
    alignButtons.appendChild(create())
    fields.appendChild(alignButtons)

    const previewCanvas = create("canvas")
    canvasBackground(previewCanvas)
    const resizePreviewCanvas = resizeCanvas(previewCanvas, previewDiv)
    resizePreviewCanvas()
    previewDiv.appendChild(previewCanvas)
    previewDiv.addEventListener("resize", resizePreviewCanvas)
}