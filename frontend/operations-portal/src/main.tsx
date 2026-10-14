import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, Card, Typography } from 'antd';

function App() {
  return (
    <ConfigProvider>
      <main style={{ maxWidth: 760, margin: '12vh auto', padding: 24 }}>
        <Typography.Text type="secondary">PHÚ QUỐC LOCAL COMPANION</Typography.Text>
        <Card style={{ marginTop: 16 }}>
          <Typography.Title level={2}>Operations Portal starter</Typography.Title>
          <Typography.Paragraph>
            Khung React + Ant Design ban đầu. Quản trị đối tác, listing và booking chưa được triển khai.
          </Typography.Paragraph>
          <Typography.Text type="secondary">Starter · Chưa kết nối API</Typography.Text>
        </Card>
      </main>
    </ConfigProvider>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
