document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    if(email === "" || password === "") {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }


    if(email === demoEmail && password === demoPassword) {
        alert("Đăng nhập thành công!");
        window.location.href = "index.html"; // chuyển đến trang chính
    } else {
        alert("Email hoặc mật khẩu không đúng!");
    }
})