# Sistema de Autenticación de Empresas

## 📋 Descripción

Sistema completo de autenticación y gestión de empresas con roles diferenciados (Empresa y Administrador), desarrollado con React, TypeScript y Tailwind CSS.

## ✨ Funcionalidades Implementadas

### 1. **Pantalla de Inicio de Sesión**
- Formulario de login con email y contraseña
- Botón destacado "Registrar Empresa"
- Validación de credenciales
- Mensajes de error claros
- Animaciones sutiles con Motion

### 2. **Formulario de Registro de Empresa**
- Campos completos:
  - Nombre de la empresa
  - NIT o identificación fiscal
  - Correo electrónico
  - Teléfono
  - Dirección
  - Contraseña
  - Confirmación de contraseña
- Validación completa de todos los campos
- Confirmación visual de registro exitoso
- Redirección automática al login

### 3. **Dashboard de Empresa**
- **Perfil de Empresa**: Visualización completa de datos registrados
- **Métricas clave** (KPIs):
  - Estado general del sistema
  - Controles activos
  - Tasa de cumplimiento ISO 27001
  - Incidentes del mes
- **Gráficos interactivos**:
  - Estado de controles por mes
  - Tendencia de incidentes
  - Distribución de cumplimiento
- **Actividad reciente**: Timeline de acciones
- **Acceso al monitoreo en tiempo real**: Integración con SecurityDashboard

### 4. **Dashboard de Administrador**
- **Vista general del sistema**:
  - Total de empresas registradas
  - Empresas activas
  - Cumplimiento promedio
  - Controles totales
- **Gestión de empresas**:
  - Lista completa con tabla interactiva
  - Ver detalles de cada empresa
  - Editar información de empresas
  - **Acceder al dashboard de cualquier empresa**
- **Información detallada**: NIT, email, teléfono, dirección, etc.

## 🔐 Credenciales de Prueba

### Usuario Empresa
- **Email**: `empresa@test.com`
- **Contraseña**: `empresa123`
- **Datos registrados**:
  - Nombre: TechCorp S.A.
  - NIT: 900123456-7
  - Teléfono: +57 300 123 4567
  - Dirección: Calle 72 #10-51, Bogotá

### Usuario Administrador
- **Email**: `admin@test.com`
- **Contraseña**: `admin123`

## 🎯 Flujo de Usuario

### Para Empresas:
1. **Login** → Ingresar credenciales o hacer clic en "Registrar Empresa"
2. **Registro** → Completar formulario con todos los datos
3. **Confirmación** → Mensaje de éxito y redirección automática
4. **Dashboard** → Ver perfil, métricas y acceder al monitoreo

### Para Administradores:
1. **Login** → Ingresar con credenciales de admin
2. **Panel de Control** → Ver KPIs globales de todas las empresas
3. **Gestión** → Ver, editar o acceder a cualquier empresa
4. **Vista de Empresa** → Acceder al dashboard completo de una empresa específica

## 🎨 Características de Diseño

- **Diseño moderno y limpio**: Uso de gradientes sutiles y espaciado generoso
- **Responsive**: Adaptable a desktop, tablet y móvil
- **Animaciones sutiles**: Transiciones suaves con Motion/React
- **Jerarquía visual clara**: Información importante destacada
- **Código de colores**:
  - Azul: Empresas y acciones principales
  - Púrpura: Administración
  - Verde: Estados positivos y éxitos
  - Rojo/Amarillo: Alertas y advertencias

## 🔄 Sistema de Roles

El sistema diferencia automáticamente entre dos tipos de usuarios:

- **Empresa**: Acceso limitado a su propio dashboard y datos
- **Administrador**: Acceso completo a todas las empresas y gestión del sistema

## 💾 Datos Mock

La aplicación utiliza datos simulados almacenados en el contexto de autenticación. Para implementación en producción, se recomienda conectar con Supabase o backend similar para persistencia real.

## 🚀 Próximos Pasos Sugeridos

1. Conectar con Supabase para persistencia real de datos
2. Implementar recuperación de contraseña
3. Agregar más campos al perfil de empresa (logo, industria, etc.)
4. Sistema de notificaciones en tiempo real
5. Exportación de reportes en PDF
6. Multi-idioma (i18n)

## 📱 Uso

1. Abrir la aplicación en el navegador
2. Probar con las credenciales de prueba proporcionadas
3. Explorar ambos dashboards (empresa y administrador)
4. Registrar una nueva empresa para ver el flujo completo

---

**Desarrollado con**: React, TypeScript, Tailwind CSS, Recharts, Motion, Lucide Icons
