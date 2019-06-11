// Element.closest() Polyfill for IE9+
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
if (!global.Element.prototype.matches) {
    global.Element.prototype.matches =
        global.Element.prototype.msMatchesSelector ||
        global.Element.prototype.webkitMatchesSelector;
}

if (!global.Element.prototype.closest) {
    global.Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/**
 * Add a class to form fields when they aren't empty
 * Required for select/input/textarea
 */
const initFieldFilledListeners = (
    fields,
    targetFields = ['INPUT', 'SELECT', 'TEXTAREA'],
    blacklistedTypes = [
        'button',
        'color',
        'hidden',
        'image',
        'range',
        'reset',
        'submit',
    ]
) => {
    const SELECTOR = {
        FIELD_CONTAINER: '[data-field-container]',
    };

    const isSelectOneFilled = ({ options }) =>
        options.length === 0
            ? false
            : options[options.selectedIndex].label.length > 0;

    const getContainer = field => {
        // Get parent container
        let container = field.closest(SELECTOR.FIELD_CONTAINER);
        // Check if container is part of a fieldset
        const isFieldset = container.hasAttribute('data-field-fieldgroup');
        // Select the parent fieldset if field
        if (isFieldset) {
            container = container.parentNode.closest(SELECTOR.FIELD_CONTAINER);
        }
        if (!container) return console.warn(`No container found for ${field}`);
        return container;
    };

    const handleBlurEvent = ({ target }) => {
        let isFilled;
        // Treat select fields differently
        if (target.type === 'select-one') isFilled = isSelectOneFilled(target);
        // Get the container ancestor
        const container = getContainer(target);
        if (!container) return;
        // Add or remove the is-filled class
        if (isFilled || target.value.length > 0)
            return container.classList.add('is-filled');
        container.classList.remove('is-filled');
    };

    // Add listeners for blur events on form fields
    Array.from(fields)
        .filter(field => targetFields.indexOf(field.nodeName) >= 0)
        .filter(field => blacklistedTypes.indexOf(field.type) < 0)
        .map(field => {
            field.addEventListener('blur', handleBlurEvent);
        });
};

export default initFieldFilledListeners;
