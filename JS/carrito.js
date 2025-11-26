// ========================
// utilidades de formato
// ========================
const money = n => n.toLocaleString('es-MX',{style:'currency',currency:'MXN'});

// ========================
// storage helpers
// ========================
function getCart(){ return JSON.parse(localStorage.getItem('carrito')) || []; }
function setCart(cart){ localStorage.setItem('carrito', JSON.stringify(cart)); }
function genLineId(){ return 'line_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-5); }

// Normaliza carrito viejo: asegura lineId en cada renglón
(function ensureLineIds(){
  const c = getCart();
  let changed = false;
  c.forEach(it => {
    if(!it.lineId){ it.lineId = genLineId(); changed = true; }
    if(typeof it.cantidad === 'undefined' || Number(it.cantidad) < 1) it.cantidad = 1;
    if(!('custom' in it)) it.custom = {};
  });
  if(changed) setCart(c);
})();

// ========================
// totales por línea / carrito
// ========================
function lineTotal(article){
  const base = Number(article.dataset.price || 0);
  const qty  = Math.max(1, Number(article.querySelector('.qty-input').value || 1));
  return base * qty;
}

function refresh(){
  const items = [...document.querySelectorAll('.cart-item')];
  let subtotal = 0;

  items.forEach(a=>{
    const total = lineTotal(a);
    subtotal += total;
    a.querySelector('.line-total').textContent = money(total);
  });

  const shipSel = document.getElementById('shippingSelect');
  const ship = Number(shipSel ? shipSel.value : 0);

  document.getElementById('subtotal').textContent   = money(subtotal);
  document.getElementById('shipCost').textContent   = money(ship);
  document.getElementById('grandTotal').textContent = money(subtotal + ship);
}

// ========================
// helpers de personalización
// ========================
const CUSTOM_OPTIONS = {
  'bouquet-primavera': [
    {name:'Rosas',    label:'15 Rosas (color)', options:['Rojas','Rosas pastel', 'Blancas']},
    {name:'Lilis',    label:'5 Lilis (color)', options:['Rosas pastel','Moradas','Blancas']},
    {name:'Alstroemerias', label:'7 Alstroemerias (color)', options:['Rosas pastel','Blancas']},
    {name:'Follaje',    label:'Follaje', options:['Si: Eucalipto cinerea, Limonium','No']},
    {name:'Envoltura',    label:'Papel', options:['Coreano','Kraft','Encerado']},
    
  ],
  'caja-belleza-pastel': [
    {name:'Rosas',     label:'12 Rosas (color)', options:['Rosas pastel','Rosas fuerte','Melocotón']},
    {name:'Gerberas',  label:'6 Gerberas (color)',options:['Magentas','Rosas pastel','Blancas']},
    {name:'Claveles', label:'10 Claveles (color)', options:['Rosas pastel','Blancas']},
    {name:'Follaje',    label:'Follaje', options:['Si: Eucalipto cinerea, Limonium','No']},
    {name:'Envoltura', label:'Caja / Papel', options:['Caja circular (cartón): color y diseño aleatorio', 'Caja circular (plástica): color y diseño aleatorio','Papel Coreano', 'Papel Kraft', 'Papel Encerado']},
  ],
  'ramo-clasico-de-rosas': [
    {name:'Rosas',     label:'24 Rosas (color)',   options:['Rojas','Blancas','Mix #1: Rosas pastel y Lilas','Mix #2: Amarillas Y Blancas', 'Mix #3: Rojas Y Blancas']},
    {name:'Alstroemerias', label:'7 Alstroemerias (color)', options:['Rosa pastel','Blancas']},
    {name:'Follaje',    label:'Follaje', options:['Si: Eucalipto cinerea, Ruscus','No']},
    {name:'Envoltura', label:'Papel', options:['Coreano','Kraft','Encerado']},
  ],
  'gerberas-coloridas': [
    {name:'Gerberas',     label:'15 Gerberas (color)',   options:['Mix #1: Rojas, Blancas, Amarillas, Naranjas', 'Mix #2: Rojas, Fucsias, Moradas, Naranjas', 'Mix #3: Rosas pastel, Azul cielo, Lilas, Blancas']},
    {name:'Follaje',    label:'Follaje', options:['Si: Eucalipto cinerea, Ruscus','No']},
    {name:'Envoltura', label:'Papel',    options:['Coreano','Kraft','Encerado']},
  ],
  'jarron-alegria': [
    {name:'Rosas', label:'8 Rosas (color)', options:['Rosas fuerte','Rosas pastel','Melocotón']},
    {name:'Claveles', label:'6 Claveles (color)', options:['Rosas pastel','Blancas']},
    {name:'Alstroemerias', label:'8 Alstroemerias (color)', options:['Rosa pastel','Blancas','Amarillas']},
    {name:'Follaje',    label:'Follaje', options:['Si: Eucalipto cinerea, Limonium','No']},
    {name:'Envoltura', label:'Papel',    options:['Coreano','Kraft','Encerado']},
  ],
  'canasta-floral': [
    {name:'Rosas', label:'8 Rosas (color)', options:['Rosas fuerte','Rosas pastel','Melocotón']},
    {name:'Dalias', label:'15 Dalias (color)', options:['Rosas fuerte','Rosas pastel','Melocotón','Lilas']},
    {name:'Crisantemos', label:'6 Crisantemos (color)', options:['Blancos','Rosas pastel','Melocotón']},
    {name:'Alstroemerias', label:'8 Alstroemerias (color)', options:['Rosa pastel','Lilas','Blancas','Amarillas']},
    {name:'Follaje',    label:'Follaje', options:['Si: Eucalipto cinerea, Limonium, Pittosporum','No']},
    {name:'Envoltura', label:'Canasta',    options:['Mimbre (forma y color aleatorio)','Cartón rígido (forma y color aleatorio)','Madera (forma y color aleatorio)']},

  ],
  'amor-clasico': [
   {name:'Rosas', label:'30 Rosas (color)', options:['Rojas','Rosas fuerte','Rosas pastel','Melocotón']},
   {name:'Flor extra', label:'1 Flor extra (color aleatorio)', options:['Girasol','Lili','Gerbera']},
   {name:'Follaje',    label:'Follaje', options:['Si: Eucalipto cinerea, Limonium','No']},
   {name:'Golosinas',    label:'Chocolates', options:['5 Ferrero Rocher','5 Rafaello']},
   {name:'Envoltura', label:'Papel', options:['Papel Coreano', 'Papel Kraft', 'Papel Encerado']},
    
  ],
  'corazon-de-amor': [
   {name:'Rosas', label:'24 Rosas (color)', options:['Rojas','Rosas fuerte','Rosas pastel','Melocotón']},
   {name:'Follaje',    label:'Follaje', options:['Si: Eucalipto cinerea, Limonium','No']},
   {name:'Golosinas',    label:'Chocolates', options:['12 Ferrero Rocher','12 Rafaello']},
   {name:'Envoltura', label:'Caja / Papel', options:['Caja corazón (cartón rígido): color y diseño aleatorio', 'Caja corazón (plástica): color y diseño aleatorio','Papel Coreano', 'Papel Kraft', 'Papel Encerado']},
    
  ],
  'amor-y-chocolates': [
   {name:'Rosas', label:'20 Rosas (color)', options:['Rojas','Rosas fuerte','Rosas pastel','Melocotón']},
   {name:'Follaje',    label:'Follaje', options:['Si: Eucalipto cinerea, Limonium','No']},
   {name:'Golosinas',    label:'Chocolates', options:['8 Ferrero Rocher','8 Rafaello']},
   {name:'Envoltura', label:'Caja / Papel', options:['Caja cuadrada (cartón rígido): color y diseño aleatorio', 'Caja cuadrada (plástica): color y diseño aleatorio','Papel Coreano', 'Papel Kraft', 'Papel Encerado']},
  ],
  
};

// mapea el set de opciones por id o por nombre
function mapKeyForProduct(p){
  if (CUSTOM_OPTIONS[p.id]) return p.id;
  const name = (p.nombre || '').toLowerCase();
  if (name.includes('bouquet') && name.includes('primavera')) return 'bouquet-primavera';
  if (name.includes('belleza') && name.includes('pastel'))     return 'caja-belleza-pastel';
  if (name.includes('ramo') && name.includes('rosas'))     return 'ramo-clasico-de-rosas';
  if (name.includes('gerberas') && name.includes('coloridas'))     return 'gerberas-coloridas';
  if (name.includes('jarrón') && name.includes('alegría'))     return 'jarron-alegria';
  if (name.includes('canasta') && name.includes('floral'))     return 'canasta-floral';
  if (name.includes('corazón') && name.includes('de amor'))     return 'corazon-de-amor';
  if (name.includes('amor') && name.includes('clásico'))     return 'amor-clasico';
  if (name.includes('amor') && name.includes('y chocolates'))     return 'amor-y-chocolates';
  return null;
}

function hasCustomValues(obj){
  if(!obj || typeof obj !== 'object') return false;
  return Object.values(obj).some(v => v && String(v).trim() !== '');
}

// ========================
// Actualiza cantidad / elimina (por lineId)
// ========================
function updateLocalStorage(article){
  const lineId = article.dataset.lineId;
  const carrito = getCart();
  const prod = carrito.find(p => p.lineId === lineId);
  if(prod) {
    prod.cantidad = Math.max(1, Number(article.querySelector('.qty-input').value));
    setCart(carrito);
  }
  renderRightPanelItemsList();
}

function removeFromLocalStorage(lineId){
  let carrito = getCart();
  carrito = carrito.filter(p => p.lineId !== lineId);
  setCart(carrito);
  renderRightPanelItemsList();

 updateCartBadge(); 

}

// Duplicar renglón
function duplicateLine(lineId){
  const carrito = getCart();
  const idx = carrito.findIndex(p => p.lineId === lineId);
  if(idx === -1) return;
  const copy = JSON.parse(JSON.stringify(carrito[idx]));
  copy.lineId = genLineId();
  // puedes decidir si duplicar con o sin custom:
  // 1) manteniendo custom:
  // copy.custom = {...(copy.custom||{})};
  // 2) o duplicar en limpio:
  // copy.custom = {};
  // Por defecto: mantenemos lo que ya tenía, el usuario decide toggle después.
  carrito.splice(idx+1, 0, copy);
  setCart(carrito);
  // re-render lista de items
  rebuildItemsDOM();
  renderRightPanelItemsList();
}

// ========================
// Resumen debajo de cada artículo
// ========================
function updateCustomSummary(article, custom){
  const box = article.querySelector('.custom-summary');
  if (!box) return;

  const parts = Object.entries(custom || {})
    .filter(([,v]) => v && String(v).trim() !== '')
    .map(([k,v]) => {
      const nice = k.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase());
      return `${nice}: ${v}`;
    });

  if (parts.length){
    box.textContent = `Personalización: ${parts.join(' · ')}`;
    box.style.display = 'block';
  } else {
    box.textContent = '';
    box.style.display = 'none';
  }
}

// ========================
// Construcción de selects
// ========================
function buildSelect(name, arr, currentValue){
  const sel = document.createElement('select');
  sel.name = name;
  sel.className = 'custom-select';
  const first = document.createElement('option');
  first.value = '';
  first.textContent = 'Selecciona…';
  sel.appendChild(first);
  arr.forEach(opt=>{
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    if(currentValue && String(currentValue) === String(opt)) o.selected = true;
    sel.appendChild(o);
  });
  return sel;
}

// ========================
// Toggle "¿Quieres personalizar?" por renglón (lineId)
// ========================
function setPersonalizeState(article, line, on){
  const variantsDiv = article.querySelector('.custom-fields');
  const toggle = article.querySelector('.personalize-check');
  if(toggle) toggle.checked = !!on;

  const carrito = getCart();
  const prod = carrito.find(x => x.lineId === line.lineId);
  if(!prod) return;

  if(on){
    variantsDiv.style.display = '';
  } else {
    variantsDiv.style.display = 'none';
    prod.custom = {}; // limpiar
    setCart(carrito);
    updateCustomSummary(article, prod.custom);
  }
  renderRightPanelItemsList();
}

function initPersonalizeToggle(article, line, key){
  const variantsDiv = article.querySelector('.custom-fields');
  const holder = article.querySelector('.personalize-toggle');
  if(!holder) return;

  // Asegurar estructura de storage
  const carrito = getCart();
  let prod = carrito.find(x => x.lineId === line.lineId);
  if(!prod){
    prod = {...line, lineId: line.lineId || genLineId(), custom:{}};
    carrito.push(prod); setCart(carrito);
  }
  if(!prod.custom) prod.custom = {};

  const startOn = hasCustomValues(prod.custom);
  const check = holder.querySelector('.personalize-check');
  if(check) check.checked = startOn;

  variantsDiv.style.display = startOn ? '' : 'none';

  holder.addEventListener('change', (e)=>{
    const on = e.target.closest('.personalize-check')?.checked;
    setPersonalizeState(article, line, !!on);
  });
}

// ========================
// Inyecta selects + toggle (por renglón)
// ========================
function attachCustomization(article, line){
  const key = mapKeyForProduct(line);
  const variantsRoot = article.querySelector('.item-variants');

  if (!key) {
    variantsRoot.innerHTML = '';
    return;
  }

  const toggleHtml = `
    <div class="personalize-toggle">
      <label class="personalize-label">
        <input type="checkbox" class="personalize-check" />
        Quiero personalizar este producto
      </label>
    </div>
  `;

  const selectsHtml = CUSTOM_OPTIONS[key].map(def => `
    <label class="custom-row">
      <span>${def.label}</span>
      <select name="${def.name}" class="custom-select">
        <option value="">Selecciona…</option>
        ${def.options.map(o=>`<option>${o}</option>`).join('')}
      </select>
    </label>
  `).join('') + `<div class="custom-summary" aria-live="polite"></div>`;

  variantsRoot.innerHTML = toggleHtml + `<div class="custom-fields">${selectsHtml}</div>`;

  // Hidratar selects y eventos con lineId
  const carritoA = getCart();
  const prodA = carritoA.find(x => x.lineId === line.lineId) || {};
  const current = prodA.custom || {};

  variantsRoot.querySelectorAll('select.custom-select').forEach(sel => {
    if (current[sel.name]) sel.value = current[sel.name];

    sel.addEventListener('change', () => {
      const carritoC = getCart();
      const prodC = carritoC.find(x => x.lineId === line.lineId);
      if (prodC){
        prodC.custom = prodC.custom || {};
        prodC.custom[sel.name] = sel.value;
        setCart(carritoC);
        updateCustomSummary(article, prodC.custom);
        renderRightPanelItemsList();
      }
    });
  });

  initPersonalizeToggle(article, line, key);

  const carritoB = getCart();
  const prodB = carritoB.find(x => x.lineId === line.lineId) || {};
  updateCustomSummary(article, (prodB.custom || {}));
}

// ========================
// Panel derecho: Lista con sublínea (Opción B)
// ========================
function renderRightPanelItemsList(){
  const ul = document.getElementById('resumen-items');
  if(!ul) return;

  const carrito = getCart();
  ul.innerHTML = '';

  // 🔹 Carrito vacío → mensaje distinto en el resumen
  if(!carrito || carrito.length === 0){
    ul.innerHTML = '<li class="empty-summary">Agrega productos para ver el resumen aquí.</li>';
    return;
  }

  carrito.forEach(it=>{
    const li = document.createElement('li');

    const qty = Number(it.cantidad || 1);
    const name = it.nombre || 'Artículo';
    const top = document.createElement('div');
    top.textContent = `[${qty}] ${name}`;

    const sub = document.createElement('div');
    sub.className = 'summary-subline';

    const key = mapKeyForProduct(it);
    const pairs = (it.custom && typeof it.custom === 'object')
      ? Object.entries(it.custom).filter(([,v]) => v && String(v).trim() !== '')
          .map(([k,v]) => `${k.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())}: ${v}`)
      : [];

    if (key) {
      sub.textContent = pairs.length ? pairs.join(' · ') : 'Sin personalización';
    } else {
      sub.textContent = '';
    }

    li.appendChild(top);
    if (sub.textContent) li.appendChild(sub);
    ul.appendChild(li);
  });
}


// ========================
// DOM helpers por renglón
// ========================
function buildCartItemDOM(line){
  const article = document.createElement('article');
  article.classList.add('cart-item');
  article.dataset.price  = line.precio;
  article.dataset.id     = line.id;
  article.dataset.lineId = line.lineId;

  article.innerHTML = `
    <div class="item-media"><img src="${line.imagen}" alt="${line.nombre}"></div>
    <div class="item-info">
      <h2 class="item-name">
        ${line.nombre}
        ${ (line.precioOriginal && line.precioOriginal>line.precio)
            ? `<span class="badge-oferta">-${Math.round((1 - (line.precio / line.precioOriginal))*100)}%</span>`
            : `` }
      </h2>
      <p class="item-sku">
        DESCUENTO:
        <span>${
          (line.precioOriginal && line.precioOriginal>line.precio)
          ? (Math.round((1 - (line.precio / line.precioOriginal))*100) + '% aplicado automáticamente')
          : '0% de descuento'
        }</span>
      </p>
      <div class="item-variants"></div>
    </div>

    <div class="item-price">
      <div class="unit">
        ${ (line.precioOriginal && line.precioOriginal>line.precio) ? `<span class="old-price">${money(line.precioOriginal)}</span>` : `` }
        <span class="current-price">${money(line.precio)}</span>
      </div>
    </div>

    <div class="item-qty">
      <button class="qty-btn minus" aria-label="Restar">−</button>
      <input type="number" class="qty-input" min="1" value="${line.cantidad}" inputmode="numeric" />
      <button class="qty-btn plus" aria-label="Sumar">+</button>
    </div>

    <div class="item-total">
      <span class="line-total">${money(line.precio * line.cantidad)}</span>
      <div class="item-actions">
        <button class="duplicate-item" title="Duplicar"><i class="fa-regular fa-clone"></i></button>
        <button class="remove-item"   title="Quitar"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  `;

  // Personalización (toggle + selects por renglón)
  attachCustomization(article, line);

  // Eventos cantidad / quitar / duplicar
  const minus  = article.querySelector('.qty-btn.minus');
  const plus   = article.querySelector('.qty-btn.plus');
  const input  = article.querySelector('.qty-input');
  const remove = article.querySelector('.remove-item');
  const dup    = article.querySelector('.duplicate-item');

  minus.addEventListener('click', ()=>{
    input.value = Math.max(1, Number(input.value)-1);
    updateLocalStorage(article);
    refresh();
  });
  plus.addEventListener('click', ()=>{
    input.value = Number(input.value)+1;
    updateLocalStorage(article);
    refresh();
  });
  input.addEventListener('input', ()=>{
    if(input.value === '' || Number(input.value) < 1) input.value = 1;
    updateLocalStorage(article);
    refresh();
  });
  remove.addEventListener('click', ()=>{
    article.remove();
    removeFromLocalStorage(article.dataset.lineId);
    refresh();
    const contenedor = document.querySelector('.cart-items');
    if(!document.querySelector('.cart-item')){
      contenedor.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
    }
  });
  dup.addEventListener('click', ()=>{
    duplicateLine(article.dataset.lineId);
  });

  return article;
}

function rebuildItemsDOM(){
  const contenedor = document.querySelector('.cart-items');
  contenedor.innerHTML = '';
  const carrito = getCart();
  if(carrito.length === 0){
    contenedor.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
    refresh();
    renderRightPanelItemsList();
    return;
  }
  carrito.forEach(line=>{
    // asegurar lineId si entró un item “nuevo” sin él
    if(!line.lineId){ line.lineId = genLineId(); setCart(carrito); }
    const article = buildCartItemDOM(line);
    contenedor.appendChild(article);
  });
  refresh();
  renderRightPanelItemsList();
}

// ========================
// arranque
// ========================
document.addEventListener('DOMContentLoaded', ()=>{
  // Render inicial
  rebuildItemsDOM();

  // Envío
  const shipSel = document.getElementById('shippingSelect');
  if(shipSel){
    shipSel.addEventListener('change', ()=>{
      refresh();
      renderRightPanelItemsList();
      
      // ⭐ GUARDAR opción de envío
      const shippingData = {
        type: shipSel.value === '0' ? 'pickup' : 'home',
        cost: Number(shipSel.value)
      };
      localStorage.setItem('shippingOption', JSON.stringify(shippingData));
      console.log('💾 Opción de envío guardada:', shippingData);
    });
    
    // ⭐ CARGAR opción guardada al iniciar
    const savedShipping = localStorage.getItem('shippingOption');
    if (savedShipping) {
      const data = JSON.parse(savedShipping);
      shipSel.value = data.cost.toString();
      console.log('✅ Opción de envío recuperada:', data);
      refresh(); // Actualizar totales con el valor recuperado
    }
  }
  // Vaciar carrito
  const clearBtn = document.getElementById('clearCart');
  if(clearBtn){
    clearBtn.addEventListener('click', ()=>{
      document.querySelectorAll('.cart-item').forEach(e=>e.remove());
      localStorage.removeItem('carrito');
      refresh();
      renderRightPanelItemsList();
      const contenedor = document.querySelector('.cart-items');
      contenedor.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
    });
  }

  clearBtn.addEventListener('click', ()=>{
  document.querySelectorAll('.cart-item').forEach(e=>e.remove());
  localStorage.removeItem('carrito');
  refresh();
  renderRightPanelItemsList();
  updateCartBadge(); // 👈 actualiza el numerito del carrito
  const contenedor = document.querySelector('.cart-items');
  contenedor.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
});


  // 🔥 CONEXIÓN AL CHECKOUT
  const checkoutBtn = document.getElementById('checkout');
  if(checkoutBtn){
    checkoutBtn.addEventListener('click', ()=>{
      const carrito = getCart();
      
      // Verificar que el carrito no esté vacío
      if (!carrito || carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de continuar.');
        return;
      }
      
      // Redirigir al checkout
      window.location.href = 'checkout.html';
    });
  }
}); // ⬅️ Esta llave cierra el DOMContentLoaded

// ==========================
// Mostrar badge en carrito
// ==========================
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("carrito")) || [];
  const count = cart.length;

  const icon = document.getElementById("cart-icon");
  if (!icon) return;

  // Si no existe la burbuja, la creamos
  let badge = document.getElementById("cart-badge");

  if (!badge) {
    badge = document.createElement("span");
    badge.id = "cart-badge";
    badge.style.position = "absolute";
    badge.style.top = "-8px";
    badge.style.right = "-10px";
    badge.style.background = "#e63970";
    badge.style.color = "white";
    badge.style.fontSize = "12px";
    badge.style.borderRadius = "50%";
    badge.style.padding = "2px 6px";
    badge.style.fontWeight = "bold";

    // Hacemos el icono un contenedor
    icon.style.position = "relative";
    icon.appendChild(badge);
  }

  if (count > 0) {
    badge.style.display = "inline-block";
    badge.textContent = count;
  } else {
    badge.style.display = "none";
  }
}

// Ejecutar cuando cargue la página
document.addEventListener("DOMContentLoaded", updateCartBadge);
