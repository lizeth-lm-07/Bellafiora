// ========================
// utilidades de formato
// ========================
const money = n => n.toLocaleString('es-MX',{style:'currency',currency:'MXN'});

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

  const ship = Number(document.getElementById('shippingSelect').value || 0);

  document.getElementById('subtotal').textContent   = money(subtotal);
  document.getElementById('shipCost').textContent   = money(ship);
  document.getElementById('grandTotal').textContent = money(subtotal + ship);
}

// ========================
// storage helpers
// ========================
function getCart(){ return JSON.parse(localStorage.getItem('carrito')) || []; }
function setCart(cart){ localStorage.setItem('carrito', JSON.stringify(cart)); }

// Actualiza cantidad
function updateLocalStorage(article){
  const carrito = getCart();
  const prod = carrito.find(p => p.id === article.dataset.id);
  if(prod) {
    prod.cantidad = Number(article.querySelector('.qty-input').value);
    setCart(carrito);
  }
  renderRightPanelCustom(); // por si quieres considerar cantidades en el resumen
}

// Elimina un producto
function removeFromLocalStorage(id){
  let carrito = getCart();
  carrito = carrito.filter(p => p.id !== id);
  setCart(carrito);
  renderRightPanelCustom();
}

// ========================
// PERSONALIZACIÓN (2 arreglos)
// ========================
const CUSTOM_OPTIONS = {
  'bouquet-primavera': [
    {name:'rosas',    label:'Rosas (color)', options:['Rojas','Blancas']},
    {name:'lilis',    label:'Lilis (color)', options:['Rosas','Moradas','Blancas']},
    {name:'papel',    label:'Papel',         options:['Coreano','Corrugado','Kraft']},
  ],
  'caja-belleza-pastel': [
    {name:'rosas',     label:'Rosas (color)',   options:['Rosas pastel','Blancas','Champagne']},
    {name:'gerberas',  label:'Gerberas (color)',options:['Fucsia','Rosa claro','Blancas']},
    {name:'envoltura', label:'Papel / Caja',    options:['Caja pastel beige','Caja rosa pálido','Papel kraft']},
  ],
};

// Mapeo por id o nombre
function mapKeyForProduct(p){
  if (CUSTOM_OPTIONS[p.id]) return p.id;
  const name = (p.nombre || '').toLowerCase();
  if (name.includes('bouquet') && name.includes('primavera')) return 'bouquet-primavera';
  if (name.includes('belleza') && name.includes('pastel'))     return 'caja-belleza-pastel';
  return null;
}

// Resumen debajo de cada artículo
function updateCustomSummary(article, custom){
  const box = article.querySelector('.custom-summary');
  if (!box) return;
  const parts = Object.entries(custom || {})
    .filter(([,v]) => v)
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

// 🔹 Construye el texto para el panel derecho
function buildRightPanelText(){
  const carrito = getCart();
  const parts = [];

  carrito.forEach(it => {
    const opts = it.custom ? Object.entries(it.custom)
      .filter(([,v]) => v)
      .map(([k,v]) => `${k.replace(/_/g,' ')}: ${v}`) : [];

    if (opts.length){
      parts.push(`${it.nombre.toLowerCase()}: ${opts.join(', ')}`);
    }
  });

  return parts.join(' · ');
}

// 🔹 Pinta/oculta el resumen en el panel derecho
function renderRightPanelCustom(){
  const el = document.getElementById('customSummary');
  if (!el) return;
  const txt = buildRightPanelText();
  if (txt){
    el.textContent = `(${txt})`;
    el.style.display = 'inline-block';
  } else {
    el.textContent = '';
    el.style.display = 'none';
  }
}

// Inyecta los selects para el artículo (si aplica) y enlaza eventos
function attachCustomization(article, p){
  const key = mapKeyForProduct(p);
  if (!key) return; // este producto no se personaliza

  const variantsDiv = article.querySelector('.item-variants');

  // Construir selects
  variantsDiv.innerHTML = CUSTOM_OPTIONS[key].map(def => `
    <label>${def.label}
      <select name="${def.name}">
        <option value="">Selecciona…</option>
        ${def.options.map(o=>`<option>${o}</option>`).join('')}
      </select>
    </label>
  `).join('') + `<div class="custom-summary" aria-live="polite"></div>`;

  // Asegura estructura en storage
  const carritoA = getCart();
  const prodA = carritoA.find(x => x.id === p.id);
  if (prodA && !prodA.custom){
    prodA.custom = {};
    setCart(carritoA);
  }

  // Hidrata selects y guarda cambios
  variantsDiv.querySelectorAll('select').forEach(sel => {
    const carritoB = getCart();
    const prodB = carritoB.find(x => x.id === p.id) || {};
    const customB = prodB.custom || {};
    if (customB[sel.name]) sel.value = customB[sel.name];

    sel.addEventListener('change', () => {
      const carritoC = getCart();
      const prodC = carritoC.find(x => x.id === p.id);
      if (prodC){
        prodC.custom = prodC.custom || {};
        prodC.custom[sel.name] = sel.value;
        setCart(carritoC);
        updateCustomSummary(article, prodC.custom);
        renderRightPanelCustom(); // 🔸 actualizar panel derecho
      }
    });
  });

  // Resumen inicial (debajo del artículo) + panel derecho
  const carritoD = getCart();
  const prodD = carritoD.find(x => x.id === p.id) || {};
  updateCustomSummary(article, (prodD.custom || {}));
  renderRightPanelCustom();
}

// ========================
// eventos por artículo
// ========================
function bindItem(article){
  const minus = article.querySelector('.minus');
  const plus  = article.querySelector('.plus');
  const input = article.querySelector('.qty-input');
  const remove= article.querySelector('.remove-item');

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
    removeFromLocalStorage(article.dataset.id);
    refresh();
    const contenedor = document.querySelector('.cart-items');
    if(!document.querySelector('.cart-item')){
      contenedor.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
    }
  });
}

// ========================
// arranque
// ========================
document.addEventListener('DOMContentLoaded', ()=>{
  const contenedor = document.querySelector('.cart-items');
  const carritoGuardado = getCart();

  if(carritoGuardado.length === 0){
    contenedor.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
  } else {
    carritoGuardado.forEach(p=>{
      const article = document.createElement('article');
      article.classList.add('cart-item');
      article.dataset.price = p.precio;
      article.dataset.id = p.id;

                  article.innerHTML = `        <div class="item-media"><img src="${p.imagen}" alt="${p.nombre}"></div>
        <div class="item-info">
          <h2 class="item-name">${p.nombre} ${ (p.precioOriginal && p.precioOriginal>p.precio) ? `<span class="badge-oferta">-${Math.round((1 - (p.precio / p.precioOriginal))*100)}%</span>` : `` }</h2>
          <p class="item-sku">DESCUENTO: <span>${ (p.precioOriginal && p.precioOriginal>p.precio) ? (Math.round((1 - (p.precio / p.precioOriginal))*100) + '% aplicado automáticamente') : '0% de descuento' }</span></p>
          <div class="item-variants"></div>
        </div>
        <div class="item-price">
          <div class="unit">
            ${ (p.precioOriginal && p.precioOriginal>p.precio) ? `<span class="old-price">${money(p.precioOriginal)}</span>` : `` }
            <span class="current-price">${money(p.precio)}</span>
          </div>
        </div>
        <div class="item-qty">
          <button class="qty-btn minus" aria-label="Restar">−</button>
          <input type="number" class="qty-input" min="1" value="${p.cantidad}" inputmode="numeric" />
          <button class="qty-btn plus" aria-label="Sumar">+</button>
        </div>
        <div class="item-total">
          <span class="line-total">${money(p.precio * p.cantidad)}</span>
          <button class="remove-item" title="Quitar"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      contenedor.appendChild(article);

      // --- Personalización (sólo 2 arreglos) ---
      attachCustomization(article, p);

      // --- Eventos de cantidad / eliminar ---
      bindItem(article);
    });
  }

  // Envío
  document.getElementById('shippingSelect').addEventListener('change', ()=>{
    refresh();
    renderRightPanelCustom();
  });

  // Vaciar carrito
  document.getElementById('clearCart').addEventListener('click', ()=>{
    document.querySelectorAll('.cart-item').forEach(e=>e.remove());
    localStorage.removeItem('carrito');
    refresh();
    renderRightPanelCustom();
    contenedor.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
  });

  // Checkout (ejemplo: muestra lo que se enviaría)
  document.getElementById('checkout').addEventListener('click', ()=>{
    const carrito = getCart();
    const resumen = carrito.map(it => {
      const customTxt = it.custom ? Object.entries(it.custom)
        .filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join(' · ') : 'Sin personalización';
      return `• ${it.nombre} x${it.cantidad} — ${customTxt}`;
    }).join('\n');

    alert('Resumen a enviar:\n\n' + resumen);
  });

  // Primer render
  refresh();
  renderRightPanelCustom();
});
