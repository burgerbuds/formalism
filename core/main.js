// Formalism

/**
 * Add a class to form fields when they aren't empty
 * Required for select/input/textarea
 */
const initFilledClasses = (
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
        if (target.nodeName === 'SELECT') isFilled = isSelectOneFilled(target);
        // TODO: Toggle class on data-container parents
        target.classList.toggle(
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
const initTextareas = fields => {
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
    initFilledClasses(fields);
    initTextareas(fields);
};

initFormalism();

module.exports = { initFormalism };
