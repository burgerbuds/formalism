import initFieldFilledListeners from './modules/field-filled-listeners';
import initTextareaAutoResizer from './modules/textarea-auto-resizer';

let fields = document.querySelectorAll('[data-field]');

const initFormalism = (specifiedFields = undefined) => {
    if (specifiedFields) fields = specifiedFields;
    if (!fields) return;
    initFieldFilledListeners(fields);
    initTextareaAutoResizer(fields);
};

document.addEventListener('DOMContentLoaded', function() {
    initFormalism();
});

export { initFormalism };
