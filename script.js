// Sample product data
const products = [
    {
        id: 1,
        name: "Premium Leather Sneakers",
        price: 89.99,
        originalPrice: 120.00,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
        category: "shoes",
        sizes: ["7", "8", "9", "10", "11"],
        rating: 4.5,
        isNew: true,
        isOnSale: true,
        description: "Crafted from premium leather with exceptional comfort and style."
    },
    {
        id: 2,
        name: "Elegant Summer Dress",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        category: "women",
        sizes: ["XS", "S", "M", "L", "XL"],
        rating: 4.8,
        isNew: true,
        description: "Perfect for summer occasions with breathable fabric and elegant design."
    },
    {
        id: 3,
        name: "Classic Men's Blazer",
        price: 129.99,
        originalPrice: 180.00,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        category: "men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        rating: 4.6,
        isOnSale: true,
        description: "Timeless blazer perfect for professional and formal occasions."
    },
    {
        id: 4,
        name: "Kids Rainbow T-Shirt",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400",
        category: "children",
        sizes: ["4", "6", "8", "10", "12"],
        rating: 4.9,
        isNew: true,
        description: "Colorful and comfortable t-shirt that kids will love."
    },
    {
        id: 5,
        name: "Designer Handbag",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
        category: "accessories",
        sizes: ["One Size"],
        rating: 4.7,
        description: "Luxury handbag with premium materials and elegant design."
    },
    {
        id: 6,
        name: "Running Shoes",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        category: "shoes",
        sizes: ["6", "7", "8", "9", "10", "11", "12"],
        rating: 4.4,
        isOnSale: true,
        description: "High-performance running shoes with advanced cushioning technology."
    },
    {
        id: 7,
        name: "Casual Women's Jeans",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
        category: "women",
        sizes: ["24", "26", "28", "30", "32", "34"],
        rating: 4.3,
        description: "Comfortable and stylish jeans perfect for everyday wear."
    },
    {
        id: 8,
        name: "Men's Polo Shirt",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        category: "men",
        sizes: ["S", "M", "L", "XL"],
        rating: 4.5,
        description: "Classic polo shirt made from breathable cotton blend."
    }
];

// Global state
let cart = [];
let currentProducts = [...products];
let currentCategory = 'all';
let currentSort = 'name';

// DOM elements
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const sortFilter = document.getElementById('sortFilter');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const productModal = document.getElementById('productModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    renderProducts();
    setupEventListeners();
    updateCartDisplay();
});

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';
    
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    
    updateThemeIcon(!isDark);
}

function updateThemeIcon(isDark) {
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

// Product rendering
function renderProducts() {
    if (currentProducts.length === 0) {
        productGrid.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }
    
    productGrid.innerHTML = currentProducts.map(product => {
        const discountPercentage = product.originalPrice 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;
            
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    
                    <div class="product-badges">
                        ${product.isNew ? '<span class="badge badge-new">NEW</span>' : ''}
                        ${product.isOnSale ? `<span class="badge badge-sale">-${discountPercentage}%</span>` : ''}
                    </div>
                    
                    <button class="like-btn" onclick="toggleLike(event, ${product.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    
                    <button class="quick-add" onclick="quickAddToCart(event, ${product.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        Quick Add
                    </button>
                </div>
                
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    
                    <div class="product-price">
                        <span class="price-current">$${product.price}</span>
                        ${product.originalPrice ? `<span class="price-original">$${product.originalPrice}</span>` : ''}
                    </div>
                    
                    <div class="product-rating">
                        ${generateStars(product.rating)}
                        <span class="rating-text">(${product.rating})</span>
                    </div>
                    
                    <div class="product-sizes">
                        ${product.sizes.slice(0, 4).map(size => `
                            <button class="size-btn" onclick="selectSize(event, '${size}')">${size}</button>
                        `).join('')}
                        ${product.sizes.length > 4 ? `<span class="size-more">+${product.sizes.length - 4}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click listeners to product cards
    productGrid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.like-btn, .quick-add, .size-btn')) {
                const productId = parseInt(card.dataset.productId);
                openProductModal(productId);
            }
        });
    });
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }
    
    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star empty">☆</span>';
    }
    
    return stars;
}

// Product filtering and sorting
function filterProducts() {
    let filtered = [...products];
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(product => product.category === currentCategory);
    }
    
    // Filter by search query
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    // Sort products
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });
    
    currentProducts = filtered;
    renderProducts();
}

// Cart management
function addToCart(productId, size = null, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const selectedSize = size || product.sizes[0];
    const existingItem = cart.find(item => item.id === productId && item.size === selectedSize);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Modal management
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const discountPercentage = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        
        <div class="modal-details">
            <div class="modal-category">${product.category}</div>
            <h2 class="modal-name">${product.name}</h2>
            
            <div class="modal-price">
                <span class="price-current" style="font-size: 2rem;">$${product.price}</span>
                ${product.originalPrice ? `<span class="price-original" style="font-size: 1.25rem;">$${product.originalPrice}</span>` : ''}
            </div>
            
            <div class="modal-rating">
                ${generateStars(product.rating)}
                <span class="rating-text">(${product.rating}) reviews</span>
            </div>
            
            <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">
                ${product.description}
            </p>
            
            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 1rem;">Size</h3>
                <div class="product-sizes">
                    ${product.sizes.map(size => `
                        <button class="size-btn modal-size-btn" onclick="selectModalSize(event, '${size}')">${size}</button>
                    `).join('')}
                </div>
            </div>
            
            <div class="quantity-selector">
                <button class="quantity-btn" onclick="changeQuantity(-1)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <span class="quantity-value" id="modalQuantity">1</span>
                <button class="quantity-btn" onclick="changeQuantity(1)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="addToCartFromModal(${product.id})" style="flex: 1;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Add to Cart
                </button>
                
                <button class="btn btn-outline" onclick="toggleModalLike(${product.id})" style="padding: 0.75rem;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // Select first size by default
    const firstSizeBtn = modalBody.querySelector('.modal-size-btn');
    if (firstSizeBtn) {
        firstSizeBtn.classList.add('selected');
    }
    
    productModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    productModal.classList.remove('show');
    document.body.style.overflow = '';
}

// Modal interaction functions
function selectModalSize(event, size) {
    event.stopPropagation();
    modalBody.querySelectorAll('.modal-size-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function changeQuantity(change) {
    const quantityElement = document.getElementById('modalQuantity');
    let quantity = parseInt(quantityElement.textContent) + change;
    quantity = Math.max(1, quantity);
    quantityElement.textContent = quantity;
}

function addToCartFromModal(productId) {
    const selectedSizeBtn = modalBody.querySelector('.modal-size-btn.selected');
    const size = selectedSizeBtn ? selectedSizeBtn.textContent : null;
    const quantity = parseInt(document.getElementById('modalQuantity').textContent);
    
    addToCart(productId, size, quantity);
    closeProductModal();
}

function toggleModalLike(productId) {
    // Add visual feedback for like
    showNotification('Added to wishlist!');
}

// Utility functions
function quickAddToCart(event, productId) {
    event.stopPropagation();
    addToCart(productId);
}

function toggleLike(event, productId) {
    event.stopPropagation();
    const likeBtn = event.currentTarget;
    likeBtn.classList.toggle('liked');
    
    if (likeBtn.classList.contains('liked')) {
        showNotification('Added to wishlist!');
    } else {
        showNotification('Removed from wishlist!');
    }
}

function selectSize(event, size) {
    event.stopPropagation();
    const sizeBtn = event.target;
    const productCard = sizeBtn.closest('.product-card');
    
    productCard.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
    sizeBtn.classList.add('selected');
}

function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: var(--shadow-lg);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event listeners setup
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('show');
    });
    
    // Search
    searchInput.addEventListener('input', filterProducts);
    
    // Sort filter
    sortFilter.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
    });
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            currentCategory = link.dataset.category;
            filterProducts();
            
            // Close mobile menu
            menuToggle.classList.remove('active');
            nav.classList.remove('show');
        });
    });
    
    // Modal close events
    modalClose.addEventListener('click', closeProductModal);
    modalBackdrop.addEventListener('click', closeProductModal);
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal.classList.contains('show')) {
            closeProductModal();
        }
    });
    
    // Cart button (placeholder)
    cartBtn.addEventListener('click', () => {
        showNotification(`Cart has ${cart.length} item(s)`);
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
