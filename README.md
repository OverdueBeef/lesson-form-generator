# Form Generator

## Description

Your goal is to build a dynamic form generator script which takes in a JSON string as input and outputs a form.

The form should support the following field types for V1:

- Text input (single line and multi line)
- Radio buttons
- Checkboxes (only single, not form group)
- Dropdown select

The form should include a `submit` and `reset` button by default

## Guidelines

Design guideline: (https://jetsloth.com/wp-content/uploads/2020/09/Gravity-Forms-Design-Examples-purple.png)[Design guideline]

I recommend you to implement one field at a time or else it might get overwhelming. Now that you're getting used to cleaner code,
try to separate the logic into two distinct areas :

1. Validation step -> ensures all required fields are there and reports an error if not
2. Processing step -> If the validation step is successful, proceeds to output the form HTML

I've intentionally made some things vague or potentially left conflicting / confusing information, this is to simulate not having everything in black and white up front. feel free to ask me if you have any questions or need clarifications on something

## Input schema

The JSON input should be of the following schema:

```json
{
  "form": [
    {
      "type": "text", // or radio, checkbox, dropdown - required
      "id": "myText", // used for the input `name` field
      "multiline": true, // or false, only valid for text - default is false
      "label": "My label", // free form text - required
      "layout": "half" // or full, this allows for layout flexibility (either 2 cols or full width) - default is full
    },
    {
      "type": "radio",
      "id": "iceCream", // this will be used for the name on all options
      "label": "My label",
      "layout": "full",
      "options": [
        // required
        {
          "value": "chocolate", // the value of the radio button, required
          "label": "Chocolate", // required
          "default": true // or false, no default is required
        },
        {
          "value": "vanilla", // the value of the radio button, required
          "label": "Vanilla", // required
          "default": false // or false, no default is required
        }
      ]
    },
    {
      "type": "dropdown",
      "id": "myDropdown",
      "label": "My Label",
      "layout": "half",
      "options": [
        {
          "value": "option1",
          "label": "Option 1"
        },
        {
          "value": "option2",
          "label": "Option 2"
        }
      ]
    },
    {
      "type": "checkbox", // required
      "id": "myCheckbox", // required
      "label": "My label", // required
      "default": true // or false, defaults to false
    }
  ]
}
```
