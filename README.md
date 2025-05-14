# CompuScan - Sistema de Control de Equipos y Asistencia

Sistema inteligente de control de equipos y asistencia con tecnología RFID.

## Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── config/        # Configuraciones
├── constants/     # Constantes y temas
├── types/         # Definiciones de tipos (JSDoc)
└── utils/         # Utilidades y helpers
```

## Tecnologías Utilizadas

- React 18
- JavaScript (ES6+)
- Tailwind CSS
- Vite

## Configuración del Entorno

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto:
```
VITE_API_URL=http://localhost:3000/api
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura de Datos

### Usuario
```javascript
/**
 * @typedef {Object} User
 * @property {string} id - ID único del usuario
 * @property {string} nombre - Nombre del usuario
 * @property {string} apellido - Apellido del usuario
 * @property {string} email - Email del usuario
 * @property {'Admin'|'Instructor'|'Aprendiz'} tipo - Tipo de usuario
 * @property {string} [carnetRfid] - Carnet RFID del usuario (opcional)
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de actualización
 */
```

### Equipo
```javascript
/**
 * @typedef {Object} Equipo
 * @property {string} id - ID único del equipo
 * @property {string} marca - Marca del equipo
 * @property {string} modelo - Modelo del equipo
 * @property {string} serial - Número de serie del equipo
 * @property {'laptop'|'desktop'|'tablet'|'smartphone'|'otro'} tipo - Tipo de equipo
 * @property {string} [color] - Color del equipo (opcional)
 * @property {string} [observaciones] - Observaciones adicionales (opcional)
 * @property {string} usuarioId - ID del usuario propietario
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de actualización
 */
```

### Asistencia
```javascript
/**
 * @typedef {Object} Asistencia
 * @property {string} id - ID único de la asistencia
 * @property {string} usuarioId - ID del usuario
 * @property {'entrada'|'salida'} tipo - Tipo de registro
 * @property {Date} fecha - Fecha y hora del registro
 * @property {'activo'|'inactivo'} estado - Estado del registro
 * @property {string} carnetRfid - Carnet RFID utilizado
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de actualización
 */
```

## Endpoints de la API

### Autenticación
- POST `/api/auth/login` - Iniciar sesión
- POST `/api/auth/register` - Registro de usuario
- POST `/api/auth/logout` - Cerrar sesión
- POST `/api/auth/refresh` - Renovar token

### Usuarios
- GET `/api/users` - Listar usuarios
- GET `/api/users/profile` - Obtener perfil
- GET `/api/users/:id` - Obtener usuario por ID
- GET `/api/users/rfid/:rfid` - Obtener usuario por RFID

### Equipos
- GET `/api/equipos` - Listar equipos
- POST `/api/equipos` - Crear equipo
- GET `/api/equipos/:id` - Obtener equipo por ID
- GET `/api/equipos/user/:userId` - Obtener equipos por usuario
- GET `/api/equipos/serial/:serial` - Obtener equipo por serial

### Asistencias
- GET `/api/asistencias` - Listar asistencias
- POST `/api/asistencias` - Registrar asistencia
- GET `/api/asistencias/:id` - Obtener asistencia por ID
- GET `/api/asistencias/user/:userId` - Obtener asistencias por usuario
- GET `/api/asistencias/date/:date` - Obtener asistencias por fecha
- GET `/api/asistencias/estadisticas` - Obtener estadísticas

## Convenciones de Código

1. **Nombres de Componentes**: PascalCase
2. **Nombres de Funciones**: camelCase
3. **Nombres de Variables**: camelCase
4. **Nombres de Constantes**: UPPER_SNAKE_CASE
5. **Documentación**: JSDoc para tipos y funciones

## Manejo de Errores

El sistema utiliza un manejo de errores centralizado con los siguientes códigos:

- 400: Error de validación
- 401: No autorizado
- 403: Prohibido
- 404: No encontrado
- 500: Error interno del servidor

## Validaciones

### RFID
- Mínimo 8 caracteres
- Solo letras mayúsculas y números
- No espacios ni caracteres especiales

### Serial
- Mínimo 5 caracteres
- Alfanumérico
- Único en el sistema

## Contribución

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.