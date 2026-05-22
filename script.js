const init = () => {
  // Xóa class container để bắt đầu chạy mọi animation CSS
  document.body.classList.remove("container");

  const letterWrap = document.getElementById('letterWrap');
  const envelope   = document.getElementById('envelope');
  const sakuraCont = document.getElementById('sakuraContainer');

  // Đợi đúng 8.3s (khi mọi hoạt cảnh xuất hiện xong) mới cho phép click thư
  setTimeout(() => {
    if (letterWrap) {
      letterWrap.classList.add('visible');
    }
  }, 8300);

  /* ── Click phong bì: mở thư + mưa hoa đào rơi vô tận ── */
  let opened = false;
  if (envelope) {
    envelope.addEventListener('click', () => {
      if (opened) return;
      opened = true;

      // Kích hoạt animation mở thư
      envelope.classList.add('open');

      // Sau 0.5s bắt đầu tạo cánh hoa
      setTimeout(() => spawnSakuraInfinite(), 500);
    });
  }

  function spawnSakuraInfinite() {
    // Tạo đợt đầu tiên ngay lập tức
    createWave();
    // Tạo các đợt tiếp theo liên tục, vĩnh viễn
    setInterval(createWave, 800); 
  }

  function createWave() {
    const PETALS_PER_WAVE = 15; // Số cánh rơi liên tục
    for (let i = 0; i < PETALS_PER_WAVE; i++) {
      // Rải ngẫu nhiên trong 800ms để hoa rơi mượt không bị theo khối
      setTimeout(() => createPetal(), Math.random() * 800);
    }
  }

  function createPetal() {
    if (!sakuraCont) return;

    const el = document.createElement('div');
    el.className = 'sakura-petal';

    // Kích thước ngẫu nhiên
    const size  = (Math.random() * 2.5 + 1.5).toFixed(2) + 'vmin';
    // Thời gian rơi 4–7s
    const dur   = (Math.random() * 3 + 4).toFixed(2) + 's';
    // Vị trí ngang bắt đầu ngẫu nhiên
    const left  = Math.random() * 105 - 2;
    // Trôi dạt ngang ngẫu nhiên
    const drift = ((Math.random() - 0.5) * 20).toFixed(1) + 'vw';
    // Góc xoay
    const rotS  = Math.round(Math.random() * 360) + 'deg';
    const rotE  = Math.round(Math.random() * 720 + 360) + 'deg';

    el.style.cssText = `
      left: ${left}%;
      --ps: ${size};
      --pd: ${dur};
      --delay: 0s;
      --drift: ${drift};
      --rot-s: ${rotS};
      --rot-e: ${rotE};
    `;

    sakuraCont.appendChild(el);

    // Xóa thẻ div cánh hoa sau khi rớt khỏi màn hình để giải phóng bộ nhớ
    const totalMs = parseFloat(dur) * 1000 + 500;
    setTimeout(() => el.remove(), totalMs);
  }
};

// Đảm bảo chạy đúng sau khi tải xong toàn bộ resource
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}