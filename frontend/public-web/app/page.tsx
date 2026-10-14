import Image from 'next/image';

export default function Home() {
  return (
    <main className="page-shell">
      <Image
        className="brand-logo"
        src="/brand/gopu-logo.png"
        alt="GOPU — Go Phu Quoc, Go Paradise!"
        width={1254}
        height={1254}
        priority
      />
      <p className="eyebrow">ĐIỂM KHỞI ĐẦU: PHÚ QUỐC</p>
      <h1>GOPU bắt đầu từ Phú Quốc</h1>
      <p>Go Phu Quoc, Go Paradise! Phú Quốc là điểm đến đầu tiên trên hành trình xây dựng GOPU cho những thiên đường du lịch khác trong tương lai.</p>
      <span className="badge">Starter · Chưa có nghiệp vụ</span>
    </main>
  );
}
