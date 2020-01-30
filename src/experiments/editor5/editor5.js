import "reset-css"
import "./editor5.styl"
import { canvasBackground } from "../editor4/editor4-panels"
const create = (tag, props, events) => {
    const element = document.createElement(tag)
    if (props) {
        const { class: className, ...properties } = props
        if (className) element.classList.add(...className.split(" "))
        Object.assign(element, properties)
    }
    if (events) {
        Object.entries(events).forEach(([key, value]) => element.addEventListener(key, value))
    }
    return element
}

const render = (data, parent, listen) => {
    const map = {}
    const proxyObject = {}
    const listeners = []
    if (listen) listeners.push(listen)

    const bind = (key, element, defaultValue) => {
        element.value = data[key]
        if (map[key]) {
            map[key].push(element)
            return
        }
        const list = map[key] = [element]
        Object.defineProperty(proxyObject, key, {
            get: () => {
                return data[key] || defaultValue
            },
            set: value => {
                data[key] = value
                list.forEach(element => element.value = value)
                listeners.forEach(fn => fn(proxyObject))
            }
        })
    }

    const something = {
        createComponent: (key, tag, props = {}) => {
            const { defaultValue, ...properites } = props
            const element = create(tag, properites)
            bind(key, element, defaultValue)
            if (tag === "select") {
                element.addEventListener("change", () => proxyObject[key] = element.value)
            } else {
                element.addEventListener("keyup", () => proxyObject[key] = element.value)
            }
            return element
        },
        addListComponent: (key, fn) => {
            Object.defineProperty(proxyObject, key, {
                get: () => {
                    return data[key]
                },
                set: value => {
                    data[key] = value
                }
            })
            proxyObject[key].forEach((item, index, array) => {
                const tmp = {
                    splice: (...args) => {
                        array.splice(...args)
                        const listen = () => listeners.forEach(fn => fn(proxyObject))
                        render(item, parent, listen).addComponent(fn, index, tmp)
                    }
                }

                const listen = () => listeners.forEach(fn => fn(proxyObject))
                render(item, parent, listen).addComponent(fn, index, tmp)
            })
        }
    }
    const something2 = {
        ...something,
        addComponent: (builder, index, array) => {
            const element = builder(something, index, array)
            if (element) parent.appendChild(element)
            return something2
        },
        onUpdate: fn => {
            listeners.push(fn)
            return something2
        },
        set: (key, value) => {
            proxyObject[key] = value
            return something2
        }
    }

    return something2
}

//https://www.w3schools.com/tags/canvas_font.asp
const fontStyle = ["normal", "italic", "oblique"]
const fontVariant = ["normal", "small-caps"]
const fontWeight = [
    "normal", "bold", "bolder", "lighter", "100", "200",
    "300", "400", "500", "600", "700", "800", "900"]
const textAlign = ["left", "center", "right"]
const textBaseline = ["top", "middle", "bottom"]

const width = 500
const height = 300

const data = {
    text: "Teal Orange Purple",
    fillStyle: "green",
    x: width / 2,
    y: height / 2,
    textAlign: "center",
    textBaseline: "middle",
    font: "bold 55px Roboto"
}
let fillStyle = data.fillStyle

const canvas = create("canvas", { width, height })
// canvasBackground(canvas)
document.body.appendChild(canvas)

const context = canvas.getContext("2d")
const renderCanvas = data => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.save()
    context.fillStyle = fillStyle
    context.font = data.font
    context.textAlign = data.textAlign
    context.textBaseline = data.textBaseline
    context.fillText(data.text, data.x, data.y)
    context.restore()
}

const textType = { type: "text", defaultValue: "" }
const numberType = { type: "number", defaultValue: 0 }

const createField = (key, props = textType) => (parent) => {
    const field = create("li")
    field.appendChild(create("label", { innerHTML: key }))
    field.appendChild(parent.createComponent(key, "input", props))
    return field
}

const createSelect = (key, choices) => (parent) => {
    const field = create("li")
    field.appendChild(create("label", { innerHTML: key }))

    const select = parent.createComponent(key, "select")
    field.appendChild(select)

    choices.forEach(choice => {
        select.appendChild(create("option", { innerHTML: choice }))
    })

    return field
}

const createPanel = (title = "Title") => {
    const panel = create("fieldset", { class: "panel" })

    const legend = create("span", { innerHTML: title, title, class: "legend" })
    panel.appendChild(legend)
    document.body.appendChild(panel)

    const list = create("ul")
    panel.appendChild(list)
    return list
}


const textPanel = render(data, createPanel("Text"))
    .addComponent(createField("text"))
    .addComponent(createField("fillStyle"))
    .addComponent(createField("x", numberType))
    .addComponent(createField("y", numberType))
    .addComponent(createField("text"))
    .addComponent(createField("font"))
    .addComponent(createSelect("textAlign", textAlign))
    .addComponent(createSelect("textBaseline", textBaseline))
    .onUpdate(renderCanvas)

// const fontData = {
//     "font-style": "italic",
//     "font-variant": "small-caps",
//     "font-weight": "bold",
//     "font-size/line-height": "150px",
//     "font-family": "Roboto"
// }

const addRest = (data, values) => {
    const [size, family] = values
    data["font-size/line-height"] = size
    data["font-family"] = family
    return data
}

const addFontWeight = (data, values) => {
    const [first, ...rest] = values
    if (!fontWeight.includes(first)) {
        return addRest(data, values)
    }
    data["font-weight"] = first
    return addRest(data, rest)
}

const addFontVariant = (data, values) => {
    const [first, ...rest] = values
    if (!fontVariant.includes(first)) {
        return addFontWeight(data, values)
    }
    data["font-variant"] = first
    return addFontWeight(data, rest)
}

const addFontStyle = (data, values) => {
    const [first, ...rest] = values
    if (!fontStyle.includes(first)) {
        return addFontVariant(data, values)
    }
    data["font-style"] = first
    return addFontVariant(data, rest)
}

const createFontObject = (values) => {
    const data = {}
    const parts = values.split(" ")
    return addFontStyle(data, parts)
}

const fontData = createFontObject(data.font)

render(fontData, createPanel("Font"))
    .addComponent(createSelect("font-weight", fontWeight))
    .addComponent(createField("font-size/line-height"))
    .addComponent(createField("font-family"))
    .addComponent(createSelect("font-style", fontStyle))
    .addComponent(createSelect("font-variant", fontVariant))
    .onUpdate(data => {
        const font = [
            data["font-style"],
            data["font-variant"],
            data["font-weight"],
            data["font-size/line-height"],
            data["font-family"]]
            .filter(v => !v || v.trim().length != 0)
            .filter(v => v !== "normal")
            .join(" ")
        textPanel.set("font", font)
    })

const fillStyleData = {
    linearGradient: {
        x0: 0,
        y0: 0,
        // x1: "max",
        // y1: "max",
        x1: width,
        y1: 0,
        colorStops: [{
            offset: 0,
            color: "teal"
        }, {
            offset: 0.5,
            color: "orange"
        }, {
            offset: 1,
            color: "purple"
        }]
    }
}


const updateFillStyle = fillStyleData => {
    const { x0, y0, x1, y1, colorStops } = fillStyleData
    //TODO validate colors
    fillStyle = context.createLinearGradient(x0, y0, x1, y1)
    colorStops.forEach(cs => fillStyle.addColorStop(cs.offset, cs.color))
}

render(fillStyleData.linearGradient, createPanel("Linear gradient"))
    .addComponent(createField("x0", numberType))
    .addComponent(createField("y0", numberType))
    .addComponent(createField("x1", numberType))
    .addComponent(createField("y1", numberType))
    .addComponent(parent => {
        parent.addListComponent("colorStops", (item, index, array) => {
            const div = create("li")
            div.appendChild(item.createComponent("offset", "input", numberType))
            div.appendChild(item.createComponent("color", "input", textType))

            const add = create("button", { innerHTML: "Add" })
            add.addEventListener("click", e => {
                array.splice(index, 0, { offset: 1, color: "purple" })
            })
            div.appendChild(add)

            return div
        })
    })
    .onUpdate(fillStyleData => {
        updateFillStyle(fillStyleData)
        renderCanvas(data)
    })

updateFillStyle(fillStyleData.linearGradient)
renderCanvas(data)