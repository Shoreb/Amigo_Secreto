/**
 * main.js - Lógica del frontend para el registro de participantes.
 * Preparado para futura integración con backend.
 */

const API_BASE_URL = 'http://localhost:3000'; 

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const formFeedback = document.getElementById('formFeedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir recarga de página

        // Resetear estados
        resetValidation(form);
        formFeedback.className = 'form-feedback';
        formFeedback.textContent = '';

        // Recopilar datos (solo nombre y cantante)
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            singer: document.getElementById('singer').value.trim()
        };

        // Validar frontend
        if (!validateForm(formData)) return;

        // UI: Estado de carga
        setLoadingState(true);

        try {
            // Aquí se llama a la función que simula el backend
            const response = await registerParticipant(formData);
            
            // Éxito
            formFeedback.textContent = response.message;
            formFeedback.classList.add('success');
            form.reset(); // Limpiar formulario

        } catch (error) {
            // Manejo de errores
            formFeedback.textContent = error.message || 'Ocurrió un error. Intenta de nuevo.';
            formFeedback.classList.add('invalid');
        } finally {
            // UI: Restaurar botón
            setLoadingState(false);
        }
    });

    /**
     * Valida los campos vacíos y formatos básicos en el frontend.
     */
    function validateForm(data) {
        let isValid = true;

        if (data.fullName.length < 3) {
            showError('fullName', 'Ingresa tu nombre completo.');
            isValid = false;
        }

        if (data.singer.length < 2) {
            showError('singer', 'Ingresa el nombre de un cantante válido.');
            isValid = false;
        }

        return isValid;
    }

    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const group = input.closest('.input-group');
        const errorSpan = document.getElementById(`error-${inputId}`);
        
        group.classList.add('invalid');
        errorSpan.textContent = message;
    }

    function resetValidation(formElement) {
        const groups = formElement.querySelectorAll('.input-group');
        groups.forEach(group => group.classList.remove('invalid'));
    }

    function setLoadingState(isLoading) {
        submitBtn.disabled = isLoading;
        if (isLoading) {
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
        } else {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    }
});

/**
 * =======================================================
 * INTEGRACIÓN BACKEND (TODO)
 * =======================================================
 */

async function registerParticipant(data) {
    try {
        // Hacemos la petición POST al backend
        const response = await fetch(`${API_BASE_URL}/api/participantes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Mapeamos los nombres del frontend a lo que espera el backend
            body: JSON.stringify({
                nombre: data.fullName,
                cantante: data.singer
            })
        });

        // Convertimos la respuesta a JSON
        const result = await response.json();

        // Si el backend devuelve un error (ej. 400 Bad Request)
        if (!response.ok) {
            throw new Error(result.error || 'Ocurrió un error al registrar.');
        }

        // Si es exitoso (201 Created)
        return { 
            status: 'success', 
            message: result.mensaje 
        };

    } catch (error) {
        // Capturamos problemas de red o errores lanzados arriba
        throw new Error(error.message || 'Error de conexión con el servidor.');
    }
}