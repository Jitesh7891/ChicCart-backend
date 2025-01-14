require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Using environment variables
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from localhost:5173
  methods: ['GET', 'POST'],        // Allow specific methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
}));
// Middleware to parse JSON
app.use(bodyParser.json());

// Create PaymentIntent Endpoint
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: 'inr',
      payment_method_types: ['card'], // Optional: specifies payment methods
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret, // Send the client secret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
