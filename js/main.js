/* NAVABOX · interacción de la web */
(function () {
  "use strict";

  var header = document.querySelector(".header");
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  var main = document.getElementById("contenido");

  /* ---------- Menú móvil ---------- */
  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
  });

  /* ---------- Cabecera: transparente arriba, granate al bajar ---------- */
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Pantallas ----------
     Cada <div class="view" id="..."> es una pantalla. Los enlaces #inicio, #lotes,
     #catalogo y #presupuesto cambian la pantalla sin recargar ni abrir ventanas.
     Atrás / Adelante del navegador también funcionan. */
  var views = Array.prototype.slice.call(document.querySelectorAll(".view"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"], .footer nav a'));
  var current = null;

  function show(id, focus) {
    var view = document.getElementById(id);
    if (!view || !view.classList.contains("view")) { id = "inicio"; view = document.getElementById(id); }
    if (current === id) { window.scrollTo(0, 0); return; }
    views.forEach(function (v) { v.hidden = v !== view; v.classList.remove("is-entering"); });
    if (current !== null) { void view.offsetWidth; view.classList.add("is-entering"); }
    current = id;
    document.title = view.dataset.title || document.title;
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    // El cierre "¿Buscas un regalo especial?" sobra en la propia pantalla de presupuesto
    var cierre = document.getElementById("cierre");
    if (cierre) cierre.hidden = id === "presupuesto";
    window.scrollTo(0, 0);
    onScroll();
    if (focus) {
      var h = view.querySelector("h1");
      if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    }
  }
  window.NAVABOX_show = function (id) { if (location.hash !== "#" + id) location.hash = id; else show(id, true); };

  function fromHash(focus) { show((location.hash || "#inicio").slice(1), focus); }
  window.addEventListener("hashchange", function () { fromHash(true); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (id === "contenido") { e.preventDefault(); main.focus(); return; }
    if (id && id === current) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  });
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  fromHash(false);

  /* ---------- "Pedir este lote" preselecciona el lote en el formulario ---------- */
  var selLote = document.getElementById("lote");
  var mensaje = document.getElementById("mensaje");
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lote]");
    if (!b) return;
    var lote = b.dataset.lote;
    if (lote === "a medida") selLote.value = "Lote a medida";
    else Array.prototype.forEach.call(selLote.options, function (o) { if (o.text.indexOf(lote + " ·") === 0) selLote.value = o.value || o.text; });
    if (!mensaje.value.trim()) mensaje.value = (lote === "a medida" ? "Hola, me gustaría un lote a medida con: " : "Hola, me interesa el Lote " + lote + ". Unidades aproximadas: ");
  });

  /* ---------- Formulario ----------
     Los mensajes se envían con FormSubmit (formsubmit.co) a EMAIL.
     La primera vez que se envíe desde una dirección nueva de la web (por ejemplo,
     al pasar a GitHub Pages), FormSubmit manda a EMAIL un correo de activación:
     basta con abrirlo y pulsar "Activate Form" una vez.
     Si la web se abre con doble clic (sin publicar), se usa el plan B: abrir el
     correo del usuario con la solicitud ya escrita. */
  var EMAIL = "pedidos.navabox@gmail.com";
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/" + EMAIL;

  var form = document.getElementById("form");
  var status = document.getElementById("form-status");
  var rules = {
    nombre: function (v) { return v ? "" : "Escribe tu nombre."; },
    apellidos: function (v) { return v ? "" : "Escribe tus apellidos."; },
    email: function (v) {
      if (!v) return "Escribe tu correo electrónico.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Revisa el correo: debe tener el formato nombre@empresa.com.";
    },
    mensaje: function (v) { return v ? "" : "Cuéntanos qué necesitas para poder prepararte la propuesta."; },
    acepta_privacidad: function (v, el) { return el.checked ? "" : "Para enviar la solicitud debes aceptar la política de privacidad."; },
    unidades: function (v) { return !v || (/^\d+$/.test(v) && +v >= 1) ? "" : "Indica un número entero de unidades, por ejemplo 40."; },
    fecha_entrega: function (v) { return !v || v >= hoy ? "" : "Elige una fecha a partir de hoy."; }
  };
  var errIds = { acepta_privacidad: "privacidad-ok-err", unidades: "unidades-err", fecha_entrega: "fecha-err" };

  // La fecha de entrega no puede ser anterior a hoy
  var d = new Date();
  var hoy = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  form.elements.fecha_entrega.min = hoy;

  // Junta las opciones de personalización marcadas en un solo texto
  function personalizacion() {
    return Array.prototype.filter.call(form.querySelectorAll('input[name="personalizacion"]'), function (c) { return c.checked; })
      .map(function (c) { return c.value; }).join(", ") || "Ninguna";
  }
  function fechaBonita(v) { if (!v) return "Sin indicar"; var p = v.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function check(name) {
    var input = form.elements[name];
    var msg = rules[name](input.value.trim(), input);
    var errId = errIds[name] || name + "-err";
    input.closest(".field").classList.toggle("has-error", !!msg);
    document.getElementById(errId).textContent = msg;
    if (msg) { input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", errId); }
    else input.removeAttribute("aria-invalid");
    return !msg;
  }
  Object.keys(rules).forEach(function (name) {
    var el = form.elements[name];
    if (el.type === "checkbox") { el.addEventListener("change", function () { check(name); }); return; }
    el.addEventListener("blur", function () { if (el.value) check(name); });
    el.addEventListener("input", function () { if (el.closest(".field").classList.contains("has-error")) check(name); });
  });

  // Plan B: abrir el correo del usuario con la solicitud ya escrita
  function abrirCorreo() {
    var f = form.elements;
    var body = [
      "Nombre: " + f.nombre.value.trim() + " " + f.apellidos.value.trim(),
      "Empresa: " + f.empresa.value.trim(),
      "Lote: " + (f.lote.value || "Aún no lo sé"),
      "Correo: " + f.email.value.trim(),
      "Teléfono: " + f.telefono.value.trim(),
      "Unidades: " + (f.unidades.value || "Sin indicar"),
      "Presupuesto por regalo: " + (f.presupuesto_por_regalo.value || "Sin decidir"),
      "Fecha de entrega: " + fechaBonita(f.fecha_entrega.value),
      "Localidad de entrega: " + (f.localidad_entrega.value.trim() || "Sin indicar"),
      "Personalización: " + personalizacion(),
      "",
      f.mensaje.value.trim()
    ].join("\n");
    var subject = "Solicitud de propuesta" + (f.empresa.value.trim() ? " · " + f.empresa.value.trim() : "");
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form__status"; status.textContent = "";
    var firstBad = null;
    Object.keys(rules).forEach(function (name) { if (!check(name) && !firstBad) firstBad = form.elements[name]; });
    if (firstBad) { firstBad.focus(); return; }

    // Abierto como archivo local (doble clic): FormSubmit no funciona, se usa el plan B
    if (!FORM_ENDPOINT || location.protocol === "file:") {
      abrirCorreo();
      status.textContent = "Se ha abierto tu programa de correo con la solicitud. Solo tienes que pulsar Enviar.";
      status.classList.add("is-ok");
      return;
    }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = "Enviando…";
    var data = new FormData(form);
    data.delete("personalizacion");
    data.append("personalizacion", personalizacion());
    data.set("fecha_entrega", fechaBonita(form.elements.fecha_entrega.value));
    ["unidades", "presupuesto_por_regalo", "localidad_entrega", "empresa", "telefono", "lote"].forEach(function (k) { if (!String(data.get(k) || "").trim()) data.set(k, "Sin indicar"); });
    fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok || String(res.j.success) === "false") throw new Error(res.j.message || "");
        form.reset();
        status.textContent = "¡Solicitud enviada! Te responderemos lo antes posible a tu correo.";
        status.classList.add("is-ok");
      })
      .catch(function () {
        status.innerHTML = "No se ha podido enviar desde la web. Puedes escribirnos directamente a <a href=\"mailto:" + EMAIL + "\">" + EMAIL + "</a>.";
        status.classList.add("is-warn");
      })
      .then(function () { btn.disabled = false; btn.textContent = "Solicitar propuesta"; });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
