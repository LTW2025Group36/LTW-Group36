/* ============================================
   ADMIN JAVASCRIPT - Farmily
   Xử lý các tương tác cơ bản
   ============================================ */

// ============================================
// SIDEBAR TOGGLE (Mobile)
// ============================================
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.admin-sidebar');
const mainContent = document.querySelector('.admin-main');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  // Đóng sidebar khi click bên ngoài (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    }
  });
}

// ============================================
// ACTIVE MENU ITEM
// ============================================
function setActiveMenuItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const menuLinks = document.querySelectorAll('.admin-menu a');
  
  menuLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

setActiveMenuItem();

// ============================================
// CONFIRM DELETE
// ============================================
const deleteButtons = document.querySelectorAll('.btn-delete, [data-action="delete"]');

deleteButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    const confirmed = confirm('Bạn có chắc chắn muốn xóa mục này không?');
    if (!confirmed) {
      e.preventDefault();
    }
  });
});

// ============================================
// FORM VALIDATION
// ============================================
const forms = document.querySelectorAll('.admin-form');

forms.forEach(form => {
  form.addEventListener('submit', function(e) {
    let isValid = true;
    
    // Reset errors
    form.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('error');
    });

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.closest('.form-group').classList.add('error');
      }
    });

    // Validate email
    const emailFields = form.querySelectorAll('[type="email"]');
    emailFields.forEach(field => {
      if (field.value && !isValidEmail(field.value)) {
        isValid = false;
        field.closest('.form-group').classList.add('error');
      }
    });

    if (!isValid) {
      e.preventDefault();
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// SEARCH TABLE
// ============================================
const searchInput = document.getElementById('searchTable');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const tableRows = document.querySelectorAll('.admin-table tbody tr');

    tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
}

// ============================================
// MODAL
// ============================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal khi click overlay
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal(this.id);
    }
  });
});

// Close modal buttons
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', function() {
    const modal = this.closest('.modal');
    if (modal) {
      closeModal(modal.id);
    }
  });
});

// ============================================
// FILE UPLOAD PREVIEW
// ============================================
const fileInputs = document.querySelectorAll('input[type="file"]');

fileInputs.forEach(input => {
  input.addEventListener('change', function() {
    const file = this.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Tìm preview element
        const preview = input.closest('.form-group').querySelector('.image-preview');
        if (preview) {
          preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; border-radius: 8px;">`;
        }
      };
      
      reader.readAsDataURL(file);
    }
  });
});

// ============================================
// STATUS CHANGE
// ============================================
const statusSelects = document.querySelectorAll('.status-select');

statusSelects.forEach(select => {
  select.addEventListener('change', function() {
    const confirmed = confirm('Bạn có chắc chắn muốn thay đổi trạng thái?');
    if (!confirmed) {
      // Reset về giá trị cũ
      this.selectedIndex = 0;
    } else {
      // Hiển thị thông báo thành công
      showNotification('Đã cập nhật trạng thái thành công!', 'success');
    }
  });
});

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <div>${message}</div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// SORTABLE TABLE
// ============================================
const tableHeaders = document.querySelectorAll('.admin-table th[data-sort]');

tableHeaders.forEach(header => {
  header.style.cursor = 'pointer';
  header.innerHTML += ' <i class="fas fa-sort"></i>';
  
  header.addEventListener('click', function() {
    const table = this.closest('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const column = this.dataset.sort;
    const currentOrder = this.dataset.order || 'asc';
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    
    // Update header icon
    tableHeaders.forEach(h => h.dataset.order = '');
    this.dataset.order = newOrder;
    
    // Sort rows
    rows.sort((a, b) => {
      const aText = a.querySelector(`td:nth-child(${this.cellIndex + 1})`).textContent.trim();
      const bText = b.querySelector(`td:nth-child(${this.cellIndex + 1})`).textContent.trim();
      
      if (newOrder === 'asc') {
        return aText.localeCompare(bText, 'vi', { numeric: true });
      } else {
        return bText.localeCompare(aText, 'vi', { numeric: true });
      }
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
  });
});

// ============================================
// PRICE FORMATTING
// ============================================
const priceInputs = document.querySelectorAll('input[type="number"][data-format="price"]');

priceInputs.forEach(input => {
  input.addEventListener('blur', function() {
    if (this.value) {
      const formatted = parseInt(this.value).toLocaleString('vi-VN');
      const display = this.nextElementSibling;
      if (display && display.classList.contains('price-display')) {
        display.textContent = formatted + 'đ';
      }
    }
  });
});

// ============================================
// AUTO SAVE (LocalStorage)
// ============================================
const autoSaveForms = document.querySelectorAll('[data-autosave]');

autoSaveForms.forEach(form => {
  const formId = form.id || 'form_' + Date.now();
  
  // Load saved data
  const savedData = localStorage.getItem('autosave_' + formId);
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) input.value = data[key];
      });
    } catch (e) {}
  }
  
  // Save on input
  form.addEventListener('input', function() {
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    localStorage.setItem('autosave_' + formId, JSON.stringify(data));
  });
  
  // Clear on submit
  form.addEventListener('submit', function() {
    localStorage.removeItem('autosave_' + formId);
  });
});

// ============================================
// PRINT FUNCTION
// ============================================
function printPage() {
  window.print();
}

// ============================================
// EXPORT TABLE TO CSV
// ============================================
function exportTableToCSV(tableId, filename = 'export.csv') {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  let csv = [];
  const rows = table.querySelectorAll('tr');
  
  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th');
    const rowData = Array.from(cols).map(col => {
      return '"' + col.textContent.trim().replace(/"/g, '""') + '"';
    });
    csv.push(rowData.join(','));
  });
  
  // Download
  const csvContent = csv.join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// ============================================
// LOADING STATE
// ============================================
function showLoading(button) {
  const originalText = button.innerHTML;
  button.disabled = true;
  button.dataset.originalText = originalText;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
}

function hideLoading(button) {
  button.disabled = false;
  button.innerHTML = button.dataset.originalText || 'Submit';
}

// ============================================
// INITIALIZE
// ============================================
console.log('Admin panel loaded successfully!');