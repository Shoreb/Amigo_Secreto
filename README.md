<p align="center">
  <img src="https://res.cloudinary.com/dcdbcpk3i/image/upload/v1788836950/banner_aeab6t.png" alt="Amigo Secreto Banner">
</p>

# 💌 𝓐𝓶𝓲𝓰𝓸 𝓢𝓮𝓬𝓻𝓮𝓽𝓸 — Dınάmıcα de Amor ч Amıstαd . ݁₊ ⊹ . 

Aplicación web ligera, moderna y atractiva diseñada específicamente para gestionar la dinámica del tradicional juego de **"Amigo Secreto"** con temática de Amor y Amistad.  

El proyecto cuenta con una arquitectura full-stack estructurada en un entorno modular, separando un frontend dinámico e intuitivo y un backend robusto encargado de la seguridad y el control de los participantes.  

## 🏹 Características Principales

- **🎀 Diseño Temático y Romántico:** Interfaz limpia con una paleta de colores personalizada, tipografías elegantes de Google Fonts (*Dancing Script* y *Quicksand*), animaciones fluidas y corazones flotantes decorativos de fondo.
- **📝 Registro Visual en Dos Pasos:**
  1. Ingreso de nombre y apellido del participante.
  2. Selección de un personaje único a través de un catálogo interactivo en formato de tarjetas con imágenes institucionales o avatares de respaldo.
- **Control de Disponibilidad en Tiempo Real:** Los personajes que ya han sido seleccionados por otros jugadores desaparecen automáticamente del catálogo general para evitar duplicados.
- **Panel de Administración Protegido:** Acceso seguro mediante validación de contraseña contra el backend, con opción interactiva para mostrar/ocultar credenciales ("ojito").
- **Exportación de Reportes:** Permite descargar un reporte oficial en formato Excel (`.xlsx`) con el listado completo de participantes inscritos de forma segura.

## ⚙️ Tecnologías Utilizadas

### **Frontend**

- **HTML5 & CSS3:** Estructuración semántica, variables CSS, Flexbox, Grid y animaciones personalizadas.
- **JavaScript (Vanilla ES6+):** Manipulación dinámica del DOM, gestión de vistas modulares y consumo de servicios mediante la API `Fetch`.

### **Backend**

- **Node.js & Express:** Configuración de rutas y servicios API REST.
- **Redis / Base de Datos:** Persistencia rápida para la gestión de registros y control de personajes ocupados.

## 🖿 Estructura del Repositorio

```text
Amigo_Secreto
├── backend/
│   ├── config/         # Configuraciones de conexión (Redis, personajes)
│   ├── routes/         # Endpoints de participantes y personajes
│   ├── index.js        # Archivo principal del servidor
│   └── package.json    # Dependencias del backend
└── frontend/
    ├── css/
    │   └── styles.css  # Estilos globales y animaciones temáticas
    ├── js/
    │   ├── main.js     # Lógica de registro y catálogo visual
    │   └── admin.js    # Lógica de seguridad y exportación de Excel
    ├── index.html      # Pantalla principal de inscripción
    └── admin.html      # Panel de control administrativo
```

## 🔗 Endpoints de la API REST

El sistema se comunica mediante los siguientes servicios expuestos en el backend:

| **Método** | **Ruta**                             | **Descripción**                                                                       |
| ---------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| `GET`      | `/api/characters/get-characters`     | Devuelve el catálogo dinámico de personajes e imágenes disponibles (los no elegidos). |
| `POST`     | `/api/participantes`                 | Registra un nuevo participante validando la disponibilidad del personaje.             |
| `POST`     | `/api/participantes/verify-password` | Valida la clave de administrador para el ingreso al panel.                            |
| `GET`      | `/api/participantes/exportar-excel`  | Descarga protegida de la hoja de cálculo con los registros (`?key=...`).              |

## 🚀 Despliegue y Uso

- **Frontend (Interfaz de Usuario):** Desplegado de forma estática en plataformas como **Vercel**.
- **Backend (Servidor API):** Alojado en servicios en la nube como **Render** (`[https://amigo-secreto-ewot.onrender.com](https://amigo-secreto-ewot.onrender.com)`).



## 👨‍💻 Autores

* **[Shoreb Pava](https://github.com/Shoreb)** 
* **[Sebastian Coronado](https://github.com/sebx771)**

Desarrollado con dedicación como solución práctica y funcional para dinámicas especiales y emprendimientos.
