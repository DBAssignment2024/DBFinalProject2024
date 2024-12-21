function rateProduct(star) {
    let stars = document.querySelectorAll('.star');
    stars.forEach((starElem, index) => {
        if (index < star) {
            starElem.style.color = 'gold';
        } else {
            starElem.style.color = 'gray';
        }
    });
}
// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to Cart Function
// function addToCart(productId, productName, productPrice) {
//     // Check if the product is already in the cart
//     const existingProduct = cart.find(item => item.id === productId);

//     if (existingProduct) {
//         // Increase the quantity if the product is already in the cart
//         existingProduct.quantity += 1;
//     } else {
//         // Add new product to the cart
//         cart.push({
//             id: productId,
//             name: productName,
//             price: productPrice,
//             quantity: 1
//         });
//     }

//     // Save cart to local storage
//     localStorage.setItem('cart', JSON.stringify(cart));

//     // Show a confirmation message
//     alert(`${productName} has been added to your cart!`);
// }
// Add to Cart Function
function addToCart(productId, productName, productPrice) {
    const userId = localStorage.getItem('userId'); // Replace with dynamic user authentication if applicable
    const quantity = 1; // Default quantity for adding an item
    console.log("Inside Js add cart");

    fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            productId: productId,
            productName: productName,
            productPrice: productPrice,
            // Category: category,
            quantity: quantity,
        }),
    })
        .then(response => response.json())
        .then(data => {
            alert(`${productName} has been added to your cart!`);
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart');
        });
}

function getCartDetails()
{

}

function deletefromCart()
{
    fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
        }),
    })
        .then(response => response.json())
        .then(data => {
            alert(`Cart is empty`);
        })
        .catch(error => {
            console.error('Error in clearing cart:', error);
            alert('Failed to clear the cart');
        });
}


// Example: Attach this function to the "Add to Cart" button
// Usage: <button onclick="addToCart(1, 'Product 1', 19.99)">Add to Cart</button>


function submitReview() {
    const reviewText = document.getElementById('review-text').value;
    const rating = getSelectedRating(); // Implement logic to get selected rating (1-5 stars)
    const productId = 1; // The ID of the product being reviewed
    
    fetch('http://localhost:3000/submitReview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: productId,
            rating: rating,
            reviewText: reviewText
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('Review submitted successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting review');
    });
}
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        req.user = user; // Attach the user to the request
        next();
    });
}

// Example of a protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}` });
});


function placeOrder(event) {
    event.preventDefault();
    let quantity = document.getElementById('quantity').value;
    let address = document.getElementById('address').value;
    let payment = document.getElementById('payment').value;
    alert(`Order placed! Quantity: ${quantity}, Address: ${address}, Payment: ${payment}`);
}
// Fetch products from backend
function fetchProducts() {
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.querySelector('.product-list');
            productList.innerHTML = ''; // Clear existing products

            // Render products
            products.forEach(product => {
                const productCard = `
                    <div class="product-card">
                        <img src="${product.ImageURL}" alt="${product.ProductName}">
                        <h3>${product.ProductName}</h3>
                        <p>$${product.Price}</p>
                        <button onclick="addToCart(${product.ProductId}, '${product.ProductName}', ${product.Price})">
                            Add to Cart
                        </button>
                    </div>
                `;
                productList.innerHTML += productCard;
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Call fetchProducts when the page loads
window.onload = fetchProducts;

