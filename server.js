const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(bodyParser.json());

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// نموذج بيانات المنتجات (قِيم بطاقات Google Play)
const PRODUCTS = [
  { id: "gp_5", title: "Google Play $5", amount_cents: 500, currency: "usd", description: "بطاقة Google Play بقيمة 5 دولار" },
  { id: "gp_10", title: "Google Play $10", amount_cents: 1000, currency: "usd", description: "بطاقة Google Play بقيمة 10 دولار" },
  { id: "gp_25", title: "Google Play $25", amount_cents: 2500, currency: "usd", description: "بطاقة Google Play بقيمة 25 دولار" },
  { id: "gp_50", title: "Google Play $50", amount_cents: 5000, currency: "usd", description: "بطاقة Google Play بقيمة 50 دولار" }
];

// Endpoint لإرجاع المنتجات
app.get('/api/cards', (req, res) => {
  res.json(PRODUCTS);
});

// Endpoint لإنشاء جلسة دفع Stripe Checkout
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return res.status(400).json({ error: 'Invalid productId' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.title,
              description: product.description
            },
            unit_amount: product.amount_cents
          },
          quantity: quantity
        }
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
});

// (اختياري) Webhook لتلقي إشعارات من Stripe - يتم تعطيله افتراضياً هنا لتعقيدات التوقيع
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  // في بيئة الإنتاج: تحقق من توقيع webhook باستخدام STRIPE_WEBHOOK_SECRET
  res.status(200).send('ok');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
