const express = require('express');
const mysql = require('mysql2/promise'); // Install this: npm install mysql2
const cors = require('cors'); // Install this: npm install cors
const app = express();

app.use(cors());
app.use(express.json());

// --- SQL CONNECTION CONFIG ---
// Update these once you get the details from the SQL dev
const dbConfig = {
    host: 'YOUR_SQL_HOST',
    user: 'YOUR_SQL_USERNAME',
    password: 'YOUR_SQL_PASSWORD',
    database: 'YOUR_DATABASE_NAME'
};

// --- THE API ENDPOINT ---
app.get('/api/get-price', async (req, res) => {
    const { product, size } = req.query;
    
    // In a real scenario, you'd get the user ID from the login session
    // For this example, we assume we know their tier.
    const userTierColumn = 'price_tier_1'; 

    try {
        const connection = await mysql.createConnection(dbConfig);

        // SCRATCH THE PRICE: Use the product name and size to find the price
        const [rows] = await connection.execute(
            `SELECT ${userTierColumn} AS price FROM products WHERE product_name = ? AND size = ?`,
            [product, size]
        );

        await connection.end();

        if (rows.length > 0) {
            res.json({ success: true, price: rows[0].price });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error('SQL Error:', error);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Bridge running on http://localhost:${PORT}`));