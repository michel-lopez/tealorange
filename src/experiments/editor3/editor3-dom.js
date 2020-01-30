export const create = (tag, props) => {
    const element = document.createElement(tag)
    if (props) {
        const { class: className, ...properties } = props
        if (className) element.classList.add(...className.split(" "))
        Object.assign(element, properties)
    }
    return element
}
const createRadio = (group, value, props) => create("input", { type: "radio", value, name: group, ...props })

export const radioGroup = ((count = 0) => (data, key, choices) => {
    const fieldset = create("fieldset")
    const groupName = "group" + count++
    choices.forEach(choice => {
        const id = groupName + choice
        const radio = createRadio(groupName, choice, { id })
        data.__write(radio, key, value => radio.checked = radio.value == value)
        fieldset.appendChild(radio)
        fieldset.appendChild(create("label", { innerHTML: choice, htmlFor: id }))
    })
    return fieldset;
})()

export const createNumberField = (data, key) => {
    return createField(key, data, "number")
}

export const createTextField = (data, key) => {
    return createField(key, data, "text")
}

const createField = (key, data, type) => {
    const div = create("div", { class: "field" })
    div.appendChild(create("label", { innerHTML: key }))
    const element = create("input", { type })
    data.__bind(element, key)
    div.appendChild(element)
    return div
}
