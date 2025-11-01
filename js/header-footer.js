function loadComponent(id, url) {
    fetch(url) // Tải nội dung file
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data; // Chèn vào thẻ có ID tương ứng
        });
}

// Tải Header vào thẻ <div id="main-header"></div>
loadComponent('main-header', 'header.html'); 

// Tải Footer vào thẻ <div id="main-footer"></div>
loadComponent('main-footer', 'footer.html');