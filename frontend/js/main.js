/**
 * main.js - Lógica del frontend con selección visual de personajes.
 */
const API_BASE_URL = 'https://amigo-secreto-ewot.onrender.com'; 

document.addEventListener('DOMContentLoaded', () => {
    const userDataForm = document.getElementById('userDataForm');
    const mainContainer = document.getElementById('mainContainer');
    const step1Section = document.getElementById('step1Section');
    const step2Section = document.getElementById('step2Section');
    const charactersGrid = document.getElementById('charactersGrid');
    const backToFormBtn = document.getElementById('backToFormBtn');
    const formFeedbackStep1 = document.getElementById('formFeedbackStep1');
    const formFeedbackStep2 = document.getElementById('formFeedbackStep2');

    let tempFullName = ''; 

    // 1. Obtener y renderizar la chList (diccionario de personajes e imágenes) desde el backend
    async function cargarPersonajesConImagenes() {
        try {
            // Endpoint oficial proporcionado por tu compañero
            const response = await fetch(`${API_BASE_URL}/api/characters/get-characters`);
            
            if (!response.ok) throw new Error('No se pudo cargar la lista de personajes.');
            
            const data = await response.json(); 

            if (data.success && data.personajes) {
                renderizarTarjetasPersonajes(data.personajes);
            } else {
                throw new Error('Formato de datos inesperado.');
            }

        } catch (error) {
            console.warn('Error al cargar del servidor:', error);
            charactersGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--color-error);">Error al cargar los personajes. Intenta recargar la página.</p>`;
        }
    }

    function renderizarTarjetasPersonajes(chList) {
        charactersGrid.innerHTML = ''; // Limpiar grilla

        // Recorremos el diccionario dentro de data.personajes
        Object.entries(chList).forEach(([nombrePersonaje, imageUrl]) => {
            const card = document.createElement('div');
            card.className = 'character-profile-card';
            
            // Si la URL está vacía (""), asignamos una imagen por defecto o un icono genérico
            const avatarSrc = imageUrl && imageUrl.trim() !== "" 
                ? imageUrl 
                : 'https://api.iconify.design/lucide:user.svg'; // Icono por defecto elegante si no hay foto

            card.innerHTML = `
                <img src="${avatarSrc}" alt="${nombrePersonaje}" class="character-avatar" loading="lazy" onerror="this.src='https://api.iconify.design/lucide:user.svg'">
                <span class="character-name">${nombrePersonaje}</span>
            `;
            
            // Evento al hacer clic en la tarjeta del personaje
            card.addEventListener('click', () => {
                seleccionarPersonajeYEnviar(nombrePersonaje);
            });

            charactersGrid.appendChild(card);
        });
    }

    function renderizarTarjetasPersonajes(chList) {
        charactersGrid.innerHTML = ''; // Limpiar grilla

        // Recorremos el diccionario chList (Clave: Nombre, Valor: URL Imagen)
        Object.entries(chList).forEach(([nombrePersonaje, imageUrl]) => {
            const card = document.createElement('div');
            card.className = 'character-profile-card';
            
            card.innerHTML = `
                <img src="${imageUrl || 'https://via.placeholder.com/50'}" alt="${nombrePersonaje}" class="character-avatar" loading="lazy" onerror="this.src='https://via.placeholder.com/50'">
                <span class="character-name">${nombrePersonaje}</span>
            `;
            
            // Evento al hacer clic en la tarjeta del personaje
            card.addEventListener('click', () => {
                seleccionarPersonajeYEnviar(nombrePersonaje);
            });

            charactersGrid.appendChild(card);
        });
    }

    // 2. Manejar el paso 1 (Validar nombre y avanzar)
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formFeedbackStep1.textContent = '';
        formFeedbackStep1.className = 'form-feedback';

        const fullNameInput = document.getElementById('fullName');
        tempFullName = fullNameInput.value.trim();

        if (tempFullName.length < 3) {
            fullNameInput.closest('.input-group').classList.add('invalid');
            document.getElementById('error-fullName').textContent = 'Ingresa tu nombre completo.';
            return;
        }

        fullNameInput.closest('.input-group').classList.remove('invalid');

        // Transición a la vista amplia de personajes
        step1Section.classList.add('hidden');
        step2Section.classList.remove('hidden');
        mainContainer.classList.add('wide-mode'); // Amplía el contenedor visualmente
    });

    // 3. Botón para volver atrás
    backToFormBtn.addEventListener('click', () => {
        step2Section.classList.add('hidden');
        step1Section.classList.remove('hidden');
        mainContainer.classList.remove('wide-mode'); // Restaura el ancho original
        formFeedbackStep2.textContent = '';
    });

    // 4. Enviar el registro final al backend
    async function seleccionarPersonajeYEnviar(personajeElegido) {
        formFeedbackStep2.textContent = `Registrando participación con ${personajeElegido}... ⏳`;
        formFeedbackStep2.className = 'form-feedback success';
        formFeedbackStep2.style.display = 'block';

        try {
            const response = await registerParticipant({
                fullName: tempFullName,
                character: personajeElegido
            });

            formFeedbackStep2.textContent = response.message;
            
            setTimeout(() => {
                step2Section.innerHTML = `
                    <div class="card-header">
                        <h2>¡Registro Exitoso! 🎉</h2>
                        <p>Te has registrado correctamente como <strong>${personajeElegido}</strong>.</p>
                    </div>
                    <div class="back-link-container" style="margin-top: 2rem;">
                        <a href="index.html" class="btn-primary" style="display: block; text-decoration: none; text-align: center;">Registrar otro participante</a>
                    </div>
                `;
            }, 1200);

        } catch (error) {
            formFeedbackStep2.textContent = error.message;
            formFeedbackStep2.className = 'form-feedback error';
            formFeedbackStep2.style.display = 'block';
        }
    }
});

async function registerParticipant(data) {
    const response = await fetch(`${API_BASE_URL}/api/participantes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: data.fullName,
            cantante: data.character 
        })
    });

    const result = await response.json();

    if (!response.ok) {
        const textoError = result.error || result.mensaje || result.message || 'Ocurrió un error al registrar.';
        throw new Error(textoError); 
    }

    return { 
        status: 'success', 
        message: result.mensaje || '¡Tus datos fueron registrados correctamente! 🎉'
    };
}