import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import isEmail from 'validator/lib/isEmail';
import isNumeric from 'validator/lib/isNumeric';

// Validation courtesy of Validator.js
// https://github.com/chriso/validator.js

// Error text
// TODO: Allow data into this
const errorText = () => ({
    required: `Please enter something in this field`,
    minMaxLength: `This value must be between ${arguments['min']} and ${
        arguments['max']
    }`,
    email: `This doesn't seem to be an email address`,
    number: `This field requires a number`,
});

const validateRequired = el => (isEmpty(el.value) ? errorText.required : null);

const validateMinMaxLength = (el, min, max) =>
    isLength(el.value, { min: min, max: max })
        ? errorText.minMaxLength({ min: min, max: max })
        : null;

const validateEmail = el => (!isEmail(el.value) ? errorText.email : null);

const validateNumber = el =>
    !isNumeric(el.value, { no_symbols: true })
        ? errorText.number(el.value)
        : null;

const initFieldListeners = fields => {};

let fields = document.querySelectorAll('[data-field]');

const initValidation = (specifiedFields = undefined) => {
    if (specifiedFields) fields = specifiedFields;
    if (!fields) return;
    initFieldListeners(fields);
};

document.addEventListener('DOMContentLoaded', function() {
    initValidation();
});

export { initValidation };

// Freeform has issues with required fields that are conditionally hidden by default
const freeformFixConditionals = () => {
    // Loop through fields with conditional rules
    const conditionalFields = document.querySelectorAll(`[data-ff-rule]`);
    // Build an array of condition fields remove any `required` attributes
    Array.from(conditionalFields).map(field => {
        const fieldAttr = JSON.parse(field.dataset.ffRule);
        const fieldTypes = field.querySelector(`input, select, textarea`);
        if (fieldTypes) fieldTypes.removeAttribute(`required`);
    });
};
