/* ====== NAV: abrir submenu en mobile ====== */
document.addEventListener("click", (e) => {
  const ddBtn = e.target.closest(".dropdown-btn");
  if (ddBtn) {
    const dd = ddBtn.parentElement;
    dd.classList.toggle("open");
    ddBtn.setAttribute("aria-expanded", dd.classList.contains("open"));
  }
});

/* ====== DATA DE EJEMPLO (sustituye por tu backend) ====== */
const PRODUCTS = [
  {
    id: "r1",
    nombre: "Ramo Clásico de Rosas",
    desc: "12 rosas rojas con follaje y moño de seda",
    precio: 350,
    categoria: "Ramos Florales",
    tipo: "Rosas",
    etiquetas: ["Clásico", "Rojo"],
    oferta: false,
    img: ""
  },
  {
    id: "g1",
    nombre: "Bouquet Primavera",
    desc: "Mezcla de margaritas, tulipanes y girasoles",
    precio: 420,
    categoria: "Ramos Florales",
    tipo: "Girasoles",
    etiquetas: ["Mixto"],
    oferta: true,
    precioAntes: 480,
    img: ""
  },
  {
    id: "j1",
    nombre: "Jarrón con 15 Girasoles",
    desc: "Girasoles frescos en jarrón de cristal",
    precio: 900,
    categoria: "Jarrones, Canastas y Cajas Florales",
    tipo: "Girasoles",
    etiquetas: ["Premium"],
    oferta: true,
    precioAntes: 990,
    img: ""
  },
  {
    id: "t1",
    nombre: "Tulipanes Pastel",
    desc: "10 tulipanes combinados tonos suaves",
    precio: 550,
    categoria: "Ramos Florales",
    tipo: "Tulipanes",
    etiquetas: ["Pastel"],
    oferta: false,
    img: ""
  },
  {
    id: "c1",
    nombre: "Caja Romántica",
    desc: "Caja negra con 9 rosas preservadas",
    precio: 750,
    categoria: "Jarrones, Canastas y Cajas Florales",
    tipo: "Rosas",
    etiquetas: ["Premium", "Regalo"],
    oferta: false,
    img: ""
  }
];

/* ====== ELEMENTOS ====== */
const $grid = document.getElementById("productGrid");
const $chips = document.getElementById("chips");
const $sidebar = document.getElementById("sidebarCats");
const $tags = document.getElementById("tagList");
const $search = document.getElementById("searchInput");
const $count = document.getElementById("countLabel");
const tpl = document.getElementById("tplCard");

/* ====== STATE ====== */
const state = { texto: "", chip: "Todos", cat: "Todos", tag: null };

/* ====== HELPERS ====== */
const unique = (arr) => [...new Set(arr)].sort();

/* ====== CONSTRUIR FILTROS ====== */
(function buildFilters(){
  const tipos = unique(["Todos", ...PRODUCTS.map(p=>p.tipo)]);
  const cats  = unique(["Todos", ...PRODUCTS.map(p=>p.categoria)]);
  const tags  = unique(PRODUCTS.flatMap(p=>p.etiquetas||[]));

  // Chips por tipo
  tipos.forEach(t=>{
    const b=document.createElement("button");
    b.className="chip"+(t==="Todos"?" active":"");
    b.textContent=t; b.dataset.val=t;
    b.addEventListener("click", ()=>{
      document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
      b.classList.add("active");
      state.chip=t; render();
    });
    $chips.appendChild(b);
  });

  // Sidebar categorías
  cats.forEach(c=>{
    const li=document.createElement("div");
    li.className="sidebar-item"+(c==="Todos"?" active":"");
    li.textContent=c; li.dataset.val=c;
    li.addEventListener("click", ()=>{
      document.querySelectorAll(".sidebar-item").forEach(s=>s.classList.remove("active"));
      li.classList.add("active");
      state.cat=c; render();
    });
    $sidebar.appendChild(li);
  });

  // Etiquetas
  tags.forEach(t=>{
    const span=document.createElement("span");
    span.className="tag"; span.textContent=t;
    span.addEventListener("click", ()=>{
      state.tag = state.tag===t ? null : t;
      render();
    });
    $tags.appendChild(span);
  });
})();

$search?.addEventListener("input", (e)=>{ state.texto = e.target.value.toLowerCase().trim(); render(); });

/* ====== FILTRO Y RENDER ====== */
function matchFilters(p){
  const byChip = state.chip==="Todos" || p.tipo===state.chip;
  const byCat  = state.cat==="Todos"  || p.categoria===state.cat;
  const byText = !state.texto || (p.nombre + " " + p.desc).toLowerCase().includes(state.texto);
  const byTag  = !state.tag || (p.etiquetas||[]).includes(state.tag);
  return byChip && byCat && byText && byTag;
}

function render(){
  $grid.setAttribute("aria-busy","true");
  $grid.innerHTML="";
  const data = PRODUCTS.filter(matchFilters);
  $count.textContent = `${data.length} producto${data.length!==1?"s":""}`;

  data.forEach(p=>{
    const $card = tpl.content.cloneNode(true);
    $card.querySelector(".card-img").src = p.img;
    $card.querySelector(".card-img").alt = p.nombre;
    $card.querySelector(".card-title").textContent = p.nombre;
    $card.querySelector(".card-desc").textContent = p.desc || "";
    $card.querySelector(".card-price").textContent = `$${p.precio}.00 MXN`;

    if(p.oferta){
      $card.querySelector(".badge-oferta").hidden=false;
      if(p.precioAntes){
        const old=$card.querySelector(".card-price-old");
        old.hidden=false; old.textContent=`$${p.precioAntes}.00`;
      }
    }

    // cantidad
    const $qty = $card.querySelector(".qty-input");
    $card.querySelectorAll(".qty-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const val = Math.max(1, parseInt($qty.value||1,10) + (btn.dataset.act==="plus"?1:-1));
        $qty.value = val;
      });
    });

    // agregar (aquí conectarías con tu carrito)
    $card.querySelector(".btn-add").addEventListener("click", (ev)=>{
      const cantidad = parseInt($qty.value||1,10);
      console.log("Agregar:", { id:p.id, cantidad });
      const btn = ev.currentTarget;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
      btn.disabled = true;
      setTimeout(()=>{ btn.innerHTML='<i class="fa-solid fa-plus"></i> Agregar'; btn.disabled=false; }, 1200);
    });

    $grid.appendChild($card);
  });

  if(data.length===0){
    const vacio=document.createElement("p");
    vacio.style.fontSize="1.6rem";vacio.style.color="#666";
    vacio.textContent="No se encontraron productos con esos filtros.";
    $grid.appendChild(vacio);
  }
  $grid.setAttribute("aria-busy","false");
}

render();
