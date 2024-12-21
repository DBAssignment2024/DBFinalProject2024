
        // Function to fetch products from backend and render them dynamically
        let cart=[];
        async function fetchProducts() {
            try {
                const response = await fetch('http://localhost:3000/products');
                const products = await response.json();

                const productList = document.querySelector('.product-list');
                productList.innerHTML = ''; // Clear any existing content

                products.forEach(product => {
                    const productCard = `
                        <div class="product-card">
                            <h3>${product.Name}</h3>
                            <p>$${product.Price}</p>
                            <button onclick="addToCart(${product.ProductID}, '${product.Name.replace(/'/g, "\\'")}', ${product.Price}, ${product.Category})">
                                Add to Cart
                            </button>
                        </div>
                    `;
                    productList.innerHTML += productCard;
                });
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        // async function getCartDetails() {
        //     try {
        //         const userId=localStorage.getItem('userId');
        //         const response = await fetch(`http://localhost:3000/cart?userId=${userId}`);
        //         cart = await response.json();
        //         console.log(cart);
        //         //const productList = document.querySelector('.product-list');
        //         //productList.innerHTML = ''; // Clear any existing content

        //         // products.forEach(product => {
        //         //     const productCard = `
        //         //         <div class="product-card">
        //         //             <h3>${product.Name}</h3>
        //         //             <p>$${product.Price}</p>
        //         //             <button onclick="addToCart(${product.ProductID}, '${product.Name.replace(/'/g, "\\'")}', ${product.Price}, ${product.Category})">
        //         //                 Add to Cart
        //         //             </button>
        //         //         </div>
        //         //     `;
        //         //     productList.innerHTML += productCard;
        //         // });
        //     } catch (error) {
        //         console.error('Error fetching products:', error);
        //     }
        // }
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

        // <img src="${product.ImageURL}" alt="${product.ProductName}">

        // Function to handle Add to Cart button click
        // function addToCart(productId, productName, productPrice) {
        //     const userId = 1; // Replace with dynamic user ID if authentication is implemented
        //     const quantity = 1; // Default quantity for adding an item
        //     console.log("Inside HTMl add cart");
        //     fetch('http://localhost:3000/cart', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ userId, productId, productName, productPrice, quantity })
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //         alert(`${productName} has been added to your cart!`);
        //     })
        //     .catch(error => {
        //         console.error('Error adding to cart:', error);
        //         alert('Failed to add item to cart');
        //     });
        // }
        function addToCart(productId, productName, productPrice) {
        let quantity = 1;
        const userId = localStorage.getItem('userId'); // Replace with dynamic user authentication if applicable
        // const quantity = 1; // Default quantity for adding an item
        let existingProduct;
        if(cart.length > 0){
        existingProduct = cart.find(item => item.id === productId);
        }
        if (existingProduct) {
            // Increase the quantity if the product is already in the cart
            quantity = existingProduct.quantity + 1;
        } else {
            // Add new product to the cart
            // cart.push({
            //     id: productId,
            //     name: productName,
            //     price: productPrice,
            //     quantity: 1
            // });
        }
        
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

//const express = require('express');
const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const router = express.Router();

// Azure Blob Storage Configuration
const AZURE_STORAGE_CONNECTION_STRING = "YourAzureStorageConnectionString";
const CONTAINER_NAME = "cart-data";

// Pass the database pool instance from server.js
module.exports = (pool) => {
    // Fetch Cart Details
    router.get('/cart', async (req, res) => {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        try {
            const result = await pool.request()
                .input('UserId', sql.Int, userId)
                .query(`
                    SELECT ProductId, ProductName, ProductPrice, Quantity, (ProductPrice * Quantity) AS TotalPrice
                    FROM Cart
                    WHERE UserId = @UserId;
                `);
            res.json(result.recordset);
        } catch (err) {
            console.error('Error fetching cart details:', err);
            res.status(500).json({ error: 'Failed to retrieve cart details' });
        }
    });

    // Export Cart to Azure Blob Storage
    router.post('/export-cart', async (req, res) => {
        const userId = req.body.userId; // Pass userId in the request body
        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        try {
            const result = await pool.request()
                .input('UserId', sql.Int, userId)
                .query(`
                    SELECT ProductId, ProductName, ProductPrice, Quantity, (ProductPrice * Quantity) AS TotalPrice
                    FROM Cart
                    WHERE UserId = @UserId;
                `);

            const cartItems = result.recordset;

            if (cartItems.length === 0) {
                throw new Error('Cart is empty. No data to export.');
            }

            // Convert cart items to JSON
            const cartJson = JSON.stringify(cartItems, null, 2);
            const fileName = `cart_${userId}_${Date.now()}.json`;

            // Write JSON to a temporary file
            fs.writeFileSync(fileName, cartJson);

            // Connect to Azure Blob Storage
            const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
            const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

            // Ensure the container exists
            await containerClient.createIfNotExists();

            // Upload JSON file to Azure Blob Storage
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);
            await blockBlobClient.uploadFile(fileName);

            // Clean up temporary file
            fs.unlinkSync(fileName);

            res.json({ message: `Cart data exported to Azure Blob Storage as ${fileName}` });
        } catch (err) {
            console.error('Error exporting cart to Azure Blob Storage:', err);
            res.status(500).json({ error: 'Failed to export cart data' });
        }
    });

    return router;
};


        // Fetch and render products when the page loads
        window.onload = function () {
        console.log("Calling get Cart details");
        getCartDetails(); // Function to fetch cart details
        console.log("Calling fetch product details");
        fetchProducts();  // Function to fetch products
    };
