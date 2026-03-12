require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); // This is the bridge

const app = express();

// Enable the bridge so React can talk to this server
app.use(cors()); 
app.use(express.json());

app.get('/api/fatsecret-token', async (req, res) => {
    try {
        const credentials = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

        const response = await fetch('https://oauth.fatsecret.com/connect/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&scope=basic'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error_description || 'Failed to fetch token');
        }

        // --- THE MISSING HANDOFF ---
        // This sends the token back to your React app
        res.json(data);

    } catch (error) {
        console.error("Proxy Engine Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000; // Render sets its own PORT, so we use this.
app.listen(PORT, () => {
    console.log(`BVLTRA Proxy Engine running on port ${PORT}`);
});