document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();

    const ho = document.querySelectorAll('input[type="text"]')[0].value.trim();
    const ten = document.querySelectorAll('input[type="text"]')[1].value.trim();
    const sdt = document.querySelectorAll('input[type="text"]')[2].value.trim();
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if (!ho || !ten || !sdt || !email || !password) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Lấy danh sách người dùng đã đăng ký (nếu có)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra trùng email
    const existed = users.some(u => u.email === email);
    if (existed) {
        alert("Email này đã được đăng ký!");
        return;
    }

    // Tạo user mới
    const newUser = { ho, ten, sdt, email, password };
    users.push(newUser);

    // Lưu lại
    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
    window.location.href = "login.html";
});
