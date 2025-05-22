// cart.js

// Utility function to get cart from sessionStorage
function getCart() {
    return JSON.parse(sessionStorage.getItem('cart')) || [];
}

// Utility function to save cart to sessionStorage
function saveCart(cart) {
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in all navbars
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

// Add to cart event (for product pages)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const id = e.target.dataset.id;
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);

        let cart = getCart();
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        saveCart(cart);
        updateCartCount();
        alert(`${name} added to cart!`);
    }
});

// Render cart items on cart.html
function renderCartTable() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    if (!cartItems || !totalAmount) return;

    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>`;
        totalAmount.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary quantity-btn" data-action="increase" data-id="${item.id}">+</button>
            </td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger remove-btn" data-id="${item.id}">Remove</button>
            </td>
        `;
        cartItems.appendChild(row);
    });

    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Handle quantity and remove buttons in cart
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quantity-btn')) {
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;
        let cart = getCart();
        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        saveCart(cart);
        renderCartTable();
        updateCartCount();
    }
    if (e.target.classList.contains('remove-btn')) {
        const id = e.target.dataset.id;
        let cart = getCart().filter(i => i.id !== id);
        saveCart(cart);
        renderCartTable();
        updateCartCount();
    }
    if (e.target.id === 'clear-cart-btn') {
        saveCart([]);
        renderCartTable();
        updateCartCount();
    }
});

// On page load, update cart count and render cart if on cart page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    if (document.getElementById('cart-items')) {
        renderCartTable();
    }
});
