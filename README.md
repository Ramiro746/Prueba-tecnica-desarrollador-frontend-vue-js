# Proyecto de Gestión de Proyectos y Tareas

Este proyecto es una aplicación web para gestionar proyectos y sus tareas asociadas, desarrollada con **Vue 3**, siguiendo buenas prácticas de componentes reutilizables y diseño responsivo.

---

- **Framework y librerías:**
  - Vue 3 con Composition API
  - Vue Router
  - Pinia (o Vuex)
  - Axios
  - TailwindCSS o Bootstrap
  - Vite como bundler

- **UI/UX**
  - Diseño responsivo (móvil y desktop)
  - Buena separación de componentes y rutas

---

### Vistas y Rutas

- **Vista de Proyectos**
  - Tabla con listado de proyectos
  - Filtros: estado (activo/inactivo)
  - Botón para crear nuevo proyecto
  - Modal o formulario en página para crear proyecto

- **Vista de Tareas**
  - Tabla de tareas por proyecto (usando `project_id`)
  - Filtros dinámicos: estado (pendiente, en progreso, hecho), prioridad (alta, media, baja)
  - Botón para crear nueva tarea
  - Modal o formulario en página para crear/editar tarea

### 2. Formularios
- Formularios reactivos con validaciones claras
- Mensajes de error amigables
- Prevención de envíos múltiples

### 3. Componentes
- Componente reutilizable de tabla
- Componente de filtros dinámicos
- Componente de formulario

### 4. Integración con API
- Endpoints consumidos:
  - [Proyectos](https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/projects)
  - [Tareas](https://681507e7225ff1af162aeb7e.mockapi.io/api/v1/tasks)
- Uso de `axios` para llamadas
- Se muestran mensajes de error si las peticiones fallan

---



