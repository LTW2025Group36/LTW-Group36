(() => {
  'use strict';

  // ---- Hàm tiện ích ----
  
  // Format số thành tiền VND (VD: 50000 → "50.000đ")
  const fmt = n => (n || 0).toLocaleString('vi-VN') + 'đ';

  // Lấy dữ liệu giỏ hàng từ localStorage
  function loadCartFromStorage() {
    try {
      return {
        items: JSON.parse(localStorage.getItem('cartItems') || '[]'),  // Danh sách sản phẩm
        total: Number(localStorage.getItem('cartTotal') || 0),         // Tổng tiền
        qty:   Number(localStorage.getItem('cartQtyTotal') || 0),      // Tổng số lượng
      };
    } catch {
      // Nếu localStorage lỗi, trả về giỏ hàng rỗng
      return { items: [], total: 0, qty: 0 };
    }
  }

  // ---- Hiển thị tóm tắt đơn hàng ----
  function renderOrder() {
    // Lấy dữ liệu giỏ hàng
    const { items, total, qty } = loadCartFromStorage();

    // Lấy các phần tử HTML
    const list      = document.getElementById('orderItems');      // Container danh sách SP
    const countEl   = document.getElementById('itemCount');       // Số lượng items
    const subtotal  = document.getElementById('subtotalText');    // Tạm tính
    const shipEl    = document.getElementById('shippingFeeText'); // Phí ship
    const grandEl   = document.getElementById('grandTotalText');  // Tổng cộng

    // Nếu không tìm thấy container, thoát
    if (!list) return;

    // Xóa nội dung cũ
    list.innerHTML = '';

    // Nếu giỏ hàng trống
    if (!items.length) {
      if (countEl)  countEl.textContent = '0';
      if (subtotal) subtotal.textContent = '0đ';
      if (shipEl)   shipEl.textContent = '-';
      if (grandEl)  grandEl.textContent = '0đ';
      list.innerHTML = `<p class="muted" style="padding:10px 0">Giỏ hàng trống. <a href="cart.html">Quay về giỏ hàng</a></p>`;
      return;
    }

    // Hiển thị tổng số lượng (hoặc tính lại nếu không có)
    if (countEl) countEl.textContent = String(qty || items.reduce((s,i)=>s+i.qty,0));

    // Duyệt qua từng sản phẩm và tạo HTML
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

    // Hiển thị tiền
    if (subtotal) subtotal.textContent = fmt(total);
    const shippingFee = 0; // Phí ship = 0
    if (shipEl)  shipEl.textContent = shippingFee ? fmt(shippingFee) : '-';
    if (grandEl) grandEl.textContent = fmt(total + shippingFee);
  }

  // ---- Xử lý nút đặt hàng ----
  document.getElementById('placeOrder')?.addEventListener('click', () => {
    // Lấy giá trị các trường input
    const email = document.getElementById('email')?.value.trim();
    const name  = document.getElementById('fullname')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const street= document.getElementById('street')?.value.trim();

    // Kiểm tra nếu thiếu thông tin bắt buộc
    if (!email || !name || !phone || !street) {
      alert('Vui lòng điền tối thiểu Email, Họ tên, Số điện thoại, Địa chỉ.');
      return; // Dừng lại, không xử lý tiếp
    }

    // Nếu đủ thông tin → Hiển thị thành công
    alert('Thanh toán thành công!');
    
    // Có thể chuyển sang trang cảm ơn (đang comment)
    // window.location.href = 'thank-you.html';
  });

  // ---- Khởi chạy ----
  renderOrder(); // Hiển thị đơn hàng khi load trang
})();