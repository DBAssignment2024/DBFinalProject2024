// Authentication check
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
} else {
    const userId = localStorage.getItem('userId');
    console.log(userId);
    if (!userId) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('userId', payload.userId);
    }
}

// Fetch and render products
async function fetchProducts() {
    //const token = localStorage.getItem('token');
    console.log(token);
    const userId= localStorage.getItem('userId');
    console.log(userId);
    const response = await fetch('http://localhost:3000/products', {
        headers: { 'Authorization': token }
    });
    const products = await response.json();
    renderProducts(products);
}
async function getCartDetails() {
    console.log("Get cart details");
    try {
        const userId = localStorage.getItem('userId');
        //const token = localStorage.getItem('token');

        // if (!token || !userId) {
        //     console.error('User is not authenticated. Redirecting to login.');
        //     window.location.href = 'login.html'; // Redirect if not authenticated
        //     return;
        // }

        // Fetch cart details from the server
        const response = await fetch(`http://localhost:3000/cart?userId=${userId}`, {
            headers: {
                'Content-Type': 'application/json', // Include the token in the Authorization header
            }
        });

        // if (!response.ok) {
        //     throw new Error(`Error: ${response.status} ${response.statusText}`);
        // }

        cart = await response.json();
        console.log(cart);

        // Optional: Render cart details
        const cartContainer = document.querySelector('.cart-items');
        cartContainer.innerHTML = ''; // Clear existing content

        cart.forEach(item => {
            const cartItem = `
                <div class="cart-item">
                    <h3>${item.ProductName}</h3>
                    <p>Price: $${item.ProductPrice}</p>
                    <p>Quantity: ${item.Quantity}</p>
                </div>
            `;
            cartContainer.innerHTML += cartItem;
        });
    } catch (error) {
        console.error('Error fetching cart details:', error);
    }
}
function renderProducts(products) {
    const productList = document.querySelector('.product-list');
    productList.innerHTML = ''; // Clear previous content
    products.forEach(product => {
        const productCard = `
            <div class="product-card">
                <h3>${product.Name}</h3>
                <p>$${product.Price}</p>
                <button onclick="addToCart(${product.ProductID}, '${product.Name}', ${product.Price})">Add to Cart</button>
            </div>
        `;
        productList.innerHTML += productCard;
    });
}

window.onload = function () {
    console.log("Calling get Cart details");
    getCartDetails(); // Function to fetch cart details
    console.log("Calling fetch product details");
    fetchProducts();  // Function to fetch products
};
