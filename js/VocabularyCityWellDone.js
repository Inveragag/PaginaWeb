/**
 * VocabularyCityWellDone.js
 * ─────────────────────────────────────────────────────────────
 * Lee el JSON de configuración y aplica los colores como
 * variables CSS en :root usando setProperty().
 *
 * El JSON debe tener una sección "colores" con la siguiente
 * estructura (ver VocabularyCityWellDone.json → "colores"):
 *
 *   "colores": {
 *     "base": { colores sólidos principales },
 *     "tints": { variantes con opacidad para cada color base }
 *   }
 *
 * Uso: incluir este script en el HTML ANTES de cargarConfiguracion()
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Aplica los colores del JSON como variables CSS en :root.
 * Se llama desde aplicarConfiguracion() en el HTML principal.
 *
 * @param {Object} colores - Objeto CONFIG.colores del JSON
 */
function aplicarColoresCSS(colores) {
  if (!colores) return;
  const root = document.documentElement;

  // ── Colores base sólidos ──────────────────────────────────
  // Cada clave del objeto "base" se convierte en --clave: valor
  if (colores.base) {
    Object.entries(colores.base).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  // ── Tints (variantes con opacidad) ───────────────────────
  // Cada grupo en "tints" se genera automáticamente a partir
  // del color base, creando variables como --dorado-05, --error-02, etc.
  if (colores.tints) {
    Object.entries(colores.tints).forEach(([colorKey, opacidades]) => {
      // Obtener el color base correspondiente
      const baseHex = colores.base?.[colorKey];
      if (!baseHex) return;

      // Convertir hex a r,g,b
      const rgb = hexToRgb(baseHex);
      if (!rgb) return;

      // Crear una variable por cada opacidad definida
      Object.entries(opacidades).forEach(([opKey, opValue]) => {
        // opKey ej: "05" → variable --dorado-05
        const varName = `--${colorKey}-${opKey}`;
        root.style.setProperty(varName, `rgba(${rgb.r},${rgb.g},${rgb.b},${opValue})`);
      });
    });
  }

  // ── Colores especiales (sombras, overlay, chips, purple) ─
  if (colores.especiales) {
    Object.entries(colores.especiales).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  // ── Alias automáticos ────────────────────────────────────
  // --color-estrella se deriva de --acento-dorado
  if (colores.base?.['acento-dorado']) {
    root.style.setProperty('--color-estrella', colores.base['acento-dorado']);
  }
  // --color-estrella-inactiva se deriva de --borde-suave con opacidad
  if (colores.base?.['borde-suave']) {
    const rgb = hexToRgb(colores.base['borde-suave']);
    if (rgb) root.style.setProperty('--color-estrella-inactiva', `rgba(${rgb.r},${rgb.g},${rgb.b},0.5)`);
  }
}

/**
 * Convierte un color hexadecimal a sus componentes r, g, b.
 * Soporta formatos #RGB y #RRGGBB.
 *
 * @param {string} hex - Color en formato #RRGGBB o #RGB
 * @returns {{ r: number, g: number, b: number } | null}
 */
function hexToRgb(hex) {
  if (!hex || !hex.startsWith('#')) return null;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length !== 6) return null;
  const num = parseInt(h, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8)  & 255,
    b:  num        & 255
  };
}
