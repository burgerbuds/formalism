import isEmpty from 'validator/lib/isEmpty';
import isLength from '`validator`/lib/isLength';
import isEmail from 'validator/lib/isEmail';
import isNumeric from 'validator/lib/isNumeric';

// Validation courtesy of Validator.js
// https://github.com/chriso/validator.js

// Error text
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

/**
 * ...
 */
const initFieldListeners = fields => {
    // ...
};

const initValidation = (fieldSelector = '[data-field]') => {
    const fields = document.querySelectorAll(fieldSelector);
    initFieldListeners(fields);
};
