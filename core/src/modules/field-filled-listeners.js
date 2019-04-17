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
