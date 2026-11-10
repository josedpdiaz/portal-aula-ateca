# 🔬 Informe de Pruebas Técnicas, Limitaciones y Cuestiones Pendientes
## Portal Web Aula ATECA (Aula 19) • IES Agustín de Betancourt

---

## 1. Banco de Pruebas Ejecutadas y Resultados

| Prueba Realizada | Entorno de Prueba | Resultado | Observaciones |
| :--- | :--- | :--- | :--- |
| **Compilación Estática (Vite)** | Node.js v24.22.2 | **SUPERADA (0 errores)** | Tiempo de compilación: 348 ms. Genera paquete estático ligero en `dist/` listo para servidor web. |
| **Validación de Tipado (TypeScript)** | `tsc --noEmit` | **SUPERADA (0 errores)** | Cumplimiento estricto de tipos e interfaces para todas las entidades (`Activity`, `EquipmentGuide`, etc.). |
| **Filtros Combinados del Catálogo** | Navegador (Webkit / Chromium) | **SUPERADA** | Búsqueda por texto libre combinable simultáneamente con Ciclo Formativo, Módulo y Zona Tecnológica. |
| **Modal / Ficha Didáctica Completa** | Escritorio y Móvil | **SUPERADA** | Apertura fluida, renderizado de las 4 fases de la sesión, rúbrica, producto final y botón directo para imprimir. |
| **Guías de Puesta en Marcha (5 Min)** | Escritorio y Móvil | **SUPERADA** | Pestañas reactivas, panel "Empezar en 5 minutos" destacado, acordeón de resolución de incidencias y vista previa de código QR. |
| **Enrutamiento y Fallback SPA** | LiteSpeed / Apache | **SUPERADA** | Archivo `dist/.htaccess` configurado con reglas `mod_rewrite` y cabeceras de expiración de caché para imágenes y estilos. |
| **Accesibilidad Básica (WCAG 2.1 AA)** | Inspección DOM | **SUPERADA** | Contraste de texto certificado (> 4.5:1), navegación por teclado mediante `:focus-visible`, atributos `aria-label` y estructura semántica (`<header>`, `<main>`, `<section>`, `<footer>`). |
| **Visualización en Dispositivos Móviles** | Viewport 375px a 1440px | **SUPERADA** | Menú hamburguesa interactivo, selectores optimizados para pantallas táctiles y tipografía fluida sin desbordamientos horizontales. |

---

## 2. Enlaces Verificados

- ✅ **Sistema de Reservas Oficial:** `https://ateca.fpapps.es` (Operativo en producción con autenticación Google Workspace `@gobiernodecanarias.org`).
- ✅ **Manuales de Realidad Virtual:** `https://ateca-forma-vr1.netlify.app/` (Enlazado en la guía de gafas VR).
- ✅ **Verificación Oficial de la Resolución:** `https://sede.gobiernodecanarias.org/sede/verifica_doc?codigo_nde=0zsHq3g0fSAmeDJuXwE_CtQcVqJDNmMZF` (Código NDE verificado en la Sede Electrónica del Gobierno de Canarias).
- ✅ **Bambu Lab Wiki Oficial:** `https://wiki.bambulab.com/en/x1` (Enlazado en la guía de impresión 3D).

---

## 3. Limitaciones Actuales Identificadas

1. **Entorno de Alojamiento Estático Puro:**  
   La web no requiere bases de datos locales ni procesos de Node.js en ejecución constante. Todas las consultas y filtros se procesan instantáneamente en el navegador del usuario (Client-Side). Para añadir actividades de forma permanente, se edita el archivo `src/data/activities.json` y se reejecuta `npm run build`.

2. **Fotografías Reales del Alumnado:**  
   En estricto cumplimiento de las directrices del centro y de la normativa de protección de datos (RGPD), **no se han publicado fotografías reales del alumnado**. El espacio de experiencias incluye la estructura técnica y de registro lista para incorporar fotografías oficiales una vez que el centro cuente con las autorizaciones pertinentes.

3. **Mobiliario Físico Modular:**  
   La adecuación física, eléctrica y de red de datos Cat6 del Aula 19 está completamente finalizada, pero el mobiliario modular final se encuentra en fase de licitación por la Consejería de Educación, operándose provisionalmente con mobiliario adaptado.

---

## 4. Elementos Pendientes de Confirmación por el Usuario

1. **Estado del Dominio `ateca.josedepedias.net`:**  
   Las pruebas DNS (`dig` / `nslookup`) han confirmado que el registro para `ateca.josedepedias.net` no existe actualmente en Internet (`NXDOMAIN`). Para utilizar este subdominio, el usuario deberá crear el registro tipo `A` o `CNAME` en el panel de control de su hosting. Mientras tanto, el portal está listo para publicarse en cualquier carpeta o subdominio del servidor operativo `fpapps.es`.

2. **Aprobación de la Página de WordPress:**  
   El paquete completo para WordPress ha sido generado en la carpeta `WORDPRESS_CENTRO`. Su publicación en la web oficial del centro queda a la espera de la autorización expresa del usuario y de la coordinación con el responsable TIC.

3. **Aprobación del Despliegue en Servidor:**  
   El paquete de archivos compilados `dist/` está listo. No se realizará ninguna transferencia por SSH/SCP ni modificación en el servidor de producción hasta recibir la orden y autorización expresa del usuario.
