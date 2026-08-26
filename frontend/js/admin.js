/**
 * admin.js - Lógica del frontend para el panel administrativo.
 * Preparado para futura integración con sistema de autenticación (JWT/Sesiones).
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminLoginForm');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const loader = loginBtn.querySelector('.loader');
    const adminFeedback = document.getElementById('adminFeedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Resetear estados
        const groups = form.querySelectorAll('.input-group');
        groups.forEach(group => group.classList.remove('invalid'));
        adminFeedback.className = 'form-feedback';
        adminFeedback.textContent = '';

        const credentials = {
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value
        };

        // Validación básica vacía
        let isValid = true;
        if (!credentials.username) {
            document.getElementById('username').closest('.input-group').classList.add('invalid');
            isValid = false;
        }
        if (!credentials.password) {
            document.getElementById('password').closest('.input-group').classList.add('invalid');
            isValid = false;
        }

        if (!isValid) return;

        // UI: Estado de carga
        loginBtn.disabled = true;
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');

        try {
            // Llamada simulada al backend
            const response = await loginAdmin(credentials);
            
            adminFeedback.textContent = response.message;
            adminFeedback.classList.add('success');
            
            // Simular redirección al dashboard (panel de sorteo y usuarios)
            // window.location.href = '/dashboard.html';

        } catch (error) {
            adminFeedback.textContent = error.message;
            adminFeedback.style.display = 'block';
            adminFeedback.style.color = 'var(--color-error)';
            adminFeedback.style.backgroundColor = 'rgba(211, 47, 47, 0.1)';
        } finally {
            // Restaurar UI
            loginBtn.disabled = false;
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });
});

/**
 * =======================================================
 * INTEGRACIÓN BACKEND & AUTENTICACIÓN (TODO)
 * =======================================================
 * Aquí conectarás el endpoint de login de tu backend para 
 * obtener el Token JWT o inicializar la sesión.
 */
async function loginAdmin(credentials) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulación: Si pones 'admin' entra, si no, da error.
            if (credentials.username === 'admin') {
                resolve({ 
                    status: 'success', 
                    message: 'Ingreso exitoso. Redirigiendo al panel... 🔒',
                    token: 'fake-jwt-token'
                });
            } else {
                reject(new Error('Credenciales incorrectas.'));
            }
        }, 1200);
    });
}