# 🚀 Manual de Despliegue en Servidor Propio (Hostinger)
## Portal Web del Aula ATECA (Aula 19) • IES Agustín de Betancourt

---

## 1. Arquitectura y Compatibilidad Técnica
El portal interactivo del Aula ATECA ha sido diseñado como una **aplicación web estática cliente (Single Page Application - SPA)** de alto rendimiento, compilada con Vite y React 19.

### Ventajas para el Hosting del Centro:
- **Cero procesos en segundo plano**: No requiere Node.js, Express, PM2 ni bases de datos activas en el servidor.
- **Máxima velocidad de carga**: Se sirve como archivos planos HTML, CSS, JavaScript e imágenes optimizadas.
- **Compatibilidad 100% con LiteSpeed / Apache**: El archivo `.htaccess` incluido en la carpeta `dist/` gestiona el enrutamiento y la caché del navegador de forma automática.

---

## 2. Parámetros de la Infraestructura Existente

| Parámetro | Valor de Configuración |
| :--- | :--- |
| **Proveedor de Hosting** | Hostinger |
| **Dirección IP del Servidor** | `109.106.243.32` |
| **Puerto SSH** | `65002` |
| **Usuario del Sistema** | `u220313307` |
| **Servidor Web** | LiteSpeed / Apache con `mod_rewrite` |
| **Certificado de Seguridad** | SSL Let's Encrypt / TLS v1.3 activo |
| **Aplicativo Existente (Reservas)** | `https://ateca.fpapps.es` (Ruta: `domains/fpapps.es/public_html/ateca/`) |

---

## 3. Opciones de Publicación en el Servidor

### Opción A: Despliegue en Subdirectorio de `fpapps.es` (Recomendada de Inmediato)
Se aloja dentro del dominio activo `fpapps.es` en la carpeta `portal` (por ejemplo: `https://ateca.fpapps.es/portal` o `https://fpapps.es/ateca/`):
- **Ruta en el servidor**: `domains/fpapps.es/public_html/ateca/portal/` (o la que decida el administrador).
- **Ventaja**: El certificado SSL y el dominio ya están operativos y no requieren tocar DNS ni esperar propagación.

### Opción B: Despliegue en Subdominio dedicado (`portal-ateca.fpapps.es` o `ateca.josedepedias.net`)
Si se desea utilizar el subdominio `ateca.josedepedias.net` (mencionado en la plantilla):
1. Acceder al panel de Hostinger / cPanel del dominio `josedepedias.net`.
2. En la sección **Zona DNS**, crear un registro tipo `A` o `CNAME`:
   - Nombre: `ateca`
   - Tipo: `A`
   - Apunta a: `109.106.243.32` (o IP del hosting)
   - TTL: `14400`
3. Crear el subdominio en la sección **Subdominios** de Hostinger apuntando a su carpeta pública.
4. Activar el certificado SSL gratuito en el panel.

---

## 4. Procedimiento de Despliegue Paso a Paso

### Método 1: Despliegue Automatizado por Terminal (SSH / SCP)
Desde la carpeta del proyecto en Antigravity (`/home/antigravity/portal-aula-ateca`):

```bash
# 1. Compilar los archivos estáticos de producción
npm run build

# 2. Subir los archivos generados en dist/ a la carpeta de destino en el servidor
# (Ejemplo para desplegar en domains/fpapps.es/public_html/ateca-portal/)
scp -P 65002 -r dist/* dist/.htaccess u220313307@109.106.243.32:domains/fpapps.es/public_html/ateca-portal/

# 3. Asignar los permisos estándar de lectura en el servidor
ssh -p 65002 u220313307@109.106.243.32 "chmod -R 755 domains/fpapps.es/public_html/ateca-portal && find domains/fpapps.es/public_html/ateca-portal -type f -exec chmod 644 {} \;"
```

---

### Método 2: Despliegue Manual mediante el Administrador de Archivos Web
Si prefieres no utilizar la terminal SSH:

1. Genera el paquete comprimido de la carpeta `dist/`:
   ```bash
   cd /home/antigravity/portal-aula-ateca/dist
   zip -r /home/antigravity/portal_ateca_dist.zip . .htaccess
   ```
2. Entra en el panel de control de Hostinger > **Administrador de Archivos** (File Manager).
3. Navega hasta la carpeta web deseada.
4. Sube el archivo `portal_ateca_dist.zip`.
5. Haz clic derecho y selecciona **Extraer aquí** (Extract).
6. Verifica que el archivo `.htaccess` esté presente en la raíz de la carpeta (en Hostinger, activa la opción "Mostrar archivos ocultos").

---

## 5. Verificación Posterior al Despliegue
Tras subir los archivos, comprueba en tu navegador:
1. Abre la URL en modo incógnito.
2. Comprueba que las imágenes institucionales (`Logo.png`, `Placa_PDF.png`, `images.png`) se visualicen correctamente.
3. Prueba la navegación y los filtros combinados del catálogo.
4. Haz clic en el botón «Reservar Aula» y comprueba que redirige a `https://ateca.fpapps.es`.
5. Recarga una página interna (F5) para verificar que el `.htaccess` redirige correctamente al `index.html` sin dar error 404.
