export const create = (tagName:string) => (properties:{class?:string}):HTMLElement => {
    const element:HTMLElement = document.createElement(tagName)
    if (!properties) {
        return element;
    }
    const { class : className, ...other} = properties
    if (className) element.classList.add(className)
    Object.assign(element, other)
    return element
}
export const createCanvas = (properties:Object):HTMLCanvasElement => {
    return <HTMLCanvasElement> create("canvas")(properties)
}

export const get = (selector:string):HTMLElement => document.querySelector(selector)
export const getInput = (selector:string) => <HTMLInputElement> get(selector)