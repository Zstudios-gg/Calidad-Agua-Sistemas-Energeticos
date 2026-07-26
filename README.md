# Micrositio de defensa — UNACIFOR

Calidad de Agua para el Mantenimiento de Paneles Solares Fotovoltaicos.
Sitio estático (HTML/CSS/JS vanilla), sin frameworks ni build step.

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio nuevo en GitHub (público, para poder usar Pages gratis).
2. Sube todo el contenido de esta carpeta a la raíz del repositorio
   (`index.html`, `assets/`, `img/`, `docs/`, `.nojekyll`), por ejemplo:
   ```bash
   git init
   git add .
   git commit -m "Micrositio de defensa UNACIFOR"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```
3. En GitHub, entra a **Settings → Pages**.
4. En "Build and deployment", selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
5. Guarda. El sitio quedará disponible en unos minutos en:
   `https://TU-USUARIO.github.io/TU-REPO/`
6. Genera el código QR apuntando a esa URL para usarlo en la defensa oral.

## Antes de publicar — pendientes del equipo

- [ ] Reemplazar las 4 imágenes en `/img` con las fotografías reales del laboratorio
      (se dejaron placeholders con el mismo nombre de archivo que espera el sitio).
- [ ] Subir el informe final en `/docs/informe-final.pdf` (el botón de descarga
      ya apunta a esa ruta). Puedes borrar `docs/README-informe.txt` una vez lo subas.
- [ ] Confirmar con el fabricante del equipo la unidad de conductividad (mS/cm vs µS/cm)
      mencionada en la nota al pie de la tabla de resultados.

## Estructura

```
/
├── index.html
├── .nojekyll
├── assets/
│   ├── css/styles.css
│   └── js/main.js
├── img/
│   └── (4 fotografías del laboratorio)
└── docs/
    └── informe-final.pdf   ← agregar antes de publicar
```

## Notas técnicas

- Sin dependencias externas pesadas: los gráficos de barras se dibujan con
  Canvas nativo (sin Chart.js) y los reveals de scroll usan IntersectionObserver nativo.
  Solo se usa un CDN ligero para los íconos (Tabler Icons vía jsDelivr).
- Optimizado mobile-first / Safari iOS: `dvh` en vez de `vh`, `env(safe-area-inset-*)`,
  controles con área táctil ≥ 44×44px, `touch-action: manipulation`, PDF con
  `target="_blank"`.
- Probado visualmente en un viewport de 375px de ancho (iPhone SE).
