import { InputType, GetInputTypeState, CalcState } from "./input.js";
import { cNumber, CalcBlock, CalcParentesis, CalcNumber, CalcOperator, CalcResult } from "./items_refactor.js"
import Equation from "./equation_refactor.js";

export default class Calculatrice {

    constructor(element) {
        this.equation = new Equation();
        this.element = element
        this.current = new CalcNumber();
        this.HookEvent()
        this.DoRefresh()
    }

    HookEvent() {
        let all_button = this.element.querySelectorAll("[data-calc-button-type]");

        for (var button of all_button) {
            let targetDataSet = button.dataset
            let buttonType = InputType[targetDataSet.calcButtonType];

            if (buttonType == null) {
                button.disabled = true;

                console.warn(`This button attribute "data-calc-button-type" is not valide`, button)
                continue;
            } else if (buttonType.hasInput) {
                let buttonInput = targetDataSet.calcButtonInput;
                if (buttonInput == null) {
                    button.disabled = true;
                    console.warn(`${buttonType.name} button should implement this attribut: "data-cal-button-input"`, button);
                    continue;
                } else {
                    let datasetInput = buttonInput.split("-");
                    if (datasetInput[0] != buttonType.inputPrefix) {
                        button.disabled = true;
                        console.warn(`The "data-cal-button-input" attribute of this ${buttonType.name} button should start with "${buttonType.inputPrefix}"`, button);
                        continue;
                    }
                }
            }
            button.addEventListener('click', (e) => { this.OnInputEvent(e) }, true);
        }

    }

    OnInputEvent(event) {
        let targetDataSet = event.currentTarget.dataset
        let buttonType = InputType[targetDataSet.calcButtonType];
        var input = null;

        if (buttonType.hasInput) {
            let buttonInput = targetDataSet.calcButtonInput;
            if (buttonInput != null) {
                input = buttonInput.split("-")[1];
            }
        }
        console.log(buttonType.name, input);


        switch (GetInputTypeState(buttonType)) {
            case CalcState.NUMBER:
                this.current.OnInput(buttonType, input);
                break;
            case CalcState.DELETE:
                this.current.OnInputDelete();
                break
            case CalcState.OPERATOR:
                this.equation.OnInputOperator(input, this.current);
                break
            default:
                break;
        }
        this.DoRefresh()
    }

    DoRefresh() {
        this.RefreshCurrentDisplay()
        this.RefreshEquationDisplay()
    }

    RefreshCurrentDisplay() {
        let allDisplay = this.element.querySelectorAll('[data-calc-display-type="CURRENT"]');

        for (var display of allDisplay) {
            display.value = this.current.current;
        }

    }
    RefreshEquationDisplay() {
        let allDisplay = this.element.querySelectorAll('[data-calc-display-type="EQUATION"]');

        for (var display of allDisplay) {
            display.value = this.current.display;
        }
    }
}