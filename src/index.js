import "./styles.css";
import { readFile } from "./helpers";

const DATA = readFile("../data/input.json");
console.clear();

// Make sure to submit a PR once your code is done aaaaaaaaa

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

function validateRadioField(radioField) {
  // radios must have 'options' elements that contain 'value' & 'label'
  const radioOptionContains = ["value", "label"];
  const radioFieldOptions = radioField.options;

  // Throws an error if there's no options for a radio
  if (!radioFieldOptions || radioFieldOptions.length === 0) {
    throw new Error("No 'options' available for radio element.");
  }

  radioFieldOptions.forEach((radioOption) => {
    if (
      radioOption.default &&
      radioOption.default !== true &&
      radioOption.default !== false
    ) {
      throw new Error(
        `Radio default must be Boolean. Is currently: ${radioOption.default}`
      );
    }
    radioOptionContains.forEach((radioFieldIncludes) => {
      if (!Object.keys(radioOption).includes(radioFieldIncludes)) {
        throw new Error(
          `Field '${radioFieldIncludes}' required for radio elements.`
        );
      }
    });
  });
}

function validateDropdownField(dropdownField) {
  // dropdowns must have 'options' that contain 'value' & 'label'
  const dropdownOptionsContains = ["value", "label"];
  const dropdownFieldOptions = dropdownField.options;

  if (!dropdownFieldOptions || dropdownFieldOptions.length === 0) {
    throw new Error("No 'options' available for dropdown element.");
  }

  dropdownFieldOptions.forEach((dropdownOption) => {
    dropdownOptionsContains.forEach((dropdownFieldIncludes) => {
      if (!Object.keys(dropdownOption).includes(dropdownFieldIncludes)) {
        throw new Error(
          `Field '${dropdownFieldIncludes}' required for dropdown elements.`
        );
      }
    });
  });
}

function validateCheckboxField(checkboxField) {
  if (
    checkboxField.default &&
    checkboxField.default !== true &&
    checkboxField.default !== false
  ) {
    throw new Error(
      `Checkbox default must be Boolean. Is currently: ${checkboxField.default}`
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
    if (typeof formField[requiredField] !== "string") {
      throw new Error(
        `Attribute '${requiredField}' must be a string. Found: ${typeof formField[
          requiredField
        ]}`
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
        validateRadioField(formField);
        break;
      case "dropdown":
        validateDropdownField(formField);
        break;
      case "checkbox":
        validateCheckboxField(formField);
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
  const elementToCreate = formField.multiline ? "textarea" : "input";
  const textInputElement = document.createElement(elementToCreate);
  const layoutWidth = checkLayout(formField);

  if (elementToCreate === "input") {
    textInputElement.type = formField.type;
  }
  textInputElement.id = formField.id;

  const textInputLabelElement = document.createElement("label");
  textInputLabelElement.htmlFor = formField.id;
  textInputLabelElement.innerText = formField.label;

  textInputElement.style.width = layoutWidth;
  textInputLabelElement.style.width = "47%";

  return [textInputElement, textInputLabelElement];
}

function generateRadioInputAndLabel(formField, optionData) {
  const radioInputElement = document.createElement("input");
  const radioIdAndValue = optionData.label;

  radioInputElement.type = formField.type;
  radioInputElement.id = radioIdAndValue;
  radioInputElement.name = formField.id;
  radioInputElement.value = radioIdAndValue;

  if (optionData.default === true) {
    radioInputElement.defaultChecked = true;
  }

  const radioInputLabelElement = document.createElement("label");
  radioInputLabelElement.htmlFor = radioIdAndValue;
  radioInputLabelElement.innerText = radioIdAndValue;

  return [radioInputElement, radioInputLabelElement];
}

function generateDropdownInputAndLabel(optionData) {
  const dropdownOptionElement = document.createElement("option");

  dropdownOptionElement.value = optionData.value;
  dropdownOptionElement.innerText = optionData.label;

  return dropdownOptionElement;
}

function generateCheckboxInputAndLabel(formField) {
  const checkboxElement = document.createElement("input");
  checkboxElement.type = formField.type;
  checkboxElement.id = formField.id;
  checkboxElement.name = formField.id;

  if (formField.default === true) {
    checkboxElement.defaultChecked = true;
  }

  const checkboxLabel = document.createElement("label");
  checkboxLabel.htmlFor = formField.id;
  checkboxLabel.innerText = formField.id;

  return [checkboxElement, checkboxLabel];
}

// Checks if the 'layout' of an element is 'full' or 'half'
function checkLayout(formField) {
  if (formField.layout === "half") {
    return "50%";
  }
  return "100%";
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
  formElement.id = "inputForm";

  // Create
  formData.form.forEach((fieldData) => {
    const layoutWidth = checkLayout(fieldData);

    switch (fieldData.type) {
      case "text":
        const [textElement, label] = generateTextInputAndLabel(fieldData);
        formElement.append(label, textElement);
        break;
      case "radio":
        const radioInputLabelElement = document.createElement("label");
        radioInputLabelElement.htmlFor = `${fieldData.id}Radio`;
        radioInputLabelElement.innerText = fieldData.label;
        radioInputLabelElement.style.width = layoutWidth;
        formElement.append(radioInputLabelElement);

        const divElement = document.createElement("div");
        divElement.id = `${fieldData.id}Radio`;
        divElement.style.width = layoutWidth;
        formElement.append(divElement);
        fieldData.options.forEach((optionData) => {
          const [radioElement, radioLabel] = generateRadioInputAndLabel(
            fieldData,
            optionData
          );
          divElement.append(radioElement, radioLabel);
        });
        break;
      case "dropdown":
        const dropdownInputLabelElement = document.createElement("label");
        dropdownInputLabelElement.htmlFor = `${fieldData.id}`;
        dropdownInputLabelElement.innerText = fieldData.label;
        dropdownInputLabelElement.style.width = "47%";
        formElement.append(dropdownInputLabelElement);

        const selectElement = document.createElement("select");
        selectElement.name = fieldData.id;
        selectElement.id = fieldData.id;
        selectElement.style.width = layoutWidth;

        formElement.append(selectElement);

        fieldData.options.forEach((optionData) => {
          const dropdownElement = generateDropdownInputAndLabel(optionData);
          selectElement.append(dropdownElement);
        });
        break;
      case "checkbox":
        const [checkboxElement, checkboxLabel] = generateCheckboxInputAndLabel(
          fieldData
        );

        const checkboxDiv = document.createElement("div");
        checkboxDiv.id = `${fieldData.id}Div`;

        formElement.append(checkboxDiv);
        checkboxDiv.append(checkboxElement, checkboxLabel);
        break;
      default:
        break;
    }
  });

  // Creates a div for the 'Submit' and 'Reset' button to sit inside
  const buttonDiv = document.createElement("div");
  buttonDiv.id = "buttonDiv";

  // Creates the 'Submit' and 'Reset' buttons
  const submitButton = document.createElement("input");
  submitButton.type = "Submit";
  submitButton.id = "submitButton";

  const resetButton = document.createElement("button");
  resetButton.id = "resetButton";
  resetButton.innerText = "Reset";

  buttonDiv.append(submitButton);
  buttonDiv.append(resetButton);

  app.append(formElement);
  formElement.append(buttonDiv);
}

// Program
const isFormValid = validateFormData(DATA);
if (isFormValid) {
  generateForm(DATA);
}

/*
Button listeners
*/

// Resets the form to default values onclick
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("inputForm").reset();
});

console.log(document.getElementById("app"));
