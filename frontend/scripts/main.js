const API_URL = 'https://ilydanyxx-shop-production.up.railway.app';

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
}

async function fetchProducts() {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    const container = document.getElementById('products');
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${p.imageUrl}" alt="">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <p>Ціна: ${p.price} грн</p>
            <button onclick="addToCart('${p._id}', '${p.title}', ${p.price})">Додати в кошик</button>
        `;
        container.appendChild(div);
    });
}

function addToCart(id, title, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Додано в кошик!');
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart');
    let total = 0;
    cart.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${item.title}</h3>
            <p>Кількість: ${item.quantity}</p>
            <p>Сума: ${item.price * item.quantity} грн</p>
            <hr>
        `;
        container.appendChild(div);
        total += item.price * item.quantity;
    });
    document.getElementById('total').innerText = `Загальна сума: ${total} грн`;
}

async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.length) return alert('Кошик порожній!');
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';

    const products = cart.map(c => ({
        productId: c.id,
        quantity: c.quantity
    }));
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ products, totalPrice })
    });

    alert('Замовлення оформлено!');
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
}

async function login(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', data.user.isAdmin);
        localStorage.setItem('userId', data.user.id);
        if (data.user.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        alert(data.message);
    }
}

async function register(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    alert('Успішна реєстрація! Тепер увійдіть.');
    window.location.href = 'login.html';
}

async function addProduct(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const token = localStorage.getItem('token');

    await fetch(`${API_URL}/products/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: JSON.stringify({ title, description, price, imageUrl })
    });

    alert('Товар додано!');
    window.location.reload();
}
