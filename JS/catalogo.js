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
  // Ramos Florales
  { id:"r1", nombre:"Ramo Clásico de Rosas", desc:"12 rosas rojas con follaje y moño de seda", precio:350, categoria:"Ramos Florales", tipo:"Rosas", etiquetas:["Clásico","Rojo"], oferta:false, img:"Imágenes/catalogo/ramoclasicodeflores.jpg" },
  { id:"g1", nombre:"Bouquet Primavera", desc:"Mezcla de margaritas, tulipanes y girasoles", precio:420, categoria:"Ramos Florales", tipo:"Girasoles", etiquetas:["Mixto"], oferta:true, precioAntes:480, img:"Imágenes/catalogo/bouquetprimavera.jpg" },
  { id:"t1", nombre:"Tulipanes Pastel", desc:"10 tulipanes combinados tonos suaves", precio:550, categoria:"Ramos Florales", tipo:"Tulipanes", etiquetas:["Pastel"], oferta:false, img:"Imágenes/catalogo/ramosflorales3.jpg" },

  // Jarrones, Canastas y Cajas Florales
  { id:"j1", nombre:"Jarrón con 15 Girasoles", desc:"Girasoles frescos en jarrón de cristal", precio:900, categoria:"Jarrones, Canastas y Cajas Florales", tipo:"Girasoles", etiquetas:["Premium"], oferta:true, precioAntes:990, img:"Imágenes/catalogo/jarrones1.jpg" },
  { id:"c1", nombre:"Caja Romántica", desc:"Caja negra con 9 rosas preservadas", precio:750, categoria:"Jarrones, Canastas y Cajas Florales", tipo:"Rosas", etiquetas:["Premium","Regalo"], oferta:false, img:"Imágenes/catalogo/jarrones2.jpg" },

  // San Valentín (nuevos)
  { id:"s1", nombre:"Corazón de Rosas", desc:"Arreglo en forma de corazón con rosas rojas", precio:690, categoria:"San Valentín", tipo:"Rosas", etiquetas:["Romántico"], oferta:true, precioAntes:750, img:"Imágenes/catalogo/sanvalentin1.jpg" },
  { id:"s2", nombre:"Caja con Amor", desc:"Caja con rosas y chocolates", precio:820, categoria:"San Valentín", tipo:"Mixto", etiquetas:["Regalo"], oferta:false, img:"Imágenes/catalogo/sanvalentin2.jpg" },
  { id:"s3", nombre:"Duo Rosa & Tulipán", desc:"Rosas rojas y tulipanes blancos", precio:760, categoria:"San Valentín", tipo:"Mixto", etiquetas:["Premium"], oferta:false, img:"Imágenes/catalogo/sanvalentin3.jpg" }
];

/* ====== ELEMENTOS ====== */
const $grid   = document.getElementById("productGrid"); // contenedor general donde van las secciones
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

    // cuando NO hay búsqueda, limitar a 4 por sección para dar variedad
    if (!state.texto) items = items.slice(0, 4);

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

function buildCard(p){
  const $card = tpl.content.cloneNode(true);

  const img = $card.querySelector(".card-img");
  // Placeholder si no hay imagen
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

  $card.querySelector(".btn-add").addEventListener("click", (ev) => {
    const cantidad = parseInt($qty.value||1,10);
    console.log("Agregar:", { id: p.id, cantidad });
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

function idFromTitle(t){
  // ids sin espacios ni acentos para anclaje desde el menú
  return t
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

/* ====== ARRANQUE ====== */
render();

// si entras con hash (#san-valentin), hace scroll suave a esa sección
if (location.hash) {
  const tgt = document.querySelector(location.hash);
  if (tgt) tgt.scrollIntoView({ behavior: "smooth" });
}
