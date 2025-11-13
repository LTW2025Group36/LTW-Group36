function loadComponent(id, url) {
    fetch(url) // Tải nội dung file
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data; // Chèn vào thẻ có ID tương ứng
        });
}

// Tải Sidebar vào thẻ <div id="admin-sidebar"></div>
loadComponent('admin-sidebar', '../admin/sidebar.html');

// Tải Header vào thẻ <div id="admin-header"></div>
loadComponent('admin-header', '../admin/header.html');