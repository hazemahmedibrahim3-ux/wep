import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductList from './components/ProductList';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/cards`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      <h1>متجر بطاقات Google Play</h1>
      <p>اختر القيمة ثم اضغط "شراء" للانتقال إلى صفحة الدفع الآمن.</p>
      <ProductList products={products} apiBase={API_BASE} />
    </div>
  );
}

export default App;
