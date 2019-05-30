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

export default initTextareaAutoResizer;
