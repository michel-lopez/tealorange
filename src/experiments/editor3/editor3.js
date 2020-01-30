import "reset-css"
import "./editor3.styl"
import data from "../data/savefiletest2"
import dataObject from "./editor3-dataobject"
import { create, radioGroup, createNumberField, createTextField } from "./editor3-dom"


const bgCanvas = document.createElement("canvas")
bgCanvas.width = 20
bgCanvas.height = 20
const context = bgCanvas.getContext("2d")
context.fillStyle = "gray"
context.fillRect(0, 0, 10, 10)
context.fillRect(10, 10, 10, 10)


const canvasList = data.canvas.reduce((acc, canvas) => {
    acc[canvas.name] = canvas
    return acc
}, {})

const { main, ...offscreenCanvasList } = canvasList
const commands = []
const addCommands = canvas => command => {
    if (command.name == "drawImage") {
        const name = command.ref
        const addOffscreenCommands = addCommands(name)
        offscreenCanvasList[name].commands.forEach(addOffscreenCommands)
    }
    commands.push({ canvas, command })
}
main.commands.forEach(addCommands("main"))

const getBounds = (canvas, data) => {
    let x = 0
    let y = 0
    if (data.size === "full") {
        const width = canvas.width
        const height = canvas.height
        return { x, y, width, height }
    }
}

const editor = {
    clear: {
        description: "Erases the pixels in a rectangular area by setting them to transparent black.",
        update: (canvas, data, context) => {
            const { x, y, width, height } = data
            return {
                text: () => `clearRect(${x},${y},${width},${height})`,
                render: context => context.clearRect(x, y, width, height),
                preview: (context, canvas) => {
                    context.fillStyle = "orange"
                    context.fillRect(0, 0, canvas.width, canvas.height)
                    context.clearRect(x, y, width, height)
                    context.save()
                    context.globalCompositeOperation = "xor"
                    context.strokeStyle = "red"
                    context.strokeRect(x, y, width, height)
                    context.restore()
                }
            }
        },
        createPanel: (parent, data, canvas) => {
            Object.assign(data, getBounds(canvas, { size: "full" }))
            const group = radioGroup(data, "size", ["full", "custom"])
            parent.appendChild(group)

            const dimensions = create("fieldset")
            data.__bind(dimensions, "size", value => dimensions.disabled = value !== "custom")
            parent.appendChild(dimensions)
            dimensions.appendChild(createNumberField(data, "x"))
            dimensions.appendChild(createNumberField(data, "y"))
            dimensions.appendChild(createNumberField(data, "width"))
            dimensions.appendChild(createNumberField(data, "height"))
        }
    },
    text: {
        description: "Erases the pixels in a rectangular area by setting them to transparent black.",
        update: (canvas, data, context) => {
            console.log(data)
            return {
                text: () => { },
                render: context => { },
                preview: (context, canvas) => {

                }
            }
        },
        createPanel: (parent, data, canvas) => {
            parent.appendChild(createTextField(data, "font"))
            parent.appendChild(createTextField(data, "text"))
        }
    }
}

const width = 700
const height = 450
const canvas = create("canvas", { width, height, class: "main" })
document.body.appendChild(canvas)
const mainContext = canvas.getContext("2d")

const renderMain = () => {
    commands.forEach(canvasCommand => {
        const data = canvasCommand.command
        const name = data.name
        const commandEditor = editor[name]
        if (!commandEditor) {
            return
        }
        
    })
}

commands.forEach(canvasCommand => {
    const data = canvasCommand.command
    const name = data.name
    const commandEditor = editor[name]
    if (!commandEditor) {
        console.log("TODO: " + name)
        return
    }
    const div = create("div", { class: "command" })
    const fieldset = create("fieldset")
    document.body.appendChild(div)

    
    const canvas = { width: 240, height: 100, class: "preview" }
    const previewCanvas = create("canvas", canvas)
    previewCanvas.style.background = `url(${bgCanvas.toDataURL()})`
    div.appendChild(previewCanvas)
    
    div.appendChild(create("span", { innerHTML: name }))

    const data2 = dataObject(data)
    commandEditor.createPanel(div, data2, canvas)
    const previewContext = previewCanvas.getContext("2d")
    data2.__read(previewContext, () => {
        const test = commandEditor.update(previewCanvas, data2, previewContext)
        test.preview(previewContext, canvas)
        test.render(mainContext)
        renderMain()
    })
})