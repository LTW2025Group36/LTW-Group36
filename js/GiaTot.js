
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            alert("Món đã được thêm vào giỏ hàng.");
        });
    });
});
