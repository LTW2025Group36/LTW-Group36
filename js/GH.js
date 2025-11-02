
(() => {
  'use strict';

  // ---- Helpers ----
  const formatVND = n => (n || 0).toLocaleString('vi-VN') + 'đ';
  const clampQty = n => {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 1) return 1;
    if (n > 99) return 99;
    return n;
  };

  // ---- Elements ----
  const cart = document.querySelector('.cart');
  const items = () => Array.from(document.querySelectorAll('.cart-item'));
  const totalEl = document.querySelector('.cart-total');
  const summaryEl = document.querySelector('.cart-summary');

  if (!cart) return; // phòng tránh nạp nhầm file ở trang khác

  // ---- Tính thành tiền 1 item & tổng giỏ ----
  function calcItemSubtotal(item) {
    const unit = Number(item.dataset.price || 0); // giá/đơn vị
    const qtyInput = item.querySelector('.qty-input');
    const qty = clampQty(qtyInput.value);
    qtyInput.value = qty; // chuẩn hóa
    const subtotal = unit * qty;
    item.querySelector('.item-subtotal').textContent = formatVND(subtotal);
    return subtotal;
  }

  function calcCartTotal() {
    const sum = items().reduce((acc, it) => acc + calcItemSubtotal(it), 0);
    if (totalEl) totalEl.textContent = formatVND(sum);
    if (summaryEl) summaryEl.style.display = items().length ? '' : 'none';
    return sum;
  }

  // ---- Sự kiện + / - / Xóa ----
  cart.addEventListener('click', (e) => {
    const plus = e.target.closest('.plus');
    const minus = e.target.closest('.minus');
    const remove = e.target.closest('.remove-btn');

    if (plus || minus) {
      const item = e.target.closest('.cart-item');
      const input = item.querySelector('.qty-input');
      const current = clampQty(input.value);
      input.value = plus ? current + 1 : Math.max(1, current - 1);
      calcItemSubtotal(item);
      calcCartTotal();
    }

    if (remove) {
      e.preventDefault();
      const item = e.target.closest('.cart-item');
      item.remove();
      calcCartTotal();
    }
  });

  // ---- Nhập tay số lượng ----
  cart.addEventListener('input', (e) => {
    const input = e.target.closest('.qty-input');
    if (!input) return;
    input.value = input.value.replace(/[^\d]/g, '');
  });

  cart.addEventListener('change', (e) => {
    const input = e.target.closest('.qty-input');
    if (!input) return;
    const item = e.target.closest('.cart-item');
    input.value = clampQty(input.value);
    calcItemSubtotal(item);
    calcCartTotal();
  });

  // ---- Khởi tạo ----
  calcCartTotal();

  // ---- Lấy dữ liệu & sang trang checkout ----
  function getCartItemsData() {
    return items().map(it => {
      const name = it.querySelector('.item-name')?.textContent?.trim() || '';
      const img  = it.querySelector('img')?.src || '';
      const price = Number(it.dataset.price || 0);
      const qty   = clampQty(it.querySelector('.qty-input')?.value || 1);
      return { name, img, price, qty, subtotal: price * qty };
    });
  }

  document.querySelector('.checkout-btn')?.addEventListener('click', () => {
    const list = getCartItemsData();
    if (!list.length) {
      alert('Giỏ hàng đang trống. Vui lòng thêm sản phẩm.');
      return;
    }
    const total = list.reduce((s, i) => s + i.subtotal, 0);
    const qtyTotal = list.reduce((s, i) => s + i.qty, 0);

    localStorage.setItem('cartItems', JSON.stringify(list));
    localStorage.setItem('cartTotal', String(total));
    localStorage.setItem('cartQtyTotal', String(qtyTotal));

    window.location.href =  'ThanhToan.html'; 
  });
})();
