class createElement {
    constructor(obj) {
        this.tagName = obj.tagname;
        this.Classes = obj.class ? obj.class : null;
        this.attr = obj.attr ? obj.attr : null;
        this.text = obj.text ? obj.text : null;
        this.element = this.addtagName();
        this.addClass(this.element);
        this.addText(this.element, this.text);
        this.addAttr(this.element);
    }
    addtagName() {
        return document.createElement(this.tagName);
    }
    addClass(Element) {
        if (this.Classes) {
            let arrayClass = this.Classes.split(" ");
            if (Array.isArray(arrayClass)) {
                arrayClass.forEach(el => Element.classList.add(el));
            } else {
                Element.classList.add(arrayClass)
            }
        }
    }
    addText(Element, text) {
        Element.textContent = text;
    }
    addAttr(Element) {
        if (this.attr) {
            let keys = Object.entries(this.attr);
            keys.forEach(el => {
                Element.setAttribute(el[0], el[1]);
            })
        }
    }
    getElement() {
        return this.element;
    }
    append(newElement) {
        this.element.append(newElement);
    }
}

export function createdElement(obj, newElement) {
    let el = new createElement(obj);
    if (newElement) {
        el.append(newElement)
    }
    return el.getElement();
}

// let div = createdElement({
//     tagname: "div",
//     class: "hello text",
//     attr: {
//         id: "test"
//     },
//      text: "выфвфы"
// });

// let input = createdElement({
//     tagname: "input",
//     class: "form-control",
//     attr: {
//         name: 'name',
//         type: 'number',
//         id: 'input',
//         min: '2',
//         max: '10',
//         placeholder: "Введите количество карточек",
//         style: 'width:300px; margin-bottom:20px; margin-right:20px; border-radius:15px; padding:10px 20px; border: 1px solid #fff'
//     }
// })
