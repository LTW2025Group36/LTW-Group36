// ---- Helpers ---- hiển thị giá VNĐ và giới hạn số lượng ----
const formatVND = n => (n || 0).toLocaleString('vi-VN') + 'đ';
const clampQty = n => {
  n = parseInt(n, 10);
  if (isNaN(n) || n < 1) return 1;
  if (n > 99) return 99;
  return n;
};

// ---- Elements ----dùng để thao tác ----
const mainImg = document.getElementById('mainImg');
const thumbs = Array.from(document.querySelectorAll('.thumb'));
const priceEl = document.getElementById('price');
const weightSelect = document.getElementById('weightSelect');
const qtyInput = document.getElementById('qtyInput');
const purchaseForm = document.getElementById('purchaseForm');
const msgEl = document.getElementById('msg');

// ---- Gallery: đổi ảnh khi bấm thumbnail ----
thumbs.forEach(btn => {
  btn.addEventListener('click', () => {
    thumbs.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    // LẤY SRC TỪ THẺ IMG BÊN TRONG BUTTON
    const imgTag = btn.querySelector('img');
    if (imgTag) {
      mainImg.src = imgTag.src;
    }
  });
});

// ---- Gallery: nút điều hướng trái/phải ----
document.querySelectorAll('.sp-photo-main .nav').forEach(nav => {
  nav.addEventListener('click', () => {
    const dir = Number(nav.dataset.dir); // -1 hoặc 1
    const idx = thumbs.findIndex(b => b.classList.contains('is-active'));
    let next = idx + dir;
    if (next < 0) next = thumbs.length - 1;
    if (next >= thumbs.length) next = 0;
    thumbs[next].click();
  });
});

// ---- Cập nhật giá khi chọn khối lượng ----
const updatePrice = () => {
  const opt = weightSelect.selectedOptions[0];
  const base = Number(opt.dataset.price || 0);
  priceEl.textContent = formatVND(base);
};
weightSelect.addEventListener('change', updatePrice);
updatePrice();

// ---- Stepper số lượng ----
document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const step = Number(btn.dataset.step);
    qtyInput.value = clampQty(Number(qtyInput.value) + step);
  });
});
qtyInput.addEventListener('input', () => {
  qtyInput.value = clampQty(qtyInput.value);
});

// ---- Submit: Thêm vào giỏ (demo) ----
purchaseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const variant = weightSelect.value;
  const price = Number(weightSelect.selectedOptions[0].dataset.price);
  const qty = clampQty(qtyInput.value);

  const cartItem = {
    id: 'SP-DEMO-001-' + variant,
    name: 'Tên Sản Phẩm DEMO',
    variantKg: Number(variant),
    unitPrice: price,
    qty,
    img: mainImg.src
  };

  console.log('Add to cart:', cartItem);

  msgEl.textContent = `Đã thêm ${qty} × ${cartItem.name} (${weightSelect.selectedOptions[0].text}) vào giỏ!`;

  const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
  items.push(cartItem);
  localStorage.setItem('cartItems', JSON.stringify(items));

  const oldTotal = Number(localStorage.getItem('cartTotal') || '0');
  localStorage.setItem('cartTotal', String(oldTotal + price * qty));
});