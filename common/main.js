// Formalism

/**
 * Add a class to form fields when they aren't empty
 */
const initFilledClasses = fields => {
    const handleBlurEvent = ({ target }) => {
        let isFilled;
        if (target.type === 'select-one') {
            if (target.options.length === 0) isFilled = false;
            const selectedIndex = target.options.selectedIndex;
            isFilled = target.options[selectedIndex].label.length > 0;
        }
        target.classList.toggle(
            'is-filled',
            isFilled ? isFilled : target.value.length > 0
        );
    };
    // Add listeners for blur events on form fields
    Array.from(fields).map(field => {
        if (
            ['select-one', 'text', 'search', 'textarea'].indexOf(field.type) < 0
        )
            return;
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
    Array.from(fields).map(field => {
        if (field.type !== 'textarea') return;
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
