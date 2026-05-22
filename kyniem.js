document.addEventListener('DOMContentLoaded', () => {
  // ========== DASHBOARD TOGGLE ==========
  const dashboardSidebar = document.getElementById('dashboardSidebar');
  const dashboardToggle = document.getElementById('dashboardToggle');
  
  if (dashboardToggle && dashboardSidebar) {
    if (window.innerWidth <= 768) {
      dashboardSidebar.classList.add('collapsed');
    }

    dashboardToggle.addEventListener('click', () => {
      dashboardSidebar.classList.toggle('collapsed');
    });
  }

  // ========== LOVE COUNTER ==========
  // Ngày bắt đầu yêu: 17/02/2026
  const startDate = new Date('2026-02-17T00:00:00');

  const daysVal = document.getElementById('daysVal');
  const hoursVal = document.getElementById('hoursVal');
  const minsVal = document.getElementById('minsVal');
  const secsVal = document.getElementById('secsVal');

  function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    if (diff < 0) {
      // Nếu hiện tại nhỏ hơn ngày bắt đầu
      daysVal.textContent = '0';
      hoursVal.textContent = '0';
      minsVal.textContent = '0';
      secsVal.textContent = '0';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysVal.textContent = d;
    hoursVal.textContent = h;
    minsVal.textContent = m;
    secsVal.textContent = s;
  }

  // Cập nhật ngay lập tức
  updateCounter();

  // Cập nhật mỗi giây
  setInterval(updateCounter, 1000);
});
