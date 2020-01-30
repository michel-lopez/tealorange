export default {
    canvas: [{
        name: "main",
        size: "window",
        commands: [{
            name: "clear",
            size: "full"
        }, {
            name: "save"
        }, {
            name: "text",
            canvas: "main",
            position: ["center", "middle"],
            textAlign: ["center", "middle"],
            font: "bold 140px Roboto",
            text: "Teal Orange",
            fillStyle: {
                ref: "tealOrangeGradient"
            }
        }, {
            name: "drawImage",
            ref: "circlesCanvas",
            position: [0, 0]
        }, {
            name: "text",
            canvas: "main",
            position: ["center", "middle"],
            textAlign: ["center", "middle"],
            font: "bold 140px Roboto",
            text: "Teal Orange",
            strokeStyle: {
                ref: "tealOrangeGradient"
            }
        }, {
            name: "restore"
        }],
    }, {
        name: "circlesCanvas",
        size: "full",
        commands: [{
            name: "clear",
            size: "full"
        }, {
            name: "fillStyle",
            rgba: [255, 255, 255, 0.5]
        }, {
            name: "arc",
            position: ["center", "middle"],
            r: 50,
            fill: true
        }, {
            name: "save"
        }, {
            name: "globalCompositeOperation",
            name: "xor"
        }, {
            name: "text",
            canvas: "main",
            position: ["center", "middle"],
            textAlign: ["center", "middle"],
            font: "bold 140px Roboto",
            text: "Teal Orange",
            fillStyle: "white"
        }, {
            name: "globalCompositeOperation",
            operation: "destination-in"
        }, {
            name: "drawImage",
            ref: "textCanvas",
            position: [0, 0]
        }
        ]
    }, {
        name: "save"
    }, {
        name: "textCanvas",
        size: "full",
        commands: [{
            name: "text",
            position: ["center", "middle"],
            textAlign: ["center", "middle"],
            font: "bold 140px Roboto",
            text: "Teal Orange",
            fillStyle: "white"
        }, {
            name: "restore"
        }]
    }],
    styles: [{
        name: "tealOrangeGradient",
        linearGradient: {
            x0: 0,
            y0: 0,
            x1: "max",
            y1: "max",
            colorStops: [{
                offset: 0.25,
                color: "teal"
            }, {
                offset: 0.75,
                color: "orange"
            }]
        }
    }]
}