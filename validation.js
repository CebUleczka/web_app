// document.querySelector("#submit").addEventListener("click", function() {
//     const el = document.createElement("div");
//
//     el.id = "errorMessage";
//     el.innerText = "Dynamicznie dopisywany tekst";
//     el.classList.add("errorMessage");
//     el.style.setProperty("background-color", "#761109");
//
//     const errorMessageDiv = document.querySelector("#s");
//     errorMessageDiv.appendChild(el);
// })

class FormValidate {
    constructor(form, options) {
        const defaultOptions = {
            classError : 'error'
        };

        this.form = form;
        this.options = Object.assign({}, defaultOptions, options);

        this.form.setAttribute('novalidate', 'novalidate');

        this.prepareElements();
        this.bindSubmit();
    }

    getFields() {
        return this.form.querySelectorAll('[required]');
    }

    getTestMethod(inputType) {
        const inputsData = {
            "text" : {event: "input", method: this.testInputText.bind(this)},
            "checkbox" : {event: "input", method: this.testInputCheckbox.bind(this)},
            "radio" : {event: "input", method: this.testInputCheckbox.bind(this)},
            "textarea" : {event: "input", method: this.testInputText.bind(this)},
            "select" : {event: "change", method: this.testInputSelect.bind(this)}
        };
        return inputsData[inputType];
    }

    getInputType(el) {
        if (el.tagName.toLowerCase() === "input") {
            return el.type.toLowerCase();
        } else {
            console.log(el.tagName.toLowerCase());
            return el.tagName.toLowerCase();
        }
    }

    prepareElements() {
        const elements = this.getFields();

        elements.forEach(el => {
            const inputType = this.getInputType(el);
            const methodData = this.getTestMethod(inputType);

            el.addEventListener(methodData.event, e => {
                methodData.method(el);
            });
        });
    }

    testInputText(input) {
        console.log(this);
        let inputIsValid = true;
        const pattern = input.getAttribute('pattern');

        if (pattern !== null) {
            //tutaj moglibyśmy skorzystać z checkValidity()
            const reg = new RegExp(pattern, 'gi');

            if (!reg.test(input.value)) {
                inputIsValid = false;
            }
        } else {
            if (input.value === '') {
                inputIsValid = false;
            }
        }

        if (inputIsValid) {
            this.showFieldValidation(input, true);
            return true;
        } else {
            this.showFieldValidation(input, false);
            return false;
        }
    }

    showFieldValidation(input, inputIsValid) {
        if (!inputIsValid) {
            input.parentElement.classList.add(this.options.classError);
        } else {
            input.parentElement.classList.remove(this.options.classError);
        }
    }

    testInputSelect(select) {
        if (select.value === '' || select.value === '-1') {
            this.showFieldValidation(select, false);
            return false;
        } else {
            this.showFieldValidation(select, true);
            return true;
        }
    }

    testInputCheckbox(input) {
        const name = input.getAttribute('name');
        const group = input.form.querySelectorAll(`input[name="${name}"]:checked`);

        if (group.length) {
            this.showFieldValidation(input, true);
            return true;
        } else {
            this.showFieldValidation(input, false);
            return false;
        }
    }

    bindSubmit() {
        this.form.addEventListener('submit', e => {
            e.preventDefault();

            const elements = this.getFields();
            let formIsValidated = true;

            elements.forEach(el => {
                const inputType = this.getInputType(el);
                const methodData = this.getTestMethod(inputType);
                if (!methodData.method(el)) {
                    formIsValidated = false;
                }
            });

            if (formIsValidated) {
                this.form.submit();
            } else {
                return false;
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const cfg = {};
    const form = new FormValidate(document.querySelector('.form'), cfg);
});