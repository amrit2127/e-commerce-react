const express = require('express');
const stripe = require('stripe')('sk_test_51OdpXTJDcbtZGU8vgbGfj4DTyKETO3BZDavm1Izq6XumzqnlgowTtMrEeFgEPBMMwxplfdPzVgmgJSv9wVknfWgV00m0K61CkA');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});     