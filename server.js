require('dotenv').config(); 

const express = require('express');
const cors = require('cors');

const app = express();

// Open the Bridge
app.use(express.json());

app.get('/api/fatsecret-token', async (req, res) => {
    try {
        // --- THE SCRAMBLER ---
        // Use Node's built-in 'Buffer' to stitch your keys together and scramble them into Base64 format.
        const credentials = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

        // --- THE NETWORK REQUEST ---
        // Server reaches out to FatSecret's authentication server.
        const response = await fetch('https://oauth.fatsecret.com/connect/token', {
            method: 'POST',
            headers: {
                // Pass the Base64 gibberish into the Authorization header
                'Authorization': `Basic ${credentials}`,
                // Tells FatSecret we are sending the data as a standard web form
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            // Explicitly demand the client_credentials grant (server-to-server access)
            body: 'grant_type=client_credentials&scope=basic'
        });

        const data = await response.json();

        // If FatSecret rejects the keys, catch the error so the server doesn't crash.
        if (!response.ok) {
            throw new Error(data.error_description || 'Failed to fetch token from FatSecret');
        }

        // --- THE HANDOFF ---
    } catch (error) {
        console.error("Proxy Engine Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. Start the Fireeee
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`BVLTRA Proxy Engine running on port ${PORT}`);
});