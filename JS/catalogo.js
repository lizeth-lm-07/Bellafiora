/* ====== NAV: abrir submenu en mobile ====== */
document.addEventListener("click", (e) => {
  const ddBtn = e.target.closest(".dropdown-btn");
  if (ddBtn) {
    const dd = ddBtn.parentElement;
    dd.classList.toggle("open");
    ddBtn.setAttribute("aria-expanded", dd.classList.contains("open"));
  }
});

/* ====== DATA ====== */
const PRODUCTS = [
  { id:"r1", nombre:"Ramo Clásico de Rosas", desc:"Rosas, Alstroemerias y Follaje", precio:350, categoria:"Ramos Florales", tipo:"Rosas", etiquetas:["Clásico","Rojo"], oferta:false, img:"Imágenes/catalogo/ramoclasicodeflores.jpg" },
  { id:"g1", nombre:"Bouquet Primavera", desc:"Mezcla de Rosas, Lilis, Alstroemerias y Follaje", precio:420, categoria:"Ramos Florales", tipo:"Girasoles", etiquetas:["Mixto"], oferta:true, precioAntes:480, img:"Imágenes/catalogo/bouquetprimavera.jpg" },
  { id:"t1", nombre:"Gerberas Coloridas", desc:"Ramo colorido de Gerberas y Follaje", precio:550, categoria:"Ramos Florales", tipo:"Tulipanes", etiquetas:["Pastel"], oferta:false, img:"Imágenes/catalogo/ramosflorales3.jpg" },
  { id:"j1", nombre:"Caja Belleza Pastel", desc:" Gerberas, Rosas, Claveles y Follaje", precio:900, categoria:"Jarrones, Canastas y Cajas Florales", tipo:"Girasoles", etiquetas:["Premium"], oferta:true, precioAntes:990, img:"Imágenes/catalogo/jarrones1.jpg" },
  { id:"c1", nombre:"Jarrón Alegría", desc:" Combinación de Rosas con Claveles, Alstroemerias y Follaje ", precio:750, categoria:"Jarrones, Canastas y Cajas Florales", tipo:"Rosas", etiquetas:["Premium","Regalo"], oferta:false, img:"Imágenes/catalogo/jarrones2.jpg" },
  { id:"c2", nombre:"Canasta Floral", desc:" Combinación de Rosas, Dalias, Crisantemos, Alstroemerias y Follaje", precio:1200, categoria:"Jarrones, Canastas y Cajas Florales", tipo:"Rosas", etiquetas:["Premium","Regalo"], oferta:false, img:"Imágenes/catalogo/jarrones3.jpg" },
  { id:"s1", nombre:"Amor Clásico", desc:"Ramo de Rosas, 1 Flor extra, Chocolates y Follaje", precio:690, categoria:"San Valentín", tipo:"Rosas", etiquetas:["Romántico"], oferta:true, precioAntes:750, img:"Imágenes/catalogo/sanvalentin1.jpg" },
  { id:"s2", nombre:"Corazón de Amor", desc:"Caja o ramo con Rosas, Chocolates y Follaje", precio:820, categoria:"San Valentín", tipo:"Mixto", etiquetas:["Regalo"], oferta:false, img:"Imágenes/catalogo/sanvalentin2.jpg" },
  { id:"s3", nombre:"Amor y Chocolates", desc:" Caja o ramo con Rosas, Chocolates y Follaje", precio:760, categoria:"San Valentín", tipo:"Mixto", etiquetas:["Premium"], oferta:false, img:"Imágenes/catalogo/sanvalentin3.jpg" }
];

/* ====== ELEMENTOS ====== */
const $grid   = document.getElementById("productGrid");
const $search = document.getElementById("searchInput");
const $count  = document.getElementById("countLabel");
const tpl     = document.getElementById("tplCard");

/* ====== STATE Y SECCIONES ====== */
const state = { texto: "" };
const SECCIONES = [
  "Ramos Florales",
  "Jarrones, Canastas y Cajas Florales",
  "San Valentín"
];

/* ====== BUSCADOR ====== */
$search?.addEventListener("input", (e) => {
  state.texto = e.target.value.toLowerCase().trim();
  render();
});

/* ====== RENDER POR SECCIONES ====== */
function render(){
  $grid.setAttribute("aria-busy","true");
  $grid.innerHTML = "";

  const filtrados = state.texto
    ? PRODUCTS.filter(p => (p.nombre + " " + (p.desc||"")).toLowerCase().includes(state.texto))
    : PRODUCTS.slice();

  let totalMostrados = 0;

  SECCIONES.forEach(cat => {
    let items = filtrados.filter(p => p.categoria === cat);
    if (!state.texto) items = items.slice(0, 4); // limitar si no hay búsqueda
    if (items.length === 0) return;

    const section = document.createElement("section");
    section.className = "cat-section";
    section.id = idFromTitle(cat);

    const h2 = document.createElement("h2");
    h2.textContent = cat;
    section.appendChild(h2);

    const grid = document.createElement("div");
    grid.className = "catalogo-grid";

    items.forEach(p => grid.appendChild(buildCard(p)));

    section.appendChild(grid);
    $grid.appendChild(section);

    totalMostrados += items.length;
  });

  if (totalMostrados === 0) {
    const p = document.createElement("p");
    p.style.fontSize = "1.6rem";
    p.style.color = "#666";
    p.textContent = "No se encontraron productos.";
    $grid.appendChild(p);
  }

  if ($count) $count.textContent = `${totalMostrados} producto${totalMostrados !== 1 ? "s" : ""}`;

  $grid.setAttribute("aria-busy","false");
}

/* ====== CREA TARJETA Y CONEXIÓN AL CARRITO ====== */
function buildCard(p){
  const $card = tpl.content.cloneNode(true);
  const img = $card.querySelector(".card-img");
  img.src = p.img || "https://placehold.co/600x450?text=Flores";
  img.alt = p.nombre;

  $card.querySelector(".card-title").textContent = p.nombre;
  $card.querySelector(".card-desc").textContent  = p.desc || "";
  $card.querySelector(".card-price").textContent = `$${p.precio}.00 MXN`;

  if (p.oferta){
    $card.querySelector(".badge-oferta").hidden = false;
    if (p.precioAntes){
      const old = $card.querySelector(".card-price-old");
      old.hidden = false;
      old.textContent = `$${p.precioAntes}.00`;
    }
  }

  const $qty = $card.querySelector(".qty-input");
  $card.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = Math.max(1, parseInt($qty.value||1,10) + (btn.dataset.act==="plus" ? 1 : -1));
      $qty.value = val;
    });
  });

  // ✅ Agregar producto al carrito y sincronizar con localStorage
  $card.querySelector(".btn-add").addEventListener("click", (ev) => {
    const cantidad = parseInt($qty.value || 1, 10);
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existente = carrito.find(item => item.id === p.id);
    if(existente){
      existente.cantidad += cantidad;
    } else {
      carrito.push({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        precioOriginal: (p.precioAntes && p.oferta) ? p.precioAntes : p.precio,
        descuentoPct: (p.precioAntes && p.oferta) ? Math.round((1 - (p.precio / p.precioAntes)) * 100) : 0,
        imagen: p.img,
        cantidad
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // 🔹 LLAMADA IMPORTANTE: Actualiza el numerito del carrito
   updateCartBadge();

    // Feedback visual
    const btn = ev.currentTarget;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-plus"></i> Agregar';
      btn.disabled = false;
    }, 1200);
  });

  return $card;
}

/* ====== UTILIDADES ====== */
function idFromTitle(t){
  return t
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

/* ====== ARRANQUE ====== */
render();

// Scroll suave si entra con hash
if (location.hash) {
  const tgt = document.querySelector(location.hash);
  if (tgt) tgt.scrollIntoView({ behavior: "smooth" });
}
