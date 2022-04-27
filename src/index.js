import "./styles.css";
import { readFile } from "./helpers";

const DATA = readFile("../data/input.json");
console.clear();

// Make sure to submit a PR once your code is done

/*
 *    VALIDATION
 */

function validateTextField(textField) {
  // textField.multiline must be `true` or `false`
  if (
    textField.multiline &&
    textField.multiline !== true &&
    textField.multiline !== false
  ) {
    throw new Error(
      `Attribute 'multiline' must be boolean: found ${textField.multiline}`
    );
  }
}

function validateGlobalData(formField) {
  const requiredFields = ["type", "id", "label"];
  requiredFields.forEach((requiredField) => {
    // Object.keys(formField) => ["type", "id", "multiline", "label"]
    if (!Object.keys(formField).includes(requiredField)) {
      throw new Error(
        `Field '${requiredField}' required for all form elements.`
      );
    }
  });

  // Validate layout field
  if (
    formField.layout &&
    formField.layout !== "half" &&
    formField.layout !== "full"
  ) {
    throw new Error(
      `Attribute \`layout\` must be \`half\` or \`full\`: found \`${formField.layout}\``
    );
  }
}

function validateFormData(data) {
  if (!data.form) {
    throw new Error("No form element present");
  }

  if (!Array.isArray(data.form)) {
    throw new Error("`form` must be a list");
  }

  data.form.forEach((formField) => {
    // Check for global requirements
    validateGlobalData(formField);

    // Check for field-specific requirements
    switch (formField.type) {
      case "text":
        validateTextField(formField);
        break;
      case "radio":
        break;
      default:
        throw new Error(
          `Field type '${formField.type}' is not a valid form element.`
        );
    }
  });

  return true;
}

/*
 *    GENERATION
 */
function generateTextInputAndLabel(formField) {
  if (formField.multiline !== true) {
    const textInputElement = document.createElement("input");
    textInputElement.type = formField.type;
    textInputElement.id = formField.id;

    const textInputLabelElement = document.createElement("label");
    textInputLabelElement.htmlFor = formField.id;
    textInputLabelElement.innerText = formField.label;

    return [textInputElement, textInputLabelElement];
  } else {
    const textInputElement = document.createElement("textarea");
    textInputElement.id = formField.id;

    const textInputLabelElement = document.createElement("label");
    textInputLabelElement.htmlFor = formField.id;
    textInputLabelElement.innerText = formField.label;

    return [textInputElement, textInputLabelElement];
  }
}

function generateRadioInputAndLabel(formField, x) {
  const radioInputElement = document.createElement("input");
  const radioIdAndValue = formField.options[x].label;

  radioInputElement.type = formField.type;
  radioInputElement.id = radioIdAndValue;
  radioInputElement.name = formField.id;
  radioInputElement.value = radioIdAndValue;

  const radioInputLabelElement = document.createElement("label");
  radioInputLabelElement.htmlFor = radioIdAndValue;
  radioInputLabelElement.innerText = radioIdAndValue;

  return [radioInputElement, radioInputLabelElement];
}

/*
<form>
  <label for="myText">My label</label>
  <input id="myText" name="myText" type="text" />
</form>
*/
function generateForm(formData) {
  const app = document.getElementById("app");
  // Create form element
  const formElement = document.createElement("form");

  // Create
  formData.form.forEach((fieldData) => {
    switch (fieldData.type) {
      case "text":
        const [textElement, label] = generateTextInputAndLabel(fieldData);
        formElement.append(label, textElement);
        break;
      case "radio":
        const radioInputLabelElement = document.createElement("label");
        radioInputLabelElement.htmlFor = `${fieldData.id}Radio`;
        radioInputLabelElement.innerText = fieldData.label;
        formElement.append(radioInputLabelElement);
        const divElement = document.createElement("div");
        divElement.id = `${fieldData.id}Radio`;
        formElement.append(divElement);
        let x = 0;
        fieldData.options.forEach((optionData) => {
          const [radioElement, radioLabel] = generateRadioInputAndLabel(
            fieldData,
            x
          );
          divElement.append(radioElement, radioLabel);
          x++;
        });

        break;
      default:
        break;
    }
  });

  app.append(formElement);
}

// Program
const isFormValid = validateFormData(DATA);
if (isFormValid) {
  generateForm(DATA);
}

console.log(document.getElementById("app"));
