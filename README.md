# Navabox · web

Web de **Navabox**, empresa simulada de regalos corporativos con productos de Navarra
(proyecto educativo). Está publicada con **GitHub Pages** desde este repositorio:
cada cambio que se guarde aquí se publica solo en 1–2 minutos.

---

## Cómo editar la web (sin instalar nada)

1. Entra en este repositorio en github.com con la cuenta de la empresa.
2. Haz clic en el archivo que quieras cambiar (ver tabla abajo).
3. Pulsa el **lápiz ✏️** (arriba a la derecha del archivo).
4. Cambia el texto. Usa **Ctrl + F** para encontrar rápido lo que buscas.
5. Pulsa **Commit changes…** → escribe qué has cambiado (ej.: "Precio Lote Premium") → **Commit changes**.
6. Espera 1–2 minutos y recarga la web con **Ctrl + F5**.

> Si algo se rompe: pestaña **Commits** → abre el cambio anterior → botón **Revert**,
> o vuelve a editar el archivo y deja el texto como estaba. GitHub guarda todo el historial.

---

## Qué hay en cada archivo

| Quiero cambiar… | Archivo | Qué buscar con Ctrl + F |
|---|---|---|
| Textos de la web (titulares, párrafos, botones) | `index.html` | el texto que ves en la web |
| **Precio o contenido de un lote** | `index.html` **y** `js/navarrito.js` | el nombre del lote, p. ej. `Lote Premium` |
| Respuestas del chatbot Navarrito | `js/navarrito.js` | la frase que quieres cambiar |
| Correo de contacto | `index.html`, `js/main.js` y `js/navarrito.js` | `pedidos.navabox@gmail.com` |
| Colores, tamaños, espacios | `css/styles.css` | (mejor no tocar si no se sabe CSS) |
| Datos legales (NIF, dirección…) | `index.html` | `Aviso legal` o `B31000003` |

⚠️ **Los precios y el contenido de los lotes están en DOS sitios**: en `index.html`
(lo que se ve en la pantalla Lotes y en el formulario) y en `js/navarrito.js`
(lo que responde el chatbot, bloque `LOTES` al principio). Cámbialos en los dos.

---

## Cambiar una foto

1. Prepara la foto nueva con **el mismo nombre** que la que quieres sustituir
   (por ejemplo `premium.png`).
2. Entra en la carpeta donde está (`img/lotes/`, `img/fotos/`…).
3. **Add file → Upload files** → arrastra la foto → **Commit changes**.
   Al tener el mismo nombre, sustituye a la anterior.

| Carpeta | Contenido |
|---|---|
| `img/logo/` | logotipos en granate, blanco y naranja |
| `img/lotes/` | fotos de las 6 cajas (en `sin-fondo/` las mismas sin fondo blanco) |
| `img/fotos/` | portada y fotos de "¿Qué incluye?" |
| `catalogo-navabox-2026.pdf` | catálogo que se descarga desde la web |

---

## Formulario de presupuesto

Las solicitudes llegan a **pedidos.navabox@gmail.com** mediante FormSubmit.
La primera vez que se use desde una dirección nueva de la web, llega a ese correo un
mensaje de FormSubmit: hay que pulsar **Activate Form** una sola vez.

Si las solicitudes no aparecen, revisa **Spam** y **Promociones** en Gmail.
