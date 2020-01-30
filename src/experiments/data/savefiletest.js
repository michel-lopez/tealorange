export default {
    mainCanvas : {
        size : "window"
    },
    render : [{
        action : "clear",
        size : "full"
    }, {
        action : "save"
    }, {
        action : "text",
        canvas : "main",
        position : ["center", "middle"],
        textAlign : ["center", "middle"],
        font : "bold 140px Roboto",
        text : "Teal Orange",
        fillStyle : {
            ref : "tealOrangeGradient"
        }
    }, {
        action : "drawImage",
        ref : "circlesCanvas",
        position : [0, 0]
    }, {
        action : "text",
        canvas : "main",
        position : ["center", "middle"],
        textAlign : ["center", "middle"],
        font : "bold 140px Roboto",
        text : "Teal Orange",
        strokeStyle : {
            ref : "tealOrangeGradient"
        }
    }, {
        action : "restore"
    }],
    canvas : [{
        name : "circlesCanvas",
        size : "full",
        render : [{
            action : "clear",
            size : "100%"
        }, {
            action : "fillStyle",
            rgba : [255, 255, 255, 0.5]
        }, {
            action : "arc",
            position : ["center", "middle"],
            r : 50,
            fill : true
        }, {
            action : "save"
        }, {
            action : "globalCompositeOperation",
            name : "xor"
        }, {
            action : "text",
            canvas : "main",
            position : ["center", "middle"],
            textAlign : ["center", "middle"],
            font : "bold 140px Roboto",
            text : "Teal Orange",
            fillStyle : "white"
        }, {
            action : "globalCompositeOperation",
            name : "destination-in"
        }, {
            action : "drawImage",
            ref : "textCanvas",
            position : [0, 0]
        }]
    }, {
        name : "textCanvas",
        size : "full",
        render : [{
            action : "text",
            canvas : "main",
            position : ["center", "middle"],
            textAlign : ["center", "middle"],
            font : "bold 140px Roboto",
            text : "Teal Orange",
            fillStyle : "white"
        }, {
            action : "restore"
        }]
    }],
    styles : [{
        name : "tealOrangeGradient",
        linearGradient : {
            x0 : 0,
            y0 : 0,
            x1 : "max",
            y1 : "max",
            colorStops : [{
                offset : 0.25,
                color : "teal"
            }, {
                offset : 0.75,
                color : "orange"
            }]
        }
    }]
}