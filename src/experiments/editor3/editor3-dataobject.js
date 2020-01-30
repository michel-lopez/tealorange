export default (data) => {
    const list = []
    const updateAll = (element) => {
        list.forEach(e => {
            e.update(element)
        })
    }
    const performAction = (element, key, actions, readOnly) => {
        const update = (e) => {
            if (!Object.getOwnPropertyDescriptor(dataObject, key)) {
                console.log("add missing key: " + key)
                addProperty(key)
            }
            const value = dataObject[key]
            if (!readOnly && e != element) element.value = value || ""
            actions.forEach(action => action(value))
        }
        list.push({ element, update })
        update()
        const eventType = element.type && element.type == "radio" ? "change" : "keyup"
        element.addEventListener(eventType, e => {
            dataObject[key] = element.value
            updateAll(element)
        })
    }
    const dataObject = {
        __read: (element, onChange) => {
            const update = onChange ? onChange : () => element.value = JSON.stringify(data)
            list.push({ element, update })
            update()
        },
        __bind: (element, key, ...actions) => {
            performAction(element, key, actions)
        },
        __write: (element, key, ...actions) => {
            performAction(element, key, actions, true)
        }
    }

    const addProperty = (key) => {
        Object.defineProperty(dataObject, key, {
            set: value => {
                data[key] = value
                updateAll()
            },
            get: () => data[key]
        })
    }
    Object.keys(data).forEach(key => {
        addProperty(key)
    })
    return dataObject
}