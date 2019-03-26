// Formalism

/**
 * Add a class to form fields when they aren't empty
 * Required for select/input/textarea
 */
const initFieldFilledListeners = (
    fields,
    targetFields = ['INPUT', 'SELECT', 'TEXTAREA'],
    blacklistedTypes = [
        'button',
        'checkbox',
        'color',
        'hidden',
        'image',
        'radio',
        'range',
        'reset',
        'submit',
    ]
) => {
    const isSelectOneFilled = ({ options }) =>
        options.length === 0
            ? false
            : options[options.selectedIndex].label.length > 0;
    const handleBlurEvent = ({ target }) => {
        let isFilled;
        // Treat select fields differently
        if (target.type === 'select-one') isFilled = isSelectOneFilled(target);
        // Get the closest container ancestor
        const container = target.closest('[data-container]');
        container.classList.toggle(
            'is-filled',
            isFilled ? isFilled : target.value.length > 0
        );
    };
    // Add listeners for blur events on form fields
    Array.from(fields)
        .filter(field => targetFields.indexOf(field.nodeName) >= 0)
        .filter(field => blacklistedTypes.indexOf(field.type) < 0)
        .map(field => {
            field.addEventListener('blur', handleBlurEvent);
        });
};

/**
 * Autoexpand textareas
 */
const initTextareaAutoResizer = fields => {
    // Make a textarea expand to fit the user input
    const handleTextareaInput = ({ target }) => {
        // Reset field height
        target.style.height = 'inherit';
        // Calculate the textarea height
        const offset = target.offsetHeight - target.clientHeight;
        // Add the height
        target.style.height = `${target.scrollHeight + offset}px`;
    };
    Array.from(fields)
        .filter(field => field.nodeName === 'TEXTAREA')
        .map(field => {
            // Add listeners for input events on textareas
            field.addEventListener('input', handleTextareaInput);
            // Disable resize
            field.style.resize = 'none';
        });
};

const initFormalism = () => {
    const fields = document.querySelectorAll('[data-field]');
    initFieldFilledListeners(fields);
    initTextareaAutoResizer(fields);
};

// Element.closest() Polyfill for IE9+
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

initFormalism();

module.exports = { initFormalism };
