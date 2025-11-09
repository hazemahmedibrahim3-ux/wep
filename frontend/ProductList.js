import React from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';

export default function ProductList({ products, apiBase }) {
  const handleBuy = async (productId) => {
    try {
      const resp = await axios.post(`${apiBase}/api/create-checkout-session`, { productId, quantity: 1 });
      const { sessionId } = resp.data;
      const stripe = await loadStripe(PUBLIC_KEY);
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error('Checkout error', err);
      alert('فشل بدء عملية الدفع. تحقق من الإعدادات في الخادم.');
    }
  };

  if (!products || products.length === 0) return <div>لا توجد منتجات حالياً.</div>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {products.map(p => (
        <div key={p.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>{p.title}</div>
            <div style={{ color: '#666' }}>{p.description}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 8 }}>${(p.amount_cents/100).toFixed(2)}</div>
            <button onClick={() => handleBuy(p.id)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
              شراء
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
