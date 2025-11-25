// ==========================================
// CHECKOUT-PAGE.JS - VERSIÓN COMPLETA CORREGIDA
// ==========================================

// ==========================================
// UTILIDADES
// ==========================================
const money = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

// ==========================================
// FUNCIONES DE CARRITO
// ==========================================
function getCart() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function setCart(cart) {
  localStorage.setItem('carrito', JSON.stringify(cart));
}

// ==========================================
// BADGE DEL CARRITO (para el header)
// ==========================================
function updateCartBadge() {
  const cart = getCart();
  const count = cart.length;
  const badge = document.getElementById("cartBadge");
  
  if (badge) {
    if (count > 0) {
      badge.style.display = "inline-block";
      badge.textContent = count;
      badge.style.position = "absolute";
      badge.style.top = "-8px";
      badge.style.right = "-10px";
      badge.style.background = "#e63970";
      badge.style.color = "white";
      badge.style.fontSize = "12px";
      badge.style.borderRadius = "50%";
      badge.style.padding = "2px 6px";
      badge.style.fontWeight = "bold";
    } else {
      badge.style.display = "none";
    }
  }
}

// ==========================================
// NAVEGACIÓN ENTRE PASOS
// ==========================================
let currentStep = 1;

function showStep(step) {
  console.log('Mostrando paso:', step);
  
  // Ocultar todas las secciones
  document.querySelectorAll('.checkout-section').forEach(section => {
    section.classList.remove('active');
  });

  // Mostrar la sección actual
  const targetSection = document.querySelector(`.checkout-section[data-section="${step}"]`);
  if (targetSection) {
    targetSection.classList.add('active');
    console.log('Sección activada:', targetSection);
  } else {
    console.error('No se encontró la sección:', step);
  }

  // Actualizar indicadores de progreso
  document.querySelectorAll('.progress-step').forEach(progressStep => {
    const stepNum = parseInt(progressStep.dataset.step);
    if (stepNum <= step) {
      progressStep.classList.add('active');
    } else {
      progressStep.classList.remove('active');
    }
  });

  currentStep = step;

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// CARGAR PRODUCTOS EN EL RESUMEN
// ==========================================
function loadCartSummary() {
  const cart = getCart();
  const summaryContainer = document.getElementById('summaryItems');
  
  if (!summaryContainer) {
    console.error('❌ No se encontró el contenedor summaryItems');
    return;
  }

  if (cart.length === 0) {
    summaryContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    updateTotals();
    return;
  }

  summaryContainer.innerHTML = cart.map(item => {
    const qty = item.cantidad || 1;
    const price = item.precio || 0;
    const total = qty * price;
    
    // Crear texto de personalización si existe
    let customText = '';
    if (item.custom && typeof item.custom === 'object') {
      const customPairs = Object.entries(item.custom)
        .filter(([, v]) => v && String(v).trim() !== '')
        .map(([k, v]) => `${k}: ${v}`)
        .join(' · ');
      if (customPairs) {
        customText = `<div class="summary-item-details" style="font-size: 0.85em; color: #666; margin-top: 0.3rem;">${customPairs}</div>`;
      }
    }

    return `
      <div class="summary-item" style="display: flex; gap: 1rem; padding: 1rem 0; border-bottom: 1px solid #eee;">
        <img src="${item.imagen}" alt="${item.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
        <div style="flex: 1;">
          <div style="font-weight: 500;">${item.nombre}</div>
          ${customText}
          <div style="font-size: 0.9em; color: #666; margin-top: 0.3rem;">Cantidad: ${qty}</div>
        </div>
        <div style="font-weight: 600; color: #e63970;">${money(total)}</div>
      </div>
    `;
  }).join('');

  console.log('✅ Productos cargados en resumen:', cart.length);
  updateTotals();
}

// ==========================================
// ACTUALIZAR TOTALES
// ==========================================
function updateTotals() {
  const cart = getCart();

  // Calcular subtotal
  let subtotal = 0;
  cart.forEach(item => {
    const qty = item.cantidad || 1;
    const price = item.precio || 0;
    subtotal += qty * price;
  });

  // Calcular envío (respetando la selección del carrito)
  let shipping = 0;
  const deliveryTypeRadio = document.querySelector('input[name="deliveryType"]:checked');
  if (deliveryTypeRadio && deliveryTypeRadio.value === 'home') {
    shipping = 89;
  }

  // Total
  const total = subtotal + shipping;

  // Actualizar DOM
  const subtotalEl = document.getElementById('summarySubtotal');
  const shippingEl = document.getElementById('summaryShipping');
  const totalEl = document.getElementById('summaryTotal');

  if (subtotalEl) {
    subtotalEl.textContent = money(subtotal);
    console.log('✅ Subtotal actualizado:', money(subtotal));
  } else {
    console.error('❌ No se encontró summarySubtotal');
  }

  if (shippingEl) {
    shippingEl.textContent = money(shipping);
    console.log('✅ Envío actualizado:', money(shipping));
  } else {
    console.error('❌ No se encontró summaryShipping');
  }

  if (totalEl) {
    totalEl.textContent = money(total);
    console.log('✅ Total actualizado:', money(total));
  } else {
    console.error('❌ No se encontró summaryTotal');
  }

  console.log('💰 Totales:', { subtotal, shipping, total });
}

// ==========================================
// VALIDACIÓN DE FORMULARIOS
// ==========================================
function validateStep1() {
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const telefono = document.getElementById('telefono');

  if (!nombre || !nombre.value.trim()) {
    alert('Por favor ingresa tu nombre completo');
    if (nombre) nombre.focus();
    return false;
  }

  if (!email || !email.value.trim() || !email.value.includes('@')) {
    alert('Por favor ingresa un correo electrónico válido');
    if (email) email.focus();
    return false;
  }

  if (!telefono || !telefono.value.trim()) {
    alert('Por favor ingresa tu teléfono');
    if (telefono) telefono.focus();
    return false;
  }

  return true;
}

function validateStep2() {
  const deliveryType = document.querySelector('input[name="deliveryType"]:checked');
  if (!deliveryType) {
    alert('Por favor selecciona un método de entrega');
    return false;
  }

  // Si es entrega a domicilio, validar campos
  if (deliveryType.value === 'home') {
    const calle = document.getElementById('calle');
    const colonia = document.getElementById('colonia');
    const cp = document.getElementById('cp');
    const fecha = document.getElementById('fechaEntrega');
    const hora = document.getElementById('horaEntrega');

    if (!calle || !calle.value.trim()) {
      alert('Por favor ingresa la calle y número');
      if (calle) calle.focus();
      return false;
    }

    if (!colonia || !colonia.value.trim()) {
      alert('Por favor ingresa la colonia');
      if (colonia) colonia.focus();
      return false;
    }

    if (!cp || !cp.value.trim() || cp.value.length !== 5) {
      alert('Por favor ingresa un código postal válido (5 dígitos)');
      if (cp) cp.focus();
      return false;
    }

    if (!fecha || !fecha.value) {
      alert('Por favor selecciona una fecha de entrega');
      if (fecha) fecha.focus();
      return false;
    }

    if (!hora || !hora.value) {
      alert('Por favor selecciona un horario de entrega');
      if (hora) hora.focus();
      return false;
    }
  }

  return true;
}

function validateStep3() {
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
  if (!paymentMethod) {
    alert('Por favor selecciona un método de pago');
    return false;
  }

  // Si seleccionó tarjeta, validar campos
  if (paymentMethod.value === 'tarjeta') {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    const cardName = document.getElementById('cardName');

    if (!cardNumber || !cardNumber.value.trim() || cardNumber.value.replace(/\s/g, '').length < 13) {
      alert('Por favor ingresa un número de tarjeta válido');
      if (cardNumber) cardNumber.focus();
      return false;
    }

    if (!cardExpiry || !cardExpiry.value.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry.value)) {
      alert('Por favor ingresa una fecha de expiración válida (MM/AA)');
      if (cardExpiry) cardExpiry.focus();
      return false;
    }

    if (!cardCvv || !cardCvv.value.trim() || cardCvv.value.length < 3) {
      alert('Por favor ingresa un CVV válido');
      if (cardCvv) cardCvv.focus();
      return false;
    }

    if (!cardName || !cardName.value.trim()) {
      alert('Por favor ingresa el nombre del titular');
      if (cardName) cardName.focus();
      return false;
    }
  }

  // Validar términos
  const termsAccept = document.getElementById('termsAccept');
  if (!termsAccept || !termsAccept.checked) {
    alert('Debes aceptar los términos y condiciones para continuar');
    return false;
  }

  return true;
}

// ==========================================
// CONFIRMAR PEDIDO
// ==========================================
function confirmOrder() {
  const orderNumber = 'BF' + Date.now().toString().slice(-8);
  const email = document.getElementById('email').value;

  const modal = document.getElementById('confirmModal');
  const orderNumberSpan = document.getElementById('orderNumber');
  const confirmEmailSpan = document.getElementById('confirmEmail');

  if (modal && orderNumberSpan && confirmEmailSpan) {
    orderNumberSpan.textContent = orderNumber;
    confirmEmailSpan.textContent = email;
    modal.classList.add('active');
  }

  // Limpiar carrito
  localStorage.removeItem('carrito');
  updateCartBadge();

  console.log('✅ Pedido confirmado:', orderNumber);
}

// ==========================================
// CONFIGURACIÓN DE CAMPOS CONDICIONALES
// ==========================================
function setupConditionalFields() {
  // Campos de dirección según tipo de entrega
  const deliveryRadios = document.querySelectorAll('input[name="deliveryType"]');
  const addressFields = document.getElementById('addressFields');
  
  if (!addressFields) {
    console.warn('⚠️ No se encontró addressFields');
    return;
  }

  const requiredInputs = addressFields.querySelectorAll('input[required], select[required]');

  deliveryRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'home') {
        addressFields.style.display = 'block';
        requiredInputs.forEach(input => {
          input.setAttribute('required', 'required');
        });
      } else {
        addressFields.style.display = 'none';
        requiredInputs.forEach(input => {
          input.removeAttribute('required');
        });
      }
      updateTotals();
    });
  });

  // Campos de tarjeta según método de pago
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const cardFields = document.getElementById('cardFields');
  const transferenciaInfo = document.getElementById('transferenciaInfo');
  
  if (!cardFields || !transferenciaInfo) {
    console.warn('⚠️ No se encontraron campos de pago');
    return;
  }

  const cardInputs = cardFields.querySelectorAll('input');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'tarjeta') {
        cardFields.style.display = 'block';
        transferenciaInfo.style.display = 'none';
        cardInputs.forEach(input => {
          input.setAttribute('required', 'required');
        });
      } else if (radio.value === 'transferencia') {
        cardFields.style.display = 'none';
        transferenciaInfo.style.display = 'block';
        cardInputs.forEach(input => {
          input.removeAttribute('required');
        });
      } else {
        cardFields.style.display = 'none';
        transferenciaInfo.style.display = 'none';
        cardInputs.forEach(input => {
          input.removeAttribute('required');
        });
      }
    });
  });

  // Configuración inicial
  const pickupRadio = document.querySelector('input[name="deliveryType"][value="pickup"]');
  if (pickupRadio && pickupRadio.checked) {
    addressFields.style.display = 'none';
    requiredInputs.forEach(input => {
      input.removeAttribute('required');
    });
  }
}

// ==========================================
// CONFIGURAR FORMULARIOS
// ==========================================
function setupFormHandlers() {
  // Formulario paso 1
  const formPersonal = document.getElementById('formPersonal');
  if (formPersonal) {
    formPersonal.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateStep1()) {
        showStep(2);
      }
    });
  }

  // Formulario paso 2
  const formEntrega = document.getElementById('formEntrega');
  if (formEntrega) {
    formEntrega.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateStep2()) {
        showStep(3);
      }
    });
  }

  // Formulario paso 3
  const formPago = document.getElementById('formPago');
  if (formPago) {
    formPago.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateStep3()) {
        confirmOrder();
      }
    });
  }

  // Botones de navegación
  const backToStep1 = document.getElementById('backToStep1');
  if (backToStep1) {
    backToStep1.addEventListener('click', () => showStep(1));
  }

  const backToStep2 = document.getElementById('backToStep2');
  if (backToStep2) {
    backToStep2.addEventListener('click', () => showStep(2));
  }
}

// ==========================================
// CONTADOR DE CARACTERES
// ==========================================
function setupCharCounter() {
  const mensaje = document.getElementById('mensaje');
  const charCount = document.getElementById('charCount');

  if (mensaje && charCount) {
    mensaje.addEventListener('input', () => {
      charCount.textContent = mensaje.value.length;
    });
  }
}

// ==========================================
// FORMATEO DE INPUTS
// ==========================================
function setupInputFormatting() {
  // Número de tarjeta
  const cardNumber = document.getElementById('cardNumber');
  if (cardNumber) {
    cardNumber.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }

  // Fecha de expiración
  const cardExpiry = document.getElementById('cardExpiry');
  if (cardExpiry) {
    cardExpiry.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  // CVV solo números
  const cardCvv = document.getElementById('cardCvv');
  if (cardCvv) {
    cardCvv.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // CP solo números
  const cp = document.getElementById('cp');
  if (cp) {
    cp.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });
  }
}

// ==========================================
// CONFIGURAR FECHA MÍNIMA
// ==========================================
function setupMinDate() {
  const fechaEntrega = document.getElementById('fechaEntrega');
  if (fechaEntrega) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    fechaEntrega.min = minDate;
  }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌸 Checkout inicializado');

  // Verificar usuario logueado
  const currentUser = typeof getCurrentUser === "function" ? getCurrentUser() : null;

  if (!currentUser) {
    alert('Debes iniciar sesión para continuar con el checkout.');
    window.location.href = 'index.html';
    return;
  }

  // Prellenar datos del usuario
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  if (nombre && currentUser.name) nombre.value = currentUser.name;
  if (email && currentUser.email) email.value = currentUser.email;

  // Verificar carrito
  const cart = getCart();
  console.log('🛒 Carrito actual:', cart);

  if (cart.length === 0) {
    if (confirm('Tu carrito está vacío. ¿Deseas ir al catálogo?')) {
      window.location.href = 'index.html#catalogo';
      return;
    }
  }

  // ⭐ RECUPERAR OPCIÓN DE ENVÍO DEL CARRITO
  const savedShipping = localStorage.getItem('shippingOption');
  if (savedShipping) {
    try {
      const shippingData = JSON.parse(savedShipping);
      console.log('📦 Opción de envío del carrito:', shippingData);
      
      // Preseleccionar el radio button correcto
      const radioToSelect = document.querySelector(`input[name="deliveryType"][value="${shippingData.type}"]`);
      if (radioToSelect) {
        radioToSelect.checked = true;
        console.log('✅ Preseleccionado:', shippingData.type);
        
        // Si es pickup, ocultar campos de dirección
        if (shippingData.type === 'pickup') {
          const addressFields = document.getElementById('addressFields');
          if (addressFields) {
            addressFields.style.display = 'none';
            const requiredInputs = addressFields.querySelectorAll('input[required], select[required]');
            requiredInputs.forEach(input => input.removeAttribute('required'));
          }
        }
      }
    } catch (e) {
      console.error('Error al leer opción de envío:', e);
    }
  } else {
    console.log('ℹ️ No hay opción de envío guardada, usando "home" por defecto');
  }

  // Cargar resumen del pedido
  loadCartSummary();

  // Actualizar badge del carrito
  updateCartBadge();

  // Configurar todo
  setupFormHandlers();
  setupConditionalFields();
  setupCharCounter();
  setupInputFormatting();
  setupMinDate();

  // Mostrar paso 1
  showStep(1);

  console.log('✅ Checkout listo');
});