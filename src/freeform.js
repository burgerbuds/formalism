/*
    Freeform ↔ Formalism Integration

    Usage:

    1. Import this file:
    Eg: {% includeJsFile rev('freeform.js') %}

    2. On your form page(s), specify the error and success templates in Twig and supply to JavaScript:

    {% set formErrorHtml %}
        <div class="form-error" data-form-error-note>
            <div class="form-error__inner">
                <div class="form-error__icon">
                    Icon
                </div>
                <div class="form-error__text">{% spaceless %}
                    {{ "There was an issue submitting the form, please check the fields below"|t }}
                {% endspaceless %}</div>
            </div>
        </div>
    {% endset %}

    {% set formSuccessHtml %}
        <div class="form-success" id="{{ "success-#{form.id}" }}">
            <div class="form-success__inner">
                <div class="form-success__icon">
                    Icon
                </div>
                <div class="form-success__text">{% spaceless %}
                    {{ "Your form was submitted successfully"|t }}
                {% endspaceless %}</div>
            </div>
        </div>
    {% endset %}

    <script>
        window.form{{ form.id }} = {
            successTemplate: '{% spaceless %}{{ formSuccessHtml }}{% endspaceless %}',
            errorTemplate: '{% spaceless %}{{ formErrorHtml }}{% endspaceless %}',
        }
    </script>

*/

if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = s => {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

const removeNode = (parentNode, selector) => {
    const node = parentNode.querySelector(selector);
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
};

const SELECTOR = {
    FORM_INNER: '[data-form-inner]',
    ERROR_NOTE: '[data-form-error-note]',
    FIELD_CONTAINER: '[data-container]',
    FIELD_ERROR: '[data-field-error]',
    FIELD: '[data-field]',
};

// Add the success message to the top of the form
global.renderFormSuccess = form => {
    const successTemplate =
        window[form.id.replace('-', '')].successTemplate ||
        'Your form was submitted';
    form.insertAdjacentHTML('beforebegin', successTemplate);
    // Remove the form
    removeNode(form.parentNode, 'form');
    // Remove the note
    changeSubmitState(form, false);
};

// Add the error message to the top of the form
global.renderFormErrors = (errors, form) => {
    removeNode(form, SELECTOR.ERROR_NOTE);
    const errorTemplate = window[form.id.replace('-', '')].errorTemplate || '';
    form.querySelector(SELECTOR.FORM_INNER).insertAdjacentHTML(
        'afterbegin',
        errorTemplate
    );
};

const removeExistingErrors = form => {
    removeNode(form, SELECTOR.ERROR_NOTE);
    const fieldErrors = form.querySelectorAll(SELECTOR.FIELD_ERROR);
    Array.from(fieldErrors).forEach(fieldError => {
        clearFieldError(fieldError);
    });
};

const changeSubmitState = (form, addState = true) => {
    // Form
    addState && form.classList.add('is-submitting');
    !addState && form.classList.remove('is-submitting');
    const submitButton = form.querySelector('button[type=submit]');
    submitButton && submitButton.setAttribute('disabled', addState);
    // Submitting notice (optional)
    const submittingNote = document.querySelector(`#submitting-${form.id}`);
    if (submittingNote) {
        addState && submittingNote.removeAttribute('hidden');
        !addState && submittingNote.setAttribute('hidden', '');
        submittingNote.scrollIntoView();
    }
};

const clearFieldError = field => {
    // TODO: Extended validation for field types
    const container = field.closest(SELECTOR.FIELD_CONTAINER);
    container.classList.remove('has-error');
    const errorMessage = container.querySelector(SELECTOR.FIELD_ERROR);
    if (!errorMessage) return;
    if (errorMessage.parentNode)
        errorMessage.parentNode.removeChild(errorMessage);
    return;
};

// Add the error messages to each field
global.renderErrors = (errors, form) => {
    removeExistingErrors(form);
    changeSubmitState(form, false);
    if (errors.length === 0) return;
    Object.keys(errors).forEach((fieldName, index) => {
        // Add the errors to the field
        const errorList = errors[fieldName];
        const field = form.querySelector(`[name=${fieldName}]`);
        if (!field) return;
        // Get parent container
        const container = field.closest(SELECTOR.FIELD_CONTAINER);
        if (!container) return;
        // Get the component name from its classname
        const componentName = container.classList && container.classList[0];
        const errorTemplate = `
                <div class="${componentName}__message ${componentName}__message--error" data-field-error>
                    ${errorList.join('<br/>')}
                </div>
            `;
        // Add the error class and content
        container.insertAdjacentHTML('beforeend', errorTemplate);
        container.classList.add('has-error');
        blurListener(field, true, clearFieldError);
        // Scroll the first field into view
        if (index === 0) field.scrollIntoView();
    });
};

const blurListener = (target, addListener = true, cb) => {
    if (addListener) {
        target.addEventListener('blur', event => {
            cb(event.target);
        });
    } else {
        target.removeEventListener('blur', event => {
            cb(event.target);
        });
    }
};

const addSubmitListeners = form => {
    if (!form) return;
    form.addEventListener('submit', () => {
        removeExistingErrors(form);
        changeSubmitState(form, true);
        return;
    });
};

// Run clearFieldError when an errored field is blurred
const addFieldBlurListeners = form => {
    const errors = form.querySelectorAll('.has-error');
    if (!errors) return;
    Array.from(errors).forEach(error => {
        const field = error.querySelector(SELECTOR.FIELD);
        if (!field) return console.error('Field not found within component');
        blurListener(field, true, clearFieldError);
    });
};

const addListeners = () => {
    const forms = document.querySelectorAll('form');
    if (!forms) return;
    Array.from(forms).forEach(form => {
        addSubmitListeners(form);
        addFieldBlurListeners(form);
    });
};

global.addEventListener(
    'DOMContentLoaded',
    () => {
        addListeners();
    },
    false
);
