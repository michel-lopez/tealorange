export const create = (tagName:string):HTMLElement => document.createElement(tagName)
export const createCanvas = (properties:Object):HTMLCanvasElement => {
    const canvas:HTMLCanvasElement = <HTMLCanvasElement> create("canvas")
    Object.assign(canvas, properties)
    return canvas
}

export const get = (selector:string):HTMLElement => document.querySelector(selector)
export const getInput = (selector:string) => <HTMLInputElement> get(selector)