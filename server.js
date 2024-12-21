// // server.js
// const express = require('express');
// const sql = require('mssql');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json());

// // Azure SQL Database Configuration
// const config = {
//     user: 'CloudSA10a2445c', // Your Azure SQL username
//     password: 'DBProject@2024', // Your Azure SQL password
//     server: 'scn.database.windows.net',
//     database: 'SupplyChain',
//     options: {
//         encrypt: true, // Required for Azure
//         trustServerCertificate: false,
//     },
// };

// // Connect to Azure SQL Database
// sql.connect(config).then(pool => {
//     console.log('Connected to Azure SQL Database');
    
//     // API to get products
//     app.get('/products', async (req, res) => {
//         try {
//             const result = await pool.request().query('SELECT * FROM PRODUCT');
//             res.json(result.recordset); // Send back the product data
//         } catch (err) {
//             console.error(err);
//             res.status(500).send('Error retrieving products');
//         }
//     });

//     // API to place an order
//     app.post('/placeOrder', async (req, res) => {
//         const { productId, quantity, address, paymentMethod } = req.body;
//         try {
//             const result = await pool.request()
//                 .input('productId', sql.Int, productId)
//                 .input('quantity', sql.Int, quantity)
//                 .input('address', sql.NVarChar, address)
//                 .input('paymentMethod', sql.NVarChar, paymentMethod)
//                 .query(`
//                     INSERT INTO Orders (ProductId, Quantity, ShippingAddress, PaymentMethod)
//                     VALUES (@productId, @quantity, @address, @paymentMethod)
//                 `);
//             res.json({ message: 'Order placed successfully!' });
//         } catch (err) {
//             console.error(err);
//             res.status(500).send('Error placing order');
//         }
//     });

//     // API to submit a review and rating
//     app.post('/submitReview', async (req, res) => {
//         const { productId, rating, reviewText } = req.body;
//         try {
//             const result = await pool.request()
//                 .input('productId', sql.Int, productId)
//                 .input('rating', sql.Int, rating)
//                 .input('reviewText', sql.NVarChar, reviewText)
//                 .query(`
//                     INSERT INTO Reviews (ProductId, Rating, ReviewText)
//                     VALUES (@productId, @rating, @reviewText)
//                 `);
//             res.json({ message: 'Review submitted successfully!' });
//         } catch (err) {
//             console.error(err);
//             res.status(500).send('Error submitting review');
//         }
//     });
// }).catch(err => {
//     console.error('Error connecting to Azure SQL Database', err);
// });

// // Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
app.use(bodyParser.json());


//const express = require('express');
//const bodyParser = require('body-parser');
//const sql = require('mssql');

//const app = express();
//app.use(bodyParser.json());


// const express = require('express');
const path = require('path');
// const sql = require('mssql'); // Your Azure SQL configuration

// const app = express();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));


//const express = require('express');
const cors = require('cors');
//const sql = require('mssql');
//const { authenticateToken } = require('./auth'); // Optional if you split auth logic

//const app = express();
//app.use(express.json());
//app.use(cors());

// Database Configuration
const config = {
    user: 'CloudSA10a2445c', // Your Azure SQL username
    password: 'DBProject@2024', // Your Azure SQL password
    server: 'scn.database.windows.net',
    database: 'SupplyChain',
    options: {
        encrypt: true, // Required for Azure
        trustServerCertificate: false,
    },
};


// sql.connect(config)
//     .then((connection) => {
//         pool = connection;
//         console.log('Connected to Azure SQL Database');
//     })
//     .catch((err) => console.error('Database connection failed:', err));

// Use orders.js routes
// const ordersRoutes = require('/public/order.js')(pool);
// app.use('/', ordersRoutes);

// Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });





let pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Replace with a secure key

// Login endpoint








// const express = require('express');
//const path = require('path');
// const sql = require('mssql'); // Your Azure SQL configuration

// const app = express();

// Middleware to serve static files
//app.use(express.static(path.join(__dirname, 'public')));

// Existing API routes (e.g., /cart, /products, etc.)
// sql.connect(config).then(pool => {
//     console.log('Connected to Azure SQL Database');

//     app.post('/cart', async (req, res) => {
//         const { userId, productId, productName, productPrice, quantity } = req.body;
//         try {
//             await pool.request()
//                 .input('userId', sql.Int, userId)
//                 .input('productId', sql.Int, productId)
//                 .input('productName', sql.NVarChar, productName)
//                 .input('productPrice', sql.Decimal(10, 2), productPrice)
//                 .input('quantity', sql.Int, quantity)
//                 .query(`
//                     INSERT INTO Cart (UserId, ProductId, ProductName, ProductPrice, Quantity)
//                     VALUES (@userId, @productId, @productName, @productPrice, @quantity)
//                     ON DUPLICATE KEY UPDATE Quantity = Quantity + @quantity;
//                 `);
//             res.json({ message: 'Item added to cart' });
//         } catch (err) {
//             console.error(err);
//             res.status(500).send('Error adding item to cart');
//         }
//     });

//     app.get('/products', async (req, res) => {
//         try {
//             const result = await pool.request().query('SELECT * FROM Products');
//             res.json(result.recordset);
//         } catch (err) {
//             console.error(err);
//             res.status(500).send('Error fetching products');
//         }
//     });

//     // Other API routes...
// }).catch(err => {
//     console.error('Database connection error:', err);
// });

// // Start the server
// //const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });


function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    console.log(token);
    console.log(SECRET_KEY);
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });

        req.user = user; // Attach the user to the request
        next();
    });
}


// Azure SQL Database Configuration
// const config = {
//     user: 'your-database-username',
//     password: 'your-database-password',
//     server: 'your-database-server.database.windows.net',
//     database: 'your-database-name',
//     options: {
//         encrypt: true,
//         trustServerCertificate: false,
//     },
// };

// const config = {
//     user: 'CloudSA10a2445c', // Your Azure SQL username
//     password: 'DBProject@2024', // Your Azure SQL password
//     server: 'scn.database.windows.net',
//     database: 'SupplyChain',
//     options: {
//         encrypt: true, // Required for Azure
//         trustServerCertificate: false,
//     },
// };

// Connect to Azure SQL
sql.connect(config).then(pool => {
    console.log('Connected to Azure SQL Database');

    // Fetch all products
    app.get('/products', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM PRODUCT');
            res.json(result.recordset); // Return all products
            console.log(result);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error fetching products');
        }
    });

    // Fetch a single product by ID
    app.get('/products/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Products WHERE ProductId = @id');
            res.json(result.recordset[0]); // Return the product
        } catch (err) {
            console.error(err);
            res.status(500).send('Error fetching product');
        }
    });
    // Signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await (await pool).request()
            .input('Username', sql.NVarChar, username)
            .input('PasswordHash', sql.NVarChar, hashedPassword)
            .query('INSERT INTO CUSTOMER (Username, PasswordHash) VALUES (@Username, @PasswordHash)');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const result = await (await pool).request()
            .input('Username', sql.NVarChar, username)
            .query('SELECT * FROM Users WHERE Username = @Username');

        const user = result.recordset[0];
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.UserId, username: user.Username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error logging in' });
    }
});

app.post('/export-cart', async (req, res) => {
    console.log(req);
    console.log(res);
    //const userId = req.user.userId; // Extracted from the authenticated user's token
    const userId = localStorage.getItem('userId');
    try {
        const message = await exportCartToAzure(userId);
        res.json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



    

    // Add item to cart
    app.post('/cart', async (req, res) => {
        const { userId, productId, productName, productPrice, quantity } = req.body;
        console.log("Adding to cart");
        console.log(req.body);
        try {
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('productId', sql.Int, productId)
                .input('productName', sql.NVarChar, productName)
                .input('productPrice', sql.Decimal(10, 2), productPrice)
                .input('quantity', sql.Int, quantity)
               
                .query(`
                    MERGE INTO CART AS target
                    USING (SELECT @userId AS UserId, @productId AS ProductId) AS source
                    ON target.UserId = source.UserId AND target.ProductId = source.ProductId
                    WHEN MATCHED THEN
                        UPDATE SET Quantity = target.Quantity + @quantity
                    WHEN NOT MATCHED THEN
                        INSERT (UserId, ProductId, ProductName, ProductPrice, Quantity )
                        VALUES (@userId, @productId, @productName, @productPrice, @quantity );
                `);
            res.json({ message: 'Item added to cart' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error adding item to cart');
        }
    });

    // Get cart
    app.get('/cart', async (req, res) => {
        const { userId } = req.query;
        console.log("get function for cart");
        try {
            console.log("get function for cart tryy block");
            const result = await pool.request()
                .input('userId', sql.Int, userId)
                .query('SELECT * FROM Cart WHERE UserId = @userId');
            res.json(result.recordset);
        } catch (err) {
            console.error(err);
            res.status(500).send('Error fetching cart');
        }
    });

    // Update cart item quantity
    app.put('/cart', async (req, res) => {
        const { userId, productId, quantity } = req.body;
        try {
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('productId', sql.Int, productId)
                .input('quantity', sql.Int, quantity)
                .query(`
                    UPDATE Cart
                    SET Quantity = @quantity
                    WHERE UserId = @userId AND ProductId = @productId;
                `);
            res.json({ message: 'Cart updated' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating cart');
        }
    });

    // Clear cart
    app.delete('/cart', async (req, res) => {
        const { userId } = req.body;
        try {
            await pool.request()
                .input('userId', sql.Int, userId)
                .query('DELETE FROM Cart WHERE UserId = @userId');
            res.json({ message: 'Cart cleared' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error clearing cart');
        }
    });

}).catch(err => {
    console.error('Database connection error', err);
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
