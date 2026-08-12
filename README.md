# MEDICAMENTOS JULIO

Una aplicación web **premium** que permite a tu papá (y a cualquier persona) llevar un registro de sus medicamentos y recibir recordatorios para:

- Tomar cada medicamento en el horario establecido.
- Realizar ejercicios de cuerpo.
- Practicar la meditación "om".

## Características principales

- **Diseño moderno** con glassmorphism, degradado teal‑gris y soporte de modo oscuro.
- **Lista de medicamentos en español** con casillas de verificación que persisten usando `localStorage`.
- **Notificaciones del navegador** (requiere permiso) programadas con `setInterval`.
- **PWA** (Progressive Web App) – se puede instalar en el móvil o escritorio y funciona sin conexión después de la primera carga.
- **Iconos personalizados** generados para la PWA.

## Estructura del proyecto

```
medicamentos_julio/
│   index.html
│   styles.css
│   app.js
│   manifest.json
│   service-worker.js
│
├─ icons/
│   ├─ icon-192.png   (icono 192×192)
│   └─ icon-512.png   (icono 512×512)
└─ images/ (opcional, para futuros assets)
```

## Cómo ejecutar la aplicación (local)

1. **Abrir directamente el archivo** `index.html` en el navegador (Chrome, Edge, Firefox). 
   - La primera apertura descargará los assets y el Service Worker se registrará.
2. **Para probar el modo offline**:
   - Después de la primera carga, desconecta la conexión a internet y recarga la página; la UI seguirá funcionando.
3. **Si deseas servirla con un servidor HTTP simple** (recomendado para probar notificaciones):
   - Con Python (incluido en la mayoría de los sistemas):
     ```bash
     cd medicamentos_julio
     python -m http.server 8000
     ```
     Luego abre `http://localhost:8000` en el navegador.
   - Con Node.js (si lo tienes):
     ```bash
     npx -y serve .
     ```
4. **Permitir notificaciones** cuando el navegador lo solicite. Cada medicamento disparará una notificación en su frecuencia (12 h o 24 h). Los botones de ejercicio y "om" también generan notificaciones al pulsarlos.

## Personalización futura

- Añadir pantalla de edición para gestionar la lista de medicamentos.
- Sincronizar datos con un backend ligero (por ejemplo Firebase) para que la lista se comparta entre dispositivos.
- Configurar recordatorios automáticos que funcionen incluso con la página cerrada usando **Push API**.

---
### Capturas de pantalla

![Icono 192 px](file:///C:/Users/santa/.gemini/antigravity/brain/664e32ee-4822-41ca-b2c1-6fcaa360c34d/icon_192_1786500983692.jpg)
![Icono 512 px](file:///C:/Users/santa/.gemini/antigravity/brain/664e32ee-4822-41ca-b2c1-6fcaa360c34d/icon_512_1786500992269.jpg)

> **Nota:** Copia estos archivos dentro de `medicamentos_julio/icons/` y renómbralos a `icon-192.png` y `icon-512.png` respectivamente para que la PWA los utilice correctamente.
