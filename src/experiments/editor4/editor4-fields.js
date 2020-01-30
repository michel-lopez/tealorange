import { create } from "../editor3/editor3-dom"

export const createField = (label, input) => {
    const field = create("li")
    field.appendChild(create("label", { innerHTML: label }))
    field.appendChild(input)
    return field
}
export const createInput = (type) => create("input", { type })

export const createTextField = (data, key) => {
    const input = createInput("text")
    data.__bind(input, key)
    return createField(key, input)
}

export const createNumberField = (data, key) => {
    const input = createInput( "number")
    data.__bind(input, key)
    return createField(key, input)
}

export const createSelectField = (label, choices) => {
    const field = create("li")
    field.appendChild(create("label", { innerHTML: label }))

    const select = create("select")
    field.appendChild(select)

    choices.forEach(choice => select.appendChild(create("option", { innerHTML: choice })))
    return field
}
export const createButton = (title, icon) => {
    const button = create("button")
    button.appendChild(create("i", { title, class: icon }))
    return button
}
export const createTextAlignButtonsField = (label) => {
    const buttons = create("fieldset")
    buttons.appendChild(createButton("left", "fas fa-align-left"))
    buttons.appendChild(createButton("center", "fas fa-align-center"))
    buttons.appendChild(createButton("right", "fas fa-align-right"))
    buttons.appendChild(create("br"))
    buttons.appendChild(createButton("top", "fas fa-align-left fa-rotate-90"))
    buttons.appendChild(createButton("middle", "fas fa-align-center fa-rotate-90"))
    buttons.appendChild(createButton("bottom", "fas fa-align-right fa-rotate-90"))
    return createField(label, buttons)
}

export const createPositionButtonsField = (label, change) => {
    const classProp = (className) => ({ class: className + " fa-xs space" })
    const buttons = create("fieldset", { style: "line-height: 80%" })
    buttons.appendChild(create("i", classProp("fas fa-square")))
    buttons.appendChild(create("i", classProp("far fa-square")))
    buttons.appendChild(create("i", classProp("far fa-square")))
    buttons.appendChild(create("br"))
    buttons.appendChild(create("i", classProp("far fa-square")))
    buttons.appendChild(create("i", classProp("far fa-square")))
    buttons.appendChild(create("i", classProp("far fa-square")))
    buttons.appendChild(create("br"))
    buttons.appendChild(create("i", classProp("far fa-square")))
    buttons.appendChild(create("i", classProp("far fa-square")))
    buttons.appendChild(create("i", classProp("far fa-square")))
    return createField(label, buttons)
}