const money = n => n.toLocaleString('es-MX',{style:'currency',currency:'MXN'});

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

// 🔹 Actualiza la cantidad en localStorage
function updateLocalStorage(article){
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const prod = carrito.find(p => p.id === article.dataset.id);
  if(prod) prod.cantidad = Number(article.querySelector('.qty-input').value);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// 🔹 Elimina un producto de localStorage
function removeFromLocalStorage(id){
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carrito.filter(p => p.id !== id);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// 🔹 Enlaza eventos de cada producto
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

// 🔹 Inicia todo al cargar la página
document.addEventListener('DOMContentLoaded', ()=>{
  const contenedor = document.querySelector('.cart-items');
  const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];

  if(carritoGuardado.length === 0){
    contenedor.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
  } else {
    carritoGuardado.forEach(p=>{
      const article = document.createElement('article');
      article.classList.add('cart-item');
      article.dataset.price = p.precio;
      article.dataset.id = p.id;

      article.innerHTML = `
        <div class="item-media"><img src="${p.imagen}" alt="${p.nombre}"></div>
        <div class="item-info">
          <h2 class="item-name">${p.nombre}</h2>
          <p class="item-sku">DESCUENTO: <span>-</span></p>
          <div class="item-variants"></div>
        </div>
        <div class="item-price">
          <div class="unit">
            <span class="current-price">$${p.precio}.00</span>
          </div>
        </div>
        <div class="item-qty">
          <button class="qty-btn minus" aria-label="Restar">−</button>
          <input type="number" class="qty-input" min="1" value="${p.cantidad}" inputmode="numeric" />
          <button class="qty-btn plus" aria-label="Sumar">+</button>
        </div>
        <div class="item-total">
          <span class="line-total">$${p.precio * p.cantidad}.00</span>
          <button class="remove-item" title="Quitar"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      contenedor.appendChild(article);
      bindItem(article);
    });
  }

  document.getElementById('shippingSelect').addEventListener('change', refresh);

  document.getElementById('clearCart').addEventListener('click', ()=>{
    document.querySelectorAll('.cart-item').forEach(e=>e.remove());
    localStorage.removeItem('carrito');
    refresh();
    contenedor.innerHTML = '<p>Tu carrito está vacío 🛒</p>';
  });

  document.getElementById('checkout').addEventListener('click', ()=>{
    alert('Redirigiendo a pago seguro…');
  });

  refresh();
});
