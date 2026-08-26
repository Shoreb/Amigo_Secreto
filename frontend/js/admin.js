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
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value
        };

        if (!credentials.username || !credentials.password) {
            if(!credentials.username) document.getElementById('username').closest('.input-group').classList.add('invalid');
            if(!credentials.password) document.getElementById('password').closest('.input-group').classList.add('invalid');
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

    // Manejo de la Descarga del Excel (CSV)
    downloadExcelBtn.addEventListener('click', () => {
        downloadParticipantsFile();
    });
});

/**
 * Simulación de autenticación
 */
async function loginAdmin(credentials) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Usuario por defecto para pruebas
            if (credentials.username === 'admin') {
                resolve({ 
                    status: 'success', 
                    message: 'Ingreso exitoso. Cargando panel...'
                });
            } else {
                reject(new Error('Credenciales incorrectas.'));
            }
        }, 1200);
    });
}

/**
 * =======================================================
 * GENERADOR DE ARCHIVO (EXCEL/CSV) - JAVASCRIPT VANILLA
 * =======================================================
 * En una etapa posterior, este archivo podría ser generado 
 * directamente por tu backend en Python y devuelto como un Blob.
 */
const API_BASE_URL = 'http://localhost:3000'; // Debe ser la misma ruta de tu backend

function downloadParticipantsFile() {
    // Al redirigir a esta ruta, el navegador detectará el archivo y comenzará la descarga
    // del Amigo_Secreto_Participantes.xlsx generado por el servidor.
    window.location.href = `${API_BASE_URL}/api/exportar-excel`;
}