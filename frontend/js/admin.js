/**
 * admin.js - Lógica del frontend para el panel administrativo.
 */

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

    // Manejo del Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Resetear estados
        const groups = loginForm.querySelectorAll('.input-group');
        groups.forEach(group => group.classList.remove('invalid'));
        adminFeedback.className = 'form-feedback';
        adminFeedback.textContent = '';

        const credentials = {
            password: document.getElementById('password').value
        };

        // Validar que el campo no esté vacío
        if (!credentials.password) {
            document.getElementById('password').closest('.input-group').classList.add('invalid');
            return;
        }

        // UI: Estado de carga
        loginBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');

        try {
            const response = await loginAdmin(credentials);
            
            // Si el login es exitoso, hacemos la transición al Dashboard
            adminFeedback.textContent = response.message;
            adminFeedback.classList.add('success');
            
            setTimeout(() => {
                loginSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
                // Limpiar formulario para cuando se cierre sesión
                loginForm.reset(); 
                adminFeedback.className = 'form-feedback';
                adminFeedback.textContent = '';
            }, 800);

        } catch (error) {
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
        dashboardSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    });

    // Manejo de la Descarga del Excel
    downloadExcelBtn.addEventListener('click', () => {
        downloadParticipantsFile();
    });
});

/**
 * Simulación de autenticación (Solo Contraseña)
 */
async function loginAdmin(credentials) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Contraseña por defecto para pruebas
            if (credentials.password === '123456') {
                resolve({ 
                    status: 'success', 
                    message: 'Ingreso exitoso. Cargando panel...'
                });
            } else {
                reject(new Error('Contraseña incorrecta.'));
            }
        }, 1200);
    });
}

/**
 * =======================================================
 * DESCARGA DEL EXCEL
 * =======================================================
 */
const API_BASE_URL = 'https://amigo-secreto-ewot.onrender.com'; // Debe ser la misma ruta de tu backend

function downloadParticipantsFile() {
    window.location.href = `${API_BASE_URL}/api/exportar-excel`;
}