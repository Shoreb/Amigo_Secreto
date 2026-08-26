/**
 * main.js - Lógica del frontend para el registro de participantes.
 */
const API_BASE_URL = 'http://localhost:3000'; 

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const formFeedback = document.getElementById('formFeedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        // Resetear estados visuales
        resetValidation(form);
        formFeedback.className = 'form-feedback'; // Oculta el cuadro de mensajes
        formFeedback.textContent = '';

        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            singer: document.getElementById('singer').value.trim()
        };

        if (!validateForm(formData)) return;

        // UI: Estado de carga
        setLoadingState(true);

        try {
            const response = await registerParticipant(formData);
            
            // Éxito: Mostramos el mensaje verde
            formFeedback.textContent = response.message;
            formFeedback.classList.add('success');
            form.reset(); 

        } catch (error) {
            // ERROR: Mostramos el cuadro rojo con el texto del backend
            formFeedback.textContent = error.message;
            formFeedback.classList.add('error'); // <- Aquí activamos el CSS que acabas de agregar

            // Si el error menciona al cantante, resaltamos en rojo ese input
            const mensajeError = error.message.toLowerCase();
            if (mensajeError.includes('uso') || mensajeError.includes('cantante') || mensajeError.includes('existe')) {
                const singerInput = document.getElementById('singer');
                singerInput.closest('.input-group').classList.add('invalid');
                document.getElementById('error-singer').textContent = error.message;
            }
        } finally {
            setLoadingState(false);
        }
    });

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
 * Petición real al backend
 */
async function registerParticipant(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/participantes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: data.fullName,
                cantante: data.singer
            })
        });

        // Intentamos leer la respuesta del backend
        const result = await response.json();

        // Si hay un error (ej. status 400 por cantante repetido)
        if (!response.ok) {
            // Buscamos el texto del error en cualquiera de estos campos comunes
            const textoError = result.error || result.mensaje || result.message || 'Ocurrió un error al registrar.';
            throw new Error(textoError); 
        }

        return { 
            status: 'success', 
            message: result.mensaje || '¡Registrado con éxito!'
        };

    } catch (error) {
        // Esto atrapa tanto el "throw new Error" de arriba como problemas de servidor caído o CORS
        if (error.message === 'Failed to fetch') {
            throw new Error('No se pudo conectar al servidor. Revisa tu conexión.');
        }
        throw new Error(error.message);
    }
}