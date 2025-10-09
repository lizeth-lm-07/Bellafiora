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
  const iva  = (subtotal + ship) * 0.16; // solo informativo (incluido)

  document.getElementById('subtotal').textContent   = money(subtotal);
  document.getElementById('shipCost').textContent   = money(ship);
  document.getElementById('tax').textContent        = money(iva);
  document.getElementById('grandTotal').textContent = money(subtotal + ship);
}

function bindItem(article){
  const minus = article.querySelector('.minus');
  const plus  = article.querySelector('.plus');
  const input = article.querySelector('.qty-input');
  const remove= article.querySelector('.remove-item');

  minus.addEventListener('click', ()=>{ input.value = Math.max(1, Number(input.value)-1); refresh(); });
  plus.addEventListener('click',  ()=>{ input.value = Number(input.value)+1; refresh(); });
  input.addEventListener('input', ()=>{ if(input.value === '' || Number(input.value) < 1) input.value = 1; refresh(); });
  remove.addEventListener('click', ()=>{ article.remove(); refresh(); });
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.cart-item').forEach(bindItem);
  document.getElementById('shippingSelect').addEventListener('change', refresh);
  document.getElementById('clearCart').addEventListener('click', ()=>{
    document.querySelectorAll('.cart-item').forEach(e=>e.remove());
    refresh();
  });
  document.getElementById('checkout').addEventListener('click', ()=>{
    alert('Redirigiendo a pago seguro…');
  });

  refresh();
});
