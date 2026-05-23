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

  // ========== GALLERY DATA ==========
  // Các ảnh hiện có trong img folder
  const galleryImages = [
    { id: 7, src: 'img/z7854779447526_459783bafc7ce494b2840bc58799c9d8.jpg', category: 'moments', title: 'Vui vẻ', date: '03/03/2026' },
    { id: 8, src: 'img/z7854779455909_2a2fe64dfdcf1a5312867b9a2d271b5e.jpg', category: 'nature', title: 'Đẹp lắm', date: '08/03/2026' },
    { id: 9, src: 'img/z7854779457257_f91f0b64121dd08f4bd2f713d19e536c.jpg', category: 'couple', title: 'Mình yêu nhau', date: '12/03/2026' },
    { id: 1, src: 'img/z7854779413765_ef0611deb5a4244cfe5ae57b90275c48.jpg', category: 'couple', title: 'Yêu nhau ❤️', date: '28/04/2026' },
    { id: 2, src: 'img/z7854779417657_c49e6004c429fd860d466f1eba839c61.jpg', category: 'moments', title: 'Khoảnh khắc đẹp', date: '28/04/2026' },
    { id: 3, src: 'img/z7854779423808_ab53af9d8a8c86fbe4781f0c192cce21.jpg', category: 'couple', title: 'Cùng nhau', date: '28/04/2026' },
    { id: 4, src: 'img/z7854779433202_817eb77b21d8b90471531d4b855edb51.jpg', category: 'moments', title: 'Nụ cười', date: '28/04/2026' },
    { id: 5, src: 'img/z7854779440068_c39ca4e7ccbe0f0fabbc4551ac215867.jpg', category: 'nature', title: 'Thiên nhiên', date: '28/04/2026' },
    { id: 6, src: 'img/z7854779440373_00a5a0760688887552b8cde45dde7a9f.jpg', category: 'couple', title: 'Tình yêu', date: '28/04/2026' },
  ];

  let currentFilter = 'all';
  let currentImageIndex = 0;
  let filteredImages = [...galleryImages];

  // ========== XỬ LÝ DRAG & DROP TOÀN CỤC (FIX LỖI VĂNG MẤT HÌNH) ==========
  let activeDragItem = null;
  let startMouse = { x: 0, y: 0 };
  let startItemPos = { x: 0, y: 0 };

  document.addEventListener('pointermove', (e) => {
    if (!activeDragItem) return;
    
    // Tính khoảng cách chuột đã di chuyển so với lúc mới bấm (Delta)
    let deltaX = e.clientX - startMouse.x;
    let deltaY = e.clientY - startMouse.y;
    
    // Chỉ cộng dồn vào vị trí ban đầu, giúp phần tử không bị nhảy cóc
    activeDragItem.style.left = (startItemPos.x + deltaX) + 'px';
    activeDragItem.style.top = (startItemPos.y + deltaY) + 'px';
    
    updateTimelinePath(); // Cập nhật lại dây thừng uốn lượn
  });

  document.addEventListener('pointerup', (e) => {
    if (activeDragItem) {
      activeDragItem.classList.remove('dragging');
      // Nhả con trỏ chuột ra
      try { activeDragItem.releasePointerCapture(e.pointerId); } catch(err) {}
      activeDragItem = null;
      updateTimelinePath();
    }
  });

  // ========== RENDER GALLERY ==========
  function renderGallery(filter = 'all') {
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (filter === 'all') {
      filteredImages = [...galleryImages];
    } else {
      filteredImages = galleryImages.filter(img => img.category === filter);
    }

    galleryGrid.innerHTML = '';
    
    filteredImages.forEach((image, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.innerHTML = `
        <img src="${image.src}" alt="${image.title}" class="gallery-image" data-index="${index}">
        <div class="gallery-date-badge">📅 ${image.date}</div>
        <div class="gallery-overlay">
          <p class="gallery-title-overlay">${image.title}</p>
          <button class="gallery-view-btn">Xem</button>
        </div>
      `;
      
      galleryItem.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(image.src, index);
      });
      
      galleryGrid.appendChild(galleryItem);
    });
  }

  // ========== RENDER TIMELINE ==========
  function renderTimeline(filter = 'all') {
    const timelineContainer = document.getElementById('timelineContainer');
    
    if (filter === 'all') {
      filteredImages = [...galleryImages];
    } else {
      filteredImages = galleryImages.filter(img => img.category === filter);
    }

    timelineContainer.innerHTML = '<svg id="timelineSVG" class="timeline-svg"></svg>';
    const timelineContent = document.createElement('div');
    timelineContent.className = 'timeline-content';
    timelineContent.id = 'timelineContent';
    
    filteredImages.forEach((image, index) => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item';
      // Xóa thuộc tính draggable = true để chống xung đột "bóng ma" HTML5
      timelineItem.dataset.index = index;
      
      timelineItem.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-date">${image.date}</div>
        <div class="timeline-image-card">
          <img src="${image.src}" alt="${image.title}" class="timeline-image">
          <p class="timeline-title">${image.title}</p>
          <button class="timeline-view-btn">Xem ảnh</button>
        </div>
      `;
      
      const card = timelineItem.querySelector('.timeline-image-card');
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.timeline-view-btn')) return;
        currentImageIndex = index;
        openLightbox(image.src, index);
      });

      // ========== BẮT ĐẦU KÉO THẢ TIMELINE ITEM ==========
      timelineItem.addEventListener('pointerdown', (e) => {
        // Bỏ qua nếu người dùng bấm vào nút "Xem ảnh"
        if (e.target.closest('.timeline-view-btn')) return;
        
        activeDragItem = timelineItem;
        timelineItem.classList.add('dragging');
        
        // Ép trình duyệt dồn sự kiện cảm ứng vào phần tử này (ngăn scroll trang trên điện thoại)
        try { timelineItem.setPointerCapture(e.pointerId); } catch(err) {}
        
        // Lưu tọa độ chuột lúc bắt đầu click
        startMouse.x = e.clientX;
        startMouse.y = e.clientY;

        // Lưu tọa độ hiện tại của thẻ (mặc định là 0 nếu chưa bị kéo)
        startItemPos.x = parseFloat(timelineItem.style.left) || 0;
        startItemPos.y = parseFloat(timelineItem.style.top) || 0;
      });
      
      timelineContent.appendChild(timelineItem);
    });
    
    timelineContainer.appendChild(timelineContent);
    setTimeout(updateTimelinePath, 100);
  }

  // ========== UPDATE TIMELINE PATH (SVG CURVE) ==========
  function updateTimelinePath() {
    const svg = document.getElementById('timelineSVG');
    const items = document.querySelectorAll('.timeline-item');
    const container = document.getElementById('timelineContainer');

    if (!svg || items.length === 0 || !container) return;

    // Set SVG dimensions to match container
    const containerRect = container.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${container.offsetWidth} ${container.offsetHeight}`);
    svg.setAttribute('width', container.offsetWidth);
    svg.setAttribute('height', container.offsetHeight);

    // Clear existing paths
    svg.innerHTML = '';

    // Get all dot positions
    const positions = [];
    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const dot = item.querySelector('.timeline-dot');
      const dotRect = dot.getBoundingClientRect();
      
      // Calculate dot center relative to container
      const x = dotRect.left - containerRect.left + dotRect.width / 2;
      const y = dotRect.top - containerRect.top + dotRect.height / 2;
      
      positions.push({ x, y });
    });

    if (positions.length < 2) return;

    // Sort positions by Y coordinate for better path
    const sortedPositions = positions.map((pos, idx) => ({ ...pos, originalIndex: idx }))
      .sort((a, b) => a.y - b.y);

    // Create smooth curve using cubic bezier curves
    let pathData = `M ${sortedPositions[0].x} ${sortedPositions[0].y}`;

    for (let i = 1; i < sortedPositions.length; i++) {
      const prev = sortedPositions[i - 1];
      const curr = sortedPositions[i];

      // Calculate control points for smooth cubic bezier curve
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Control point offset
      const controlOffset = Math.min(distance * 0.4, 80);
      
      const cp1x = prev.x + controlOffset;
      const cp1y = prev.y + (dy > 0 ? controlOffset * 0.5 : -controlOffset * 0.5);
      
      const cp2x = curr.x - controlOffset;
      const cp2y = curr.y - (dy > 0 ? controlOffset * 0.5 : -controlOffset * 0.5);

      pathData += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${curr.x} ${curr.y}`;
    }

    // Draw main rope path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', 'url(#ropeGradient)');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('filter', 'url(#ropeShadow)');

    // Draw glow effect
    const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glowPath.setAttribute('d', pathData);
    glowPath.setAttribute('stroke', 'rgba(255, 180, 205, 0.3)');
    glowPath.setAttribute('stroke-width', '12');
    glowPath.setAttribute('fill', 'none');
    glowPath.setAttribute('stroke-linecap', 'round');
    glowPath.setAttribute('stroke-linejoin', 'round');
    glowPath.setAttribute('opacity', '0.6');

    // Create gradient definition
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'ropeGradient');
    gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
    gradient.setAttribute('x1', sortedPositions[0].x);
    gradient.setAttribute('y1', sortedPositions[0].y);
    gradient.setAttribute('x2', sortedPositions[sortedPositions.length - 1].x);
    gradient.setAttribute('y2', sortedPositions[sortedPositions.length - 1].y);

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#ffb4cd');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#ff6482');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);

    // Create shadow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'ropeShadow');

    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('stdDeviation', '2');

    filter.appendChild(feGaussianBlur);
    defs.appendChild(gradient);
    defs.appendChild(filter);

    svg.appendChild(defs);
    svg.appendChild(glowPath);
    svg.appendChild(path);
  }

  // ========== VIEW TOGGLE ==========
  const gridViewBtn = document.getElementById('gridViewBtn');
  const timelineViewBtn = document.getElementById('timelineViewBtn');
  const galleryGrid = document.getElementById('galleryGrid');
  const timelineContainer = document.getElementById('timelineContainer');
  let currentView = 'grid';

  gridViewBtn.addEventListener('click', () => {
    gridViewBtn.classList.add('view-btn--active');
    timelineViewBtn.classList.remove('view-btn--active');
    galleryGrid.style.display = 'grid';
    timelineContainer.style.display = 'none';
    currentView = 'grid';
  });

  timelineViewBtn.addEventListener('click', () => {
    timelineViewBtn.classList.add('view-btn--active');
    gridViewBtn.classList.remove('view-btn--active');
    galleryGrid.style.display = 'none';
    timelineContainer.style.display = 'block';
    renderTimeline(currentFilter);
    currentView = 'timeline';
  });

  // ========== FILTER BUTTONS ==========
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      currentFilter = btn.dataset.filter;
      if (currentView === 'grid') {
        renderGallery(currentFilter);
      } else {
        renderTimeline(currentFilter);
      }
    });
  });

  // ========== LIGHTBOX FUNCTIONS ==========
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  function openLightbox(imageSrc, index) {
    lightboxImage.src = imageSrc;
    currentImageIndex = index;
    lightbox.classList.add('lightbox--active');
    updateLightboxCounter();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--active');
    document.body.style.overflow = 'auto';
  }

  function updateLightboxCounter() {
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${filteredImages.length}`;
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    lightboxImage.src = filteredImages[currentImageIndex].src;
    updateLightboxCounter();
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    lightboxImage.src = filteredImages[currentImageIndex].src;
    updateLightboxCounter();
  }

  // ========== LIGHTBOX EVENT LISTENERS ==========
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--active')) return;
    
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'Escape') closeLightbox();
  });

  // ========== INITIAL RENDER ==========
  renderGallery('all');
});