// Price filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const priceRange = document.getElementById('priceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');

    if (priceRange) {
        // Update price display when slider moves
        priceRange.addEventListener('input', function() {
            const value = parseInt(this.value);
            minPrice.textContent = '0 ₫';
            maxPrice.textContent = formatPrice(value) + ' ₫';
        });

        // Format price with thousands separator
        function formatPrice(price) {
            return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    }

    // Add to cart button functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            alert('Đã thêm "' + productTitle + '" vào giỏ hàng!');
        });
    });

    // Filter button
    const filterButton = document.querySelector('.filter-button');
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            const maxPriceValue = priceRange.value;
            console.log('Lọc sản phẩm với giá tối đa:', maxPriceValue);
            alert('Đang lọc sản phẩm theo giá...');
        });
    }

    // Category filter
    const categoryLinks = document.querySelectorAll('.category-list .filter-link');
    categoryLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent;
            console.log('Lọc theo danh mục:', category);
            
            // Remove active class from all links
            categoryLinks.forEach(function(l) {
                l.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Pagination
    const pageButtons = document.querySelectorAll('.page-btn:not(.next-btn)');
    pageButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            pageButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // Next button pagination
    const nextButton = document.querySelector('.next-btn');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const currentActive = document.querySelector('.page-btn.active');
            const nextButton = currentActive.nextElementSibling;
            
            if (nextButton && nextButton.classList.contains('page-btn') && !nextButton.classList.contains('next-btn')) {
                currentActive.classList.remove('active');
                nextButton.classList.add('active');
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
});