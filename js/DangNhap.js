document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if(email === "" || password === "") {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }
    // Lấy danh sách người dùng đã đăng ký (lưu trong localStorage)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUsers = users.find(u => u.email === email && u.password === password);

    if(foundUsers) {
        alert("Đăng nhập thành công!");
        //Save login state
        localStorage.setItem("loggedInUser", JSON.stringify(foundUsers));
        window.location.href = "index.html"; //chyển đến trang chính
    } else {
        alert("Email hoặc mật khẩu không đúng!")
    }

})