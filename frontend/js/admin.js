/**
 * admin.js - Lógica del frontend para el panel administrativo.
 */

const API_BASE_URL = 'https://amigo-secreto-ewot.onrender.com'; 

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del Login
    const loginForm = document.getElementById('adminLoginForm');
    const loginSection = document.getElementById('loginSection');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const loader = loginBtn.querySelector('.loader');
    const adminFeedback = document.getElementById('adminFeedback');

    // Elementos del Dashboard
    const dashboardSection = document.getElementById('dashboardSection');
    const downloadExcelBtn = document.getElementById('downloadExcelBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Lógica para mostrar/ocultar contraseña
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    togglePasswordBtn.addEventListener('click', () => {
        // Alternar el tipo de input entre 'password' y 'text'
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        
        // Alternar el diseño del icono SVG (Ojo cerrado / Ojo abierto)
        if (isPassword) {
            // Icono de ojo tachado (cerrado)
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            // Icono de ojo normal (abierto)
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    });

    // Variable para almacenar la contraseña validada en memoria
    let currentAdminPassword = '';

    // Manejo del Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Resetear estados
        const groups = loginForm.querySelectorAll('.input-group');
        groups.forEach(group => group.classList.remove('invalid'));
        adminFeedback.className = 'form-feedback';
        adminFeedback.textContent = '';

        const passwordInput = document.getElementById('password').value;

        // Validar que el campo no esté vacío
        if (!passwordInput) {
            document.getElementById('password').closest('.input-group').classList.add('invalid');
            return;
        }

        // UI: Estado de carga
        loginBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');

        try {
            // Llamamos a la API para verificar la contraseña
            const response = await verificarPassword(passwordInput);
            
            // Si es correcta, guardamos la contraseña en la variable para usarla luego
            currentAdminPassword = passwordInput;
            
            adminFeedback.textContent = response.message;
            adminFeedback.classList.add('success');
            
            // Transición al Dashboard
            setTimeout(() => {
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                loginForm.reset(); 
                adminFeedback.className = 'form-feedback';
                adminFeedback.textContent = '';
            }, 800);

        } catch (error) {
            // Si la contraseña es incorrecta o el servidor falla
            adminFeedback.textContent = error.message;
            adminFeedback.classList.add('invalid');
            adminFeedback.style.display = 'block';
            adminFeedback.style.color = 'var(--color-error)';
            adminFeedback.style.backgroundColor = 'rgba(211, 47, 47, 0.1)';
        } finally {
            loginBtn.disabled = false;
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });

    // Manejo del Cierre de sesión
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentAdminPassword = ''; // Borramos la contraseña de la memoria por seguridad
        dashboardSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Manejo de la Descarga del Excel
    downloadExcelBtn.addEventListener('click', () => {
        if (currentAdminPassword) {
            descargarExcel(currentAdminPassword);
        }
    });
});

/**
 * =======================================================
 * INTEGRACIÓN BACKEND: VERIFICAR CONTRASEÑA
 * =======================================================
 */
async function verificarPassword(password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/participantes/verify-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Contraseña incorrecta.');
        }

        return result;

    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('No se pudo conectar al servidor.');
        }
        throw new Error(error.message);
    }
}

/**
 * =======================================================
 * INTEGRACIÓN BACKEND: DESCARGAR EXCEL (OPCIÓN A)
 * =======================================================
 */
function descargarExcel(password) {
    // Construimos la URL incluyendo la contraseña validada en el parámetro ?key=
    const url = `${API_BASE_URL}/api/participantes/exportar-excel?key=${encodeURIComponent(password)}`;
    
    // Abrimos la URL para iniciar la descarga nativa del navegador
    window.open(url, '_blank');
}