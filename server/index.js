const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors({ origin: 'http://localhost:5500'}));
app.use(express.json());
app.use(express.static('public'));
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
    [1, { priceInCents: 10000, name: 'ReactJs Course'}],
    [2, { priceInCents: 20000, name: 'CSS Course'}]
]);

app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id);
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents // always send price in cents as accepted by stripe
                    },
                    quantity: item.quantity
                } // format for stripe
            }),
            mode: 'payment', // payment -> 1 time, subscription -> for subscriptions
            // success_url: `${process.env.SERVER_URL}/success.html`,
            // cancel_url: `${process.env.SERVER_URL}/cancel.html`
            success_url: `${process.env.CLIENT_URL}/success.html`,
            cancel_url: `${process.env.CLIENT_URL}/cancel.html`
        })
        res.json({url: session.url }); // redirect url
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})
// Test Card info:
// Any email
// Card info: 4242 4242 4242 4242
// date: must be a future date
// Any CVC
// Any name on card
// If you click on back button from stripe's back button we go to cancel url
// To not get blocked by cors. When running from live server use localhost:5500 instead of 127.0.0.1:5500
app.listen(5000);