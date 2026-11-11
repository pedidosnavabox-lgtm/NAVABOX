/* =========================================================
   NAVARRITO · asistente de Navabox (versión 2)
   - Funciona sin servidor ni coste: responde con la información de Navabox
     guardada en este archivo (lotes, precios, productos, empresa...).
   - Si no sabe algo, no se lo inventa: deriva al correo de pedidos.
   - Entiende faltas de ortografía en los nombres de los lotes, recuerda el
     último lote del que se habló y puede llevar a la pantalla correspondiente.
   - Para cambiar precios o textos, edita los bloques DATOS y RESPUESTAS.
   Uso: <script src="js/navarrito.js" data-color="#5E0A22" data-logo="img/logo/isotipo-blanco.png"></script>
   ========================================================= */
(function () {
  "use strict";
  var script = document.currentScript;
  var COLOR = (script && script.dataset.color) || "#5E0A22";
  var LOGO = (script && script.dataset.logo) || "img/logo/isotipo-blanco.png";
  var EMAIL = "pedidos.navabox@gmail.com";
  var CATALOGO = "catalogo-navabox-2026.pdf";

  /* =========================== DATOS =========================== */
  var LOTES = [
    { id: "seleccion", nombre: "Selección", precio: 59.86, items: ["Vino tinto crianza Chivite Gran Feudo", "Espárragos de Navarra Carretilla", "Pimientos del piquillo de Lodosa El Navarrico", "Corazones de alcachofa de Tudela Gvtarra"], ideal: "un detalle cuidado para muchas personas, como la plantilla o clientes" },
    { id: "coleccion", nombre: "Colección", precio: 99.44, items: ["Vino tinto crianza Chivite Gran Feudo", "Aceite de oliva virgen extra Artajo", "Espárragos de Navarra Carretilla", "Pimientos del piquillo de Lodosa El Navarrico", "Corazones de alcachofa de Tudela Gvtarra", "Cuña de queso Roncal"], ideal: "agradecer a clientes o colaboradores con un lote completo" },
    { id: "pura esencia", nombre: "Pura Esencia", precio: 130.64, items: ["Vino tinto Chivite Colección 125", "Aceite de oliva virgen extra Artajo", "Espárragos de Navarra Carretilla", "Pimientos del piquillo de Lodosa El Navarrico", "Corazones de alcachofa de Tudela Gvtarra", "Cuña de queso Roncal", "Txistorra curada Embutidos Arbizu"], ideal: "un regalo muy navarro, con vino de gama alta y txistorra" },
    { id: "premium", nombre: "Premium", precio: 150.93, items: ["Vino tinto crianza Chivite Gran Feudo", "Aceite de oliva virgen extra Artajo", "Espárragos de Navarra Carretilla", "Pimientos del piquillo de Lodosa El Navarrico", "Corazones de alcachofa de Tudela Gvtarra", "Cuña de queso Roncal", "Txistorra curada Embutidos Arbizu", "Jamón de bellota ibérico Volatín"], ideal: "clientes importantes o dirección, con jamón de bellota" },
    { id: "aniversario", nombre: "Aniversario", precio: 161.75, items: ["Vino tinto crianza Chivite Gran Feudo", "Vino tinto Pago de Cirsus (Ablitas)", "Mi-cuit de pato Martiko", "Queso Roncal curado", "Aceite de oliva virgen extra Artajo 10", "Espárragos de Navarra extra El Navarrico", "Pimientos del piquillo confitados El Navarrico", "Caja de bombones Chocolates Subiza"], ideal: "celebraciones y aniversarios, con un toque gourmet y dulce" },
    { id: "navideno", nombre: "Navideño", precio: 259.50, items: ["Vino tinto Chivite Colección 125", "Vino dulce Bodegas Ochoa Moscatel", "Pacharán navarro Zoco", "Medio de lomo Volatín", "Jamón de cebo ibérico Volatín", "Aceite de oliva virgen extra Artajo", "Espárragos extra gruesos Gvtarra", "Pimientos del piquillo de Lodosa", "Queso Roncal (pieza pequeña)", "Turrón de chocolate Chocolates Subiza"], ideal: "la cesta de Navidad más completa" }
  ];
  var ALIAS = { seleccion: ["seleccion", "selecion", "selección"], coleccion: ["coleccion", "colecion"], "pura esencia": ["pura esencia", "esencia", "puraesencia"], premium: ["premium", "premiun", "prenium"], aniversario: ["aniversario", "aniversari"], navideno: ["navideno", "navideño", "navidad", "navideña", "navidena", "cesta de navidad"] };

  var PRODUCTOS = {
    "vino": { k: ["vino", "tinto", "crianza", "chivite", "cirsus", "bodega"], info: "Vinos de Chivite (Gran Feudo Crianza y Colección 125) y Pago de Cirsus, de Ablitas." },
    "moscatel": { k: ["moscatel", "ochoa", "vino dulce"], info: "Moscatel vendimia tardía de Bodegas Ochoa, un vino dulce navarro." },
    "pacharán": { k: ["pacharan", "zoco", "licor"], info: "Pacharán navarro Zoco." },
    "aceite": { k: ["aceite", "artajo", "oliva", "aove"], info: "Aceite de oliva virgen extra Artajo y Artajo 10, elaborado en Fontellas (Navarra)." },
    "espárragos": { k: ["esparrago", "carretilla"], info: "Espárragos de Navarra de Carretilla, El Navarrico y Gvtarra (también extra gruesos)." },
    "piquillo": { k: ["piquillo", "pimiento", "navarrico"], info: "Pimientos del piquillo de Lodosa de El Navarrico, también confitados." },
    "alcachofa": { k: ["alcachofa", "gvtarra", "guetarra", "gutarra"], info: "Corazones de alcachofa de Tudela de Gvtarra." },
    "queso": { k: ["queso", "roncal"], info: "Queso Roncal de la Quesería del valle de Roncal: cuña, pieza pequeña y curado." },
    "txistorra": { k: ["txistorra", "chistorra", "arbizu"], info: "Txistorra curada de Embutidos Arbizu." },
    "jamón": { k: ["jamon", "iberico", "volatin", "lomo", "embutido", "bellota"], info: "Jamón de bellota ibérico, jamón de cebo ibérico y medio de lomo de Volatín." },
    "mi-cuit": { k: ["pato", "micuit", "mi cuit", "martiko", "foie"], info: "Mi-cuit de pato de Martiko." },
    "chocolate": { k: ["chocolate", "turron", "bombon", "subiza", "dulce"], info: "Turrón de chocolate y caja de bombones de Chocolates Subiza." }
  };

  /* ======================== UTILIDADES ======================== */
  var euro = function (n) { return n.toFixed(2).replace(".", ",") + " €"; };
  var norm = function (s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[¿?¡!.,;:()"]/g, " ").replace(/\s+/g, " ").trim(); };
  var has = function (t, words) { return words.some(function (w) { return t.indexOf(norm(w)) !== -1; }); };
  var mail = '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a>";
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var m = [], i, j;
    for (i = 0; i <= a.length; i++) m[i] = [i];
    for (j = 0; j <= b.length; j++) m[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  }
  function lotesEn(t) {
    var words = t.split(" "), found = [];
    LOTES.forEach(function (l) {
      var hit = ALIAS[l.id].some(function (al) {
        al = norm(al);
        if (t.indexOf(al) !== -1) return true;
        return al.indexOf(" ") === -1 && al.length > 5 && words.some(function (w) { return w.length > 4 && lev(w, al) <= 2; });
      });
      if (hit) found.push(l);
    });
    return found;
  }
  var byId = function (id) { return LOTES.filter(function (l) { return l.id === id; })[0]; };
  function listaLotes(arr) {
    return "<ul>" + arr.map(function (l) { return "<li><b>Lote " + l.nombre + "</b> · " + euro(l.precio) + " · " + l.items.length + " productos</li>"; }).join("") + "</ul>";
  }
  function fichaLote(l) {
    return "<b>Lote " + l.nombre + "</b> · " + euro(l.precio) + " (IVA incluido), " + l.items.length + " productos:<ul>" +
      l.items.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>Ideal para " + l.ideal + ".";
  }
  var A = {
    lotes: { label: "Ver los lotes", go: "lotes" },
    catalogo: { label: "Ver el catálogo", go: "catalogo" },
    form: { label: "Abrir el formulario", go: "presupuesto" },
    pdf: { label: "Descargar catálogo PDF", href: CATALOGO }
  };
  var pedir = function (l) { return { label: "Pedir Lote " + l.nombre, lote: l.nombre }; };

  /* ======================== RESPUESTAS ======================== */
  var memoria = { lote: null };

  function responder(raw) {
    var t = norm(raw);
    var lotes = lotesEn(t);
    if (lotes.length === 1) memoria.lote = lotes[0];

    // Saludos y cortesía
    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|ey|saludos)\b/.test(t) && t.length < 30)
      return { html: "¡Hola! Soy Navarrito 👋 Te ayudo a elegir el regalo perfecto. ¿Qué te gustaría saber?", chips: ["Ver lotes y precios", "Recomiéndame un lote", "¿Se puede personalizar?"] };
    if (/^(gracias|muchas gracias|genial|perfecto|vale|ok|estupendo)\b/.test(t) && t.length < 30)
      return { html: "¡A ti! Si te surge cualquier otra duda, aquí estoy. 😊", chips: ["Recomiéndame un lote", A.form] };
    if (has(t, ["adios", "hasta luego", "chao", "nos vemos"]))
      return { html: "¡Hasta pronto! Cuando quieras, escríbenos a " + mail + "." };
    if (has(t, ["quien eres", "que eres", "eres un robot", "eres humano", "como te llamas"]))
      return { html: "Soy <b>Navarrito</b>, el asistente de Navabox. Conozco nuestros lotes, precios, productos y productores. Para cerrar un pedido te paso con el equipo por correo.", chips: ["Ver lotes y precios", "¿Quiénes sois?"] };
    if (has(t, ["ayuda", "que puedes hacer", "que sabes", "opciones", "menu"]) && t.length < 40)
      return { html: "Puedo ayudarte con:<ul><li>Precios y contenido de cada lote</li><li>Recomendarte un lote según presupuesto u ocasión</li><li>Comparar dos lotes</li><li>Productos y productores navarros</li><li>Personalización y caja plantable</li><li>Cómo pedir presupuesto</li></ul>", chips: ["Recomiéndame un lote", "Compara Premium y Aniversario", "Ver lotes y precios"] };

    // Comparar dos lotes
    if (lotes.length >= 2 || (has(t, ["compar", "diferencia", "mejor", " o el ", " vs "]) && lotes.length === 2)) {
      var a = lotes[0], b = lotes[1];
      var soloA = a.items.filter(function (i) { return b.items.indexOf(i) === -1; });
      var soloB = b.items.filter(function (i) { return a.items.indexOf(i) === -1; });
      return { html: "<b>" + a.nombre + "</b> (" + euro(a.precio) + ", " + a.items.length + " productos) frente a <b>" + b.nombre + "</b> (" + euro(b.precio) + ", " + b.items.length + " productos).<br><br>" +
        (soloA.length ? "Solo en " + a.nombre + ":<ul>" + soloA.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" : "") +
        (soloB.length ? "Solo en " + b.nombre + ":<ul>" + soloB.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" : "") +
        "Diferencia de precio: " + euro(Math.abs(a.precio - b.precio)) + ".", chips: [pedir(a), pedir(b)] };
    }

    // Un lote concreto
    if (lotes.length === 1) {
      var l = lotes[0];
      if (has(t, ["precio", "cuesta", "cuanto vale", "cuanto es", "coste"]))
        return { html: "El <b>Lote " + l.nombre + "</b> cuesta " + euro(l.precio) + " con IVA incluido.", chips: ["¿Qué lleva?", pedir(l)] };
      return { html: fichaLote(l), chips: [pedir(l), "¿Se puede personalizar?", A.lotes] };
    }

    // Preguntas sobre "ese lote" (memoria)
    if (memoria.lote && has(t, ["que lleva", "que trae", "que incluye", "contenido", "cuanto cuesta", "precio", "ese lote", "este lote", "lo quiero", "pedirlo"])) {
      var m = memoria.lote;
      if (has(t, ["lo quiero", "pedirlo", "quiero pedir"])) return { html: "¡Perfecto! Te llevo al formulario con el <b>Lote " + m.nombre + "</b> ya seleccionado.", chips: [pedir(m)] };
      if (has(t, ["cuanto cuesta", "precio"])) return { html: "El <b>Lote " + m.nombre + "</b> cuesta " + euro(m.precio) + " (IVA incluido).", chips: [pedir(m), "Ver lotes y precios"] };
      return { html: fichaLote(m), chips: [pedir(m)] };
    }

    // Recomendación por ocasión o destinatario
    if (has(t, ["recomienda", "recomiendame", "aconseja", "cual me", "que lote", "cual elijo", "no se cual", "ayudame a elegir", "sugerencia"]))
      return { html: "¡Claro! ¿Para qué ocasión o para quién es el regalo?", chips: ["Para la plantilla", "Para clientes importantes", "Para Navidad", "Para un aniversario", "Tengo un presupuesto"] };
    if (has(t, ["navidad", "navideno", "fin de ano", "cesta"])) return rec(["navideno", "premium"], "Para Navidad");
    if (has(t, ["aniversario", "celebra", "jubilacion", "evento", "inauguracion"])) return rec(["aniversario", "premium"], "Para celebrar");
    if (has(t, ["plantilla", "empleado", "trabajador", "equipo", "personal", "muchas personas", "muchos"])) return rec(["seleccion", "coleccion"], "Para la plantilla, con muchas unidades");
    if (has(t, ["cliente importante", "clientes importantes", "directivo", "direccion", "vip", "especial", "jefe", "socios"])) return rec(["premium", "aniversario"], "Para clientes importantes o dirección");
    if (has(t, ["cliente", "colaborador", "proveedor", "agradec"])) return rec(["coleccion", "pura esencia"], "Para agradecer a clientes o colaboradores");

    // Presupuesto con cifras
    var rango = t.match(/entre\s*(\d+[.,]?\d*)\s*(?:€|euros?)?\s*y\s*(\d+[.,]?\d*)/);
    if (rango) {
      var lo = parseFloat(rango[1].replace(",", ".")), hi = parseFloat(rango[2].replace(",", "."));
      var en = LOTES.filter(function (x) { return x.precio >= lo && x.precio <= hi; });
      return en.length ? { html: "Entre " + euro(lo) + " y " + euro(hi) + " tienes:" + listaLotes(en), chips: en.slice(0, 3).map(pedir) }
        : { html: "No hay lotes cerrados en ese rango, pero preparamos uno a medida para tu presupuesto.", chips: [A.catalogo, A.form] };
    }
    var mas = t.match(/(mas de|desde|a partir de|minimo|por encima de)\s*(\d+[.,]?\d*)/);
    if (mas) {
      var min = parseFloat(mas[2].replace(",", "."));
      var sup = LOTES.filter(function (x) { return x.precio >= min; });
      if (sup.length) return { html: "Por encima de " + euro(min) + " tienes:" + listaLotes(sup) + "También podemos preparar uno a medida.", chips: sup.slice(0, 3).map(pedir) };
    }
    var num = t.match(/(\d+[.,]?\d*)\s*(€|euros?|eur|pavos)?/);
    if (num && (num[2] || has(t, ["presupuesto", "hasta", "maximo", "menos de", "por persona", "por unidad", "gastar", "tengo"]))) {
      var max = parseFloat(num[1].replace(",", "."));
      if (max >= 20) {
        var ok = LOTES.filter(function (x) { return x.precio <= max; });
        if (ok.length) return { html: "Con hasta " + euro(max) + " por regalo encajan:" + listaLotes(ok) + "Mi recomendación: el <b>Lote " + ok[ok.length - 1].nombre + "</b>, que es el más completo dentro de tu presupuesto.", chips: [pedir(ok[ok.length - 1]), "Ver lotes y precios"] };
        return { html: "Nuestro lote de partida es el <b>Selección</b> (" + euro(LOTES[0].precio) + "). Para presupuestos menores, escríbenos y vemos qué se puede preparar a medida.", chips: [pedir(LOTES[0]), A.form] };
      }
    }
    if (has(t, ["presupuesto"]) && has(t, ["tengo", "cuanto", "mi presupuesto", "segun"]))
      return { html: "¿Cuánto quieres gastar por regalo? Escribe una cifra, por ejemplo «100 €», o un rango como «entre 100 y 200 €».", chips: ["Hasta 60 €", "Hasta 100 €", "Hasta 160 €", "Más de 200 €"] };

    // Extremos y cantidades
    if (has(t, ["mas barato", "economico", "menos cuesta", "mas asequible"])) return { html: fichaLote(LOTES[0]), chips: [pedir(LOTES[0])] };
    if (has(t, ["mas caro", "mas completo", "mas grande", "el mejor", "top", "mas productos"])) return { html: fichaLote(byId("navideno")), chips: [pedir(byId("navideno"))] };
    if (has(t, ["cuantos lotes", "cuantas opciones"])) return { html: "Tenemos <b>6 lotes de lanzamiento</b>, de 59,86 € a 259,50 €, y además lotes a medida con el catálogo.", chips: ["Ver lotes y precios"] };

    // Necesidades especiales
    if (has(t, ["sin alcohol", "no bebe", "abstemio", "embarazada", "menor", "ninos", "musulman", "halal"]))
      return { html: "Todos los lotes de lanzamiento llevan vino, pero podemos preparar un <b>lote a medida sin alcohol</b> con conservas, aceite, queso, embutidos y chocolate.", chips: [A.catalogo, A.form] };
    if (has(t, ["vegetariano", "sin carne", "vegano"]))
      return { html: "Los lotes <b>Selección</b> y <b>Colección</b> no llevan carne ni embutidos. Si necesitas un lote vegano, lo preparamos a medida y te confirmamos cada producto.", chips: [pedir(byId("seleccion")), pedir(byId("coleccion")), A.form] };
    if (has(t, ["alergen", "alergia", "gluten", "celiac", "lactosa", "intoleran", "frutos secos"]))
      return { html: "Para alérgenos e intolerancias prefiero no darte un dato equivocado: escríbenos a " + mail + " y te confirmamos la composición de cada producto o te preparamos un lote adaptado.", chips: [A.form] };

    // Personalización
    if (has(t, ["personaliz", "a medida", "logo", "logotipo", "marca", "mi empresa", "cambiar", "adaptar", "combinar", "elegir productos", "propio lote", "tarjeta", "dedicatoria", "mensaje"]))
      return { html: "Sí. Cada empresa tiene necesidades, presupuestos y objetivos diferentes, así que adaptamos el contenido y la presentación a tu empresa. También puedes elegir productos del catálogo y crear un lote único.", chips: [A.catalogo, A.form] };

    // Caja / sostenibilidad
    if (has(t, ["caja", "envase", "plantar", "planta", "bloompack", "sostenib", "ecolog", "biodegrad", "reciclar", "medio ambiente", "verde"]))
      return { html: "Nuestras cajas son <b>biodegradables, de Bloompack, y se pueden plantar</b>: cuando el regalo se acaba, el envase vuelve a la tierra. 🌱", chips: ["Ver lotes y precios", "¿Se puede personalizar?"] };

    // Denominación de origen / calidad
    if (has(t, ["denominacion", "d o", "calidad", "sello", "artesan"]))
      return { html: "Seleccionamos cuidadosamente los productos y revisamos cada propuesta antes de entregarla. Incluimos vinos y conservas con <b>denominación de origen</b>, como el piquillo de Lodosa o la alcachofa de Tudela.", chips: [A.catalogo] };

    // Producto concreto
    var prodKey = Object.keys(PRODUCTOS).filter(function (k) { return has(t, PRODUCTOS[k].k); })[0];
    if (prodKey) {
      var P = PRODUCTOS[prodKey];
      var con = LOTES.filter(function (x) { return has(norm(x.items.join(" ")), P.k); });
      return { html: P.info + (con.length ? "<br>Lo encontrarás en:" + listaLotes(con) : "<br>Lo puedes añadir a un lote a medida."), chips: con.slice(0, 2).map(pedir).concat([A.catalogo]) };
    }

    // Empresa
    if (has(t, ["quienes sois", "quien sois", "que es navabox", "que haceis", "a que os dedicais", "empresa", "sobre vosotros"]))
      return { html: "Navabox se dedica a los <b>regalos corporativos personalizados</b> elaborados con productos locales de Navarra. Ayudamos a empresas y Administraciones Públicas a sorprender, agradecer y fidelizar a clientes, empleados y colaboradores.", chips: ["Vuestra misión", "Vuestros valores", "Ver lotes y precios"] };
    if (has(t, ["mision", "objetivo", "proposito"]))
      return { html: "Nuestra misión es <b>acercar los productos navarros al mundo empresarial</b> con regalos originales y personalizados, poniendo en valor el talento, la calidad y la tradición de los productores locales.", chips: ["Vuestros valores"] };
    if (has(t, ["vision", "futuro"]))
      return { html: "Queremos convertirnos en una empresa <b>referente en Navarra</b> en regalos corporativos personalizados, conectando a empresas y Administraciones Públicas con los productores locales." };
    if (has(t, ["valores", "valor"]))
      return { html: "Nuestros valores:<ul><li><b>Personalización:</b> propuestas adaptadas a cada empresa.</li><li><b>Compromiso:</b> con los productores, artesanos y empresas de Navarra.</li><li><b>Calidad:</b> seleccionamos los productos y revisamos cada propuesta antes de entregarla.</li></ul>" };
    if (has(t, ["administracion", "ayuntamiento", "publica", "gobierno", "institucion"]))
      return { html: "Sí, trabajamos con <b>empresas y Administraciones Públicas</b>. Cuéntanos qué necesitas y te enviamos una propuesta.", chips: [A.form] };
    if (has(t, ["donde estais", "ubicacion", "direccion", "donde", "tienda", "recoger"]))
      return { html: "Estamos en <b>Navarra, España</b>. Para pedidos y recogidas, escríbenos a " + mail + " y lo concretamos.", chips: [A.form] };

    // Catálogo / productores
    if (has(t, ["catalogo", "producto", "productor", "marcas", "que venden", "que teneis", "proveedor", "navarr", "pdf", "folleto"]))
      return { html: "Trabajamos con <b>13 productores navarros</b>:<ul><li><b>Vinos y licores:</b> Chivite, Bodegas Ochoa, Pago de Cirsus, Pacharán Zoco</li><li><b>Conservas:</b> Carretilla, El Navarrico, Gvtarra</li><li><b>Aceite:</b> Artajo</li><li><b>Embutidos:</b> Arbizu, Volatín, Martiko</li><li><b>Queso:</b> Quesería del valle de Roncal</li><li><b>Dulces:</b> Chocolates Subiza</li></ul>", chips: [A.catalogo, A.pdf] };

    // Lista de lotes / precios
    if (has(t, ["lote", "precio", "cuesta", "cuanto vale", "tarifa", "barato", "caro", "regalo"]))
      return { html: "Tenemos 6 lotes de lanzamiento, todos con IVA incluido:" + listaLotes(LOTES) + "Pregúntame por cualquiera para ver qué lleva.", chips: ["Recomiéndame un lote", "Lote Premium", A.lotes] };

    // IVA
    if (has(t, ["iva", "impuesto"])) return { html: "Sí, todos los precios de los lotes incluyen IVA.", chips: ["Ver lotes y precios"] };

    // Contacto / pedido
    if (has(t, ["contact", "correo", "email", "mail", "pedir", "pedido", "comprar", "encargar", "presupuesto", "hablar", "telefono", "llamar", "whatsapp"]))
      return { html: "Puedes rellenar el formulario de la web o escribirnos a " + mail + " indicando para quién es el regalo, cuántas unidades necesitas, tu presupuesto aproximado y la fecha de entrega.", chips: [A.form] };

    // Datos no publicados: no inventar
    if (has(t, ["envio", "entrega", "plazo", "cuando llega", "dias", "minimo", "unidades", "pago", "factura", "descuento", "tarjeta", "domicilio", "transporte", "urgente", "devolucion", "horario"]))
      return { html: "Ese detalle depende de cada pedido y prefiero no darte un dato equivocado. Escríbenos a " + mail + " y te lo confirmamos.", chips: [A.form, "Ver lotes y precios"] };

    return { html: "No estoy seguro de haberte entendido 🤔. Puedo ayudarte con los lotes, los precios, recomendaciones, productos, personalización o la caja plantable. Para cualquier otra duda, escribe a " + mail + ".", chips: ["Ver lotes y precios", "Recomiéndame un lote", "¿Se puede personalizar?", A.form] };
  }

  function rec(ids, titulo) {
    var ls = ids.map(byId);
    memoria.lote = ls[0];
    return { html: titulo + " te recomiendo:<ul>" + ls.map(function (l) { return "<li><b>Lote " + l.nombre + "</b> · " + euro(l.precio) + ": ideal para " + l.ideal + ".</li>"; }).join("") + "</ul>", chips: ls.map(pedir).concat(["Compara " + ls[0].nombre + " y " + ls[1].nombre]) };
  }

  /* ========================= ESTILOS ========================= */
  var css = "" +
    /* Botón: solo el círculo; el texto se despliega hacia la izquierda al pasar el ratón */
    ".nv-btn{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;flex-direction:row-reverse;align-items:center;padding:6px;border:0;border-radius:999px;background:" + COLOR + ";color:#fff;font:600 .95rem/1 Raleway,system-ui,sans-serif;cursor:pointer;box-shadow:0 12px 30px -10px rgba(0,0,0,.5),0 0 0 3px rgba(242,147,22,.0);transition:box-shadow .25s,transform .25s}" +
    ".nv-btn:hover,.nv-btn:focus-visible{box-shadow:0 14px 34px -10px rgba(0,0,0,.55),0 0 0 3px rgba(242,147,22,.9)}" +
    ".nv-btn:focus-visible{outline:none}" +
    ".nv-ava{width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.14);display:grid;place-items:center;flex:none}.nv-ava img{width:28px;height:28px;object-fit:contain}" +
    ".nv-txt{max-width:0;opacity:0;overflow:hidden;white-space:nowrap;transition:max-width .35s cubic-bezier(.2,.8,.2,1),opacity .2s,padding .35s;padding:0}" +
    ".nv-btn:hover .nv-txt,.nv-btn:focus-visible .nv-txt{max-width:260px;opacity:1;padding:0 12px 0 16px}" +
    ".nv-btn[aria-expanded=true] .nv-txt{max-width:0;opacity:0;padding:0}" +
    ".nv-dot{position:absolute;top:4px;right:4px;width:12px;height:12px;border-radius:50%;background:#F29316;box-shadow:0 0 0 2px " + COLOR + "}" +
    ".nv-btn[aria-expanded=true] .nv-dot,.nv-seen .nv-dot{display:none}" +
    /* Panel */
    ".nv-panel{position:fixed;right:20px;bottom:88px;z-index:9999;width:min(390px,calc(100vw - 32px));height:min(580px,calc(100svh - 120px));display:flex;flex-direction:column;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 30px 70px -20px rgba(40,10,20,.55);font:400 .95rem/1.5 Raleway,system-ui,sans-serif;color:#2E1A20;transform-origin:bottom right;transition:transform .22s cubic-bezier(.2,.8,.2,1),opacity .2s,visibility .2s}" +
    ".nv-panel[hidden]{display:flex;transform:scale(.92) translateY(10px);opacity:0;pointer-events:none;visibility:hidden}" +
    ".nv-head{display:flex;align-items:center;gap:12px;padding:12px 12px 12px 14px;background:" + COLOR + ";color:#fff}" +
    ".nv-head .nv-ava{width:40px;height:40px}.nv-head .nv-ava img{width:24px;height:24px}" +
    ".nv-head b{display:block;font-size:1.05rem}.nv-head span{font-size:.8rem;opacity:.85;display:flex;align-items:center;gap:6px}" +
    ".nv-head span::before{content:'';width:7px;height:7px;border-radius:50%;background:#A3B18A}" +
    ".nv-hbtn{width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:1.2rem;line-height:1;cursor:pointer;display:grid;place-items:center}.nv-hbtn:hover{background:rgba(255,255,255,.28)}" +
    ".nv-head .nv-hbtn:first-of-type{margin-left:auto}" +
    ".nv-log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#FBF6F2}" +
    ".nv-msg{max-width:88%;padding:10px 14px;border-radius:16px;animation:nvIn .25s ease both}" +
    ".nv-msg ul{margin:6px 0;padding-left:18px}.nv-msg li{margin:2px 0}.nv-msg a{color:#9F1139;font-weight:600}" +
    ".nv-bot{background:#fff;border:1px solid rgba(159,17,57,.12);border-bottom-left-radius:4px;align-self:flex-start}" +
    ".nv-user{background:" + COLOR + ";color:#fff;border-bottom-right-radius:4px;align-self:flex-end}" +
    ".nv-chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:100%}" +
    ".nv-chips button{border:1.5px solid #9F1139;background:#fff;color:#9F1139;border-radius:999px;padding:7px 12px;font:600 .82rem/1.2 Raleway,system-ui,sans-serif;cursor:pointer;text-align:left}" +
    ".nv-chips button:hover{background:#9F1139;color:#fff}" +
    ".nv-chips button.nv-go{background:#F29316;border-color:#F29316;color:#5E0A22}.nv-chips button.nv-go:hover{background:#F7A940}" +
    ".nv-typing{display:inline-flex;gap:4px}.nv-typing i{width:6px;height:6px;border-radius:50%;background:#B8A3A9;animation:nvDot 1s infinite}.nv-typing i:nth-child(2){animation-delay:.15s}.nv-typing i:nth-child(3){animation-delay:.3s}" +
    ".nv-form{display:flex;gap:8px;padding:12px;border-top:1px solid #EFE4DD;background:#fff}" +
    ".nv-form input{flex:1;min-width:0;border:1.5px solid #E6D6CC;border-radius:12px;padding:11px 12px;font:400 .95rem Raleway,system-ui,sans-serif}.nv-form input:focus{outline:none;border-color:#9F1139}" +
    ".nv-form button{border:0;border-radius:12px;background:" + COLOR + ";color:#fff;font:600 .9rem Raleway,system-ui,sans-serif;padding:0 16px;cursor:pointer}" +
    "@keyframes nvIn{from{opacity:0;transform:translateY(6px)}}@keyframes nvDot{50%{opacity:.3}}" +
    "@media (max-width:520px){.nv-panel{right:12px;left:12px;width:auto;bottom:84px;height:min(560px,calc(100svh - 110px))}.nv-btn{right:14px;bottom:14px}}" +
    "@media (hover:none){.nv-btn:hover .nv-txt{max-width:0;opacity:0;padding:0}}" +
    "@media (prefers-reduced-motion:reduce){.nv-panel,.nv-msg,.nv-btn,.nv-txt{transition:none;animation:none}}";
  var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  /* ========================= INTERFAZ ========================= */
  var btn = document.createElement("button");
  btn.className = "nv-btn"; btn.type = "button";
  btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "nv-panel");
  btn.setAttribute("aria-label", "¿Dudas? Pregunta a Navarrito");
  btn.innerHTML = '<span class="nv-ava"><img src="' + LOGO + '" alt=""></span><span class="nv-txt" aria-hidden="true">¿Dudas? Pregunta a Navarrito</span><span class="nv-dot" aria-hidden="true"></span>';

  var panel = document.createElement("section");
  panel.className = "nv-panel"; panel.id = "nv-panel"; panel.hidden = true;
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Chat con Navarrito");
  panel.innerHTML =
    '<div class="nv-head"><span class="nv-ava"><img src="' + LOGO + '" alt=""></span><div><b>Navarrito</b><span>Asistente de Navabox</span></div>' +
    '<button class="nv-hbtn nv-reset" type="button" aria-label="Empezar de nuevo" title="Empezar de nuevo">↺</button>' +
    '<button class="nv-hbtn nv-close" type="button" aria-label="Cerrar el chat">×</button></div>' +
    '<div class="nv-log" role="log" aria-live="polite"></div>' +
    '<form class="nv-form"><input type="text" placeholder="Escribe tu pregunta…" aria-label="Tu pregunta" autocomplete="off" maxlength="300"><button type="submit">Enviar</button></form>';
  document.body.appendChild(panel); document.body.appendChild(btn);

  var log = panel.querySelector(".nv-log"), form = panel.querySelector(".nv-form"), input = form.querySelector("input");
  var started = false;

  function add(html, who) {
    var d = document.createElement("div"); d.className = "nv-msg " + (who === "user" ? "nv-user" : "nv-bot");
    if (who === "user") d.textContent = html; else d.innerHTML = html;
    log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
  }
  function act(c) {
    if (c.lote) {
      var target = document.querySelector('[data-lote="' + c.lote + '"]');
      if (target) target.click(); else go("presupuesto");
      add("Te he llevado al formulario con el <b>Lote " + c.lote + "</b> seleccionado. Solo te falta completar tus datos.", "bot");
      return;
    }
    if (c.go) { go(c.go); add("¡Listo! Te he llevado a <b>" + c.label.replace(/^(Ver el |Ver los |Abrir el )/, "") + "</b>.", "bot"); return; }
    if (c.href) { window.open(c.href, "_self"); }
  }
  function go(id) {
    if (window.NAVABOX_show) window.NAVABOX_show(id); else location.hash = id;
  }
  function chips(list) {
    var old = log.querySelector(".nv-chips"); if (old) old.remove();
    if (!list || !list.length) return;
    var c = document.createElement("div"); c.className = "nv-chips";
    list.forEach(function (it) {
      var b = document.createElement("button"); b.type = "button";
      if (typeof it === "string") { b.textContent = it; b.onclick = function () { ask(it); }; }
      else { b.textContent = it.label; b.className = "nv-go"; b.onclick = function () { c.remove(); act(it); }; }
      c.appendChild(b);
    });
    log.appendChild(c); log.scrollTop = log.scrollHeight;
  }
  function reply(r) {
    var typing = add('<span class="nv-typing" aria-label="Navarrito está escribiendo"><i></i><i></i><i></i></span>', "bot");
    setTimeout(function () { typing.remove(); add(r.html, "bot"); chips(r.chips); }, 420);
  }
  function ask(text) {
    text = (text || "").trim(); if (!text) return;
    var old = log.querySelector(".nv-chips"); if (old) old.remove();
    add(text, "user"); reply(responder(text));
  }
  function bienvenida() {
    reply({ html: "¡Hola! Soy <b>Navarrito</b>, el asistente de Navabox. Pregúntame por lotes, precios, productos, personalización o la caja plantable. También te recomiendo un lote según tu presupuesto.", chips: ["Ver lotes y precios", "Recomiéndame un lote", "Tengo un presupuesto", "¿Se puede personalizar?"] });
  }
  function open(state) {
    panel.hidden = !state; btn.setAttribute("aria-expanded", String(state));
    btn.setAttribute("aria-label", state ? "Cerrar el chat con Navarrito" : "¿Dudas? Pregunta a Navarrito");
    if (state) {
      btn.classList.add("nv-seen");
      if (!started) { started = true; bienvenida(); }
      setTimeout(function () { input.focus(); }, 60);
    } else btn.focus();
  }
  btn.addEventListener("click", function () { open(panel.hidden); });
  panel.querySelector(".nv-close").addEventListener("click", function () { open(false); });
  panel.querySelector(".nv-reset").addEventListener("click", function () { log.innerHTML = ""; memoria.lote = null; bienvenida(); input.focus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) open(false); });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); input.value = ""; });
})();
