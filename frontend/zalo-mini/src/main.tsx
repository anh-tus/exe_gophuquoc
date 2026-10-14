import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

function App() {
  return (
    <main className="shell">
      <p className="eyebrow">PHÚ QUỐC LOCAL COMPANION</p>
      <h1>Zalo Mini App</h1>
      <p className="copy">Khung ứng dụng ban đầu. Màn hình và luồng sản phẩm sẽ được xây dựng sau khi chốt thiết kế.</p>
      <div className="status">Starter · Chưa kết nối Zalo SDK hoặc backend</div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
