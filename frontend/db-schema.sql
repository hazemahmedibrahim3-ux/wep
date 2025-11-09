-- (اختياري) مثال لهيكل قاعدة بيانات إذا أردت تخزين الطلبات لاحقاً
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stripe_session_id TEXT,
  product_id TEXT,
  quantity INTEGER,
  amount_cents INTEGER,
  currency TEXT,
  customer_email TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
