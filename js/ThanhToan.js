
(() => {
  'use strict';

  // ---- Utilities ----
  const fmt = n => (n || 0).toLocaleString('vi-VN') + 'đ';

  function loadCartFromStorage() {
    try {
      return {
        items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
        total: Number(localStorage.getItem('cartTotal') || 0),
        qty:   Number(localStorage.getItem('cartQtyTotal') || 0),
      };
    } catch {
      return { items: [], total: 0, qty: 0 };
    }
  }

  // ---- Render Order Summary ----
  function renderOrder() {
    const { items, total, qty } = loadCartFromStorage();

    const list      = document.getElementById('orderItems');
    const countEl   = document.getElementById('itemCount');
    const subtotal  = document.getElementById('subtotalText');
    const shipEl    = document.getElementById('shippingFeeText');
    const grandEl   = document.getElementById('grandTotalText');

    if (!list) return;

    list.innerHTML = '';

    if (!items.length) {
      if (countEl)  countEl.textContent = '0';
      if (subtotal) subtotal.textContent = '0đ';
      if (shipEl)   shipEl.textContent = '-';
      if (grandEl)  grandEl.textContent = '0đ';
      list.innerHTML = `<p class="muted" style="padding:10px 0">Giỏ hàng trống. <a href="cart.html">Quay về giỏ hàng</a></p>`;
      return;
    }

    if (countEl) countEl.textContent = String(qty || items.reduce((s,i)=>s+i.qty,0));

    items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'order-item';
      row.innerHTML = `
        <img src="${it.img}" alt="">
        <p class="order-name">${it.name}</p>
        <span class="order-qty" title="Số lượng">${it.qty}</span>
        <span class="order-price">${fmt(it.subtotal)}</span>
      `;
      list.appendChild(row);
    });

    if (subtotal) subtotal.textContent = fmt(total);
    const shippingFee = 0; // demo
    if (shipEl)  shipEl.textContent = shippingFee ? fmt(shippingFee) : '-';
    if (grandEl) grandEl.textContent = fmt(total + shippingFee);
  }

  // ---- Gợi ý địa phương (input + datalist) ----
  const GEO = {
    "TP Hồ Chí Minh": {
      "Thành phố Thủ Đức": ["Linh Trung", "Hiệp Bình Chánh", "Thảo Điền", "An Khánh", "Phước Long A"],
      "Quận 1": ["Bến Nghé", "Bến Thành", "Đa Kao"],
      "Quận 3": ["Võ Thị Sáu", "Phường 7", "Phường 9"],
      "Quận 7": ["Tân Phú", "Tân Kiểng", "Tân Hưng"],
      "Bình Thạnh": ["Phường 1", "Phường 17", "Phường 25"],
      "Gò Vấp": ["Phường 1", "Phường 3", "Phường 5"]
    },
    "Bình Dương": {
      "TP Thủ Dầu Một": ["Phú Cường", "Hiệp Thành", "Phú Lợi"],
      "TP Dĩ An": ["Linh Xuân", "Dĩ An", "Tân Đông Hiệp"],
      "TP Thuận An": ["Bình Hòa", "Bình Chuẩn", "Thuận Giao"],
      "TX Bến Cát": ["Mỹ Phước", "Tân Định"],
      "TP Tân Uyên": ["Uyên Hưng", "Tân Hiệp"]
    }
  };

  const $prov = document.getElementById('province');
  const $dist = document.getElementById('district');
  const $ward = document.getElementById('ward');
  const $distList = document.getElementById('district-list');
  const $wardList = document.getElementById('ward-list');

  function setOptions(datalistEl, arr) {
    if (!datalistEl) return;
    datalistEl.innerHTML = (arr || []).map(v => `<option value="${v}"></option>`).join('');
  }

  $prov?.addEventListener('change', () => {
    const prov = ($prov.value || '').trim();
    const districts = prov && GEO[prov] ? Object.keys(GEO[prov]) : [];
    setOptions($distList, districts);
    if ($dist) $dist.value = '';
    if ($ward) $ward.value = '';
    setOptions($wardList, []);
  });

  $dist?.addEventListener('change', () => {
    const prov = ($prov?.value || '').trim();
    const dist = ($dist?.value || '').trim();
    const wards = prov && GEO[prov] && GEO[prov][dist] ? GEO[prov][dist] : [];
    setOptions($wardList, wards);
  });

  // ---- Coupon (demo) ----
  document.getElementById('applyCoupon')?.addEventListener('click', () => {
    const code = (document.getElementById('coupon')?.value || '').trim().toUpperCase();
    if (!code) return alert('Bạn chưa nhập mã.');
    alert('Mã giảm giá chỉ minh hoạ (chưa kết nối hệ thống).');
  });

  // ---- Đặt hàng (demo) ----
  document.getElementById('placeOrder')?.addEventListener('click', () => {
    const email = document.getElementById('email')?.value.trim();
    const name  = document.getElementById('fullname')?.value.trim();
    const street= document.getElementById('street')?.value.trim();
    if (!email || !name || !street) {
      alert('Vui lòng điền tối thiểu Email, Họ tên, Địa chỉ.');
      return;
    }
    alert('Đặt hàng thành công! (demo)');
    // window.location.href = 'thank-you.html';
  });

  // ---- Start ----
  renderOrder();
})();
