// Hàm kiểm tra xem người dùng có đang dùng điện thoại không
const isMobileDevice = () => window.innerWidth <= 768;

const init = () => {
  // Xóa class container để bắt đầu chạy mọi animation CSS
  document.body.classList.remove("container");

  const letterWrap = document.getElementById('letterWrap');
  const envelope   = document.getElementById('envelope');
  const sakuraCont = document.getElementById('sakuraContainer');
  const trackTitle = document.getElementById('trackTitle');
  const trackArtist = document.getElementById('trackArtist');
  const playPauseBtn = document.getElementById('playPause');
  const playPauseMiniBtn = document.getElementById('playPauseMini');
  const prevBtn = document.getElementById('prevTrack');
  const nextBtn = document.getElementById('nextTrack');
  const toggleMiniBtn = document.getElementById('toggleMini');
  const playerEl = document.getElementById('musicPlayer');
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationTimeEl = document.getElementById('durationTime');

  const playlist = [
    {
      title: 'Sakura Dream',
      artist: 'YouTube Video 1',
      videoId: 'T7ksmtaVeOk'
    },
    {
      title: 'Radio Blossom',
      artist: 'YouTube Video 2',
      videoId: 've_42IjmJvM'
    }
  ];
  let currentTrackIndex = 0;
  let isPlaying = true;
  let youtubePlayer = null;
  let progressUpdateInterval = null;

  function createYouTubePlayer() {
    if (youtubePlayer || typeof YT === 'undefined' || !YT.Player) return;
    youtubePlayer = new YT.Player('youtubePlayer', {
      height: '1',
      width: '1',
      videoId: playlist[currentTrackIndex].videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        playsinline: 1
      },
      events: {
        onReady: () => {
          loadTrack(currentTrackIndex);
          if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
            youtubePlayer.playVideo();
          }
        },
        onStateChange: onPlayerStateChange
      }
    });
  }

  window.createYouTubePlayer = createYouTubePlayer;
  if (window.youTubeReady) {
    createYouTubePlayer();
  }

  // Đợi đúng 8.3s (khi mọi hoạt cảnh xuất hiện xong) mới cho phép click thư
  setTimeout(() => {
    if (letterWrap) {
      letterWrap.classList.add('visible');
    }
  }, 8300);

  /* ── Click phong bì: toggle mở/đóng thư ── */
  let isOpen = false;
  const letterPaper = document.getElementById('letterPaper');

  // Chặn click trên lá thư không lan lên envelope (để đọc thư mà không bị đóng)
  if (letterPaper) {
    letterPaper.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (envelope) {
    envelope.addEventListener('click', () => {
      if (!isOpen) {
        // === MỞ THƯ ===
        isOpen = true;
        envelope.classList.add('open');

        // Sau 0.5s bùng nổ cánh hoa đào
        setTimeout(() => spawnSakuraBurst(), 500);
      } else {
        // === ĐÓNG THƯ ===
        isOpen = false;
        envelope.classList.remove('open');
      }
    });
  }

  /* ═══════════════════════════════════════════
     HIỆU ỨNG HOA ĐÀO RƠI
     ═══════════════════════════════════════════ */

  const IMAGE_FILES = [
    './img/z7854779413765_ef0611deb5a4244cfe5ae57b90275c48.jpg',
    './img/z7854779417657_c49e6004c429fd860d466f1eba839c61.jpg',
    './img/z7854779423808_ab53af9d8a8c86fbe4781f0c192cce21.jpg',
    './img/z7854779433202_817eb77b21d8b90471531d4b855edb51.jpg',
    './img/z7854779440068_c39ca4e7ccbe0f0fabbc4551ac215867.jpg',
    './img/z7854779440373_00a5a0760688887552b8cde45dde7a9f.jpg',
    './img/z7854779447526_459783bafc7ce494b2840bc58799c9d8.jpg',
    './img/z7854779455909_2a2fe64dfdcf1a5312867b9a2d271b5e.jpg',
    './img/z7854779457257_f91f0b64121dd08f4bd2f713d19e536c.jpg'
  ];

  function startSakuraRain() {
    if (!sakuraCont) return;

    // Giảm số lượng hoa mở màn trên mobile (chỉ 5 cánh thay vì 20)
    const initialCount = isMobileDevice() ? 5 : 20;
    for (let i = 0; i < initialCount; i++) {
      setTimeout(createSakuraPetal, Math.random() * 1600);
    }

    // Tăng thời gian chờ và giảm số hoa rơi trên mobile
    const intervalTime = isMobileDevice() ? 1200 : 650;
    setInterval(() => {
      // Mobile rơi 1-2 cánh, PC rơi 2-4 cánh
      const count = isMobileDevice() ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        setTimeout(createSakuraPetal, Math.random() * 900);
      }
    }, intervalTime);
  }

  function createSakuraPetal() {
    if (!sakuraCont) return;

    const el = document.createElement('div');
    el.className = 'sakura-petal';

    const size = (Math.random() * 2.2 + 2.2).toFixed(2); // 2.2–4.4vmin
    const duration = (Math.random() * 3.8 + 5.5).toFixed(2); // 5.5–9.3s
    const delay = (Math.random() * 0.8).toFixed(2);
    const leftPos = (Math.random() * 120 - 10).toFixed(2);
    const drift = (Math.random() * 120 - 60).toFixed(2);
    const rotStart = Math.round(Math.random() * 180 - 90);
    const rotEnd = Math.round(Math.random() * 360 - 180);

    el.style.cssText = `
      left: ${leftPos}%;
      --ps: ${size}vmin;
      --pd: ${duration}s;
      --delay: ${delay}s;
      --drift: ${drift}vw;
      --rot-s: ${rotStart}deg;
      --rot-e: ${rotEnd}deg;
    `;

    sakuraCont.appendChild(el);

    const totalMs = (parseFloat(duration) + parseFloat(delay)) * 1000 + 500;
    setTimeout(() => el.remove(), totalMs);
  }

  function startImageRain() {
    if (!sakuraCont || IMAGE_FILES.length === 0) return;

    // TẮT HOÀN TOÀN mưa ảnh dung lượng lớn trên điện thoại để chống giật lag
    if (isMobileDevice()) return;

    for (let i = 0; i < 10; i++) {
      setTimeout(createFallingImage, Math.random() * 1800);
    }

    setInterval(() => {
      const count = Math.floor(Math.random() * 2) + 1; // 1–2 ảnh mỗi đợt
      for (let i = 0; i < count; i++) {
        setTimeout(createFallingImage, Math.random() * 1200);
      }
    }, 900);
  }

  function createFallingImage() {
    if (!sakuraCont) return;

    const el = document.createElement('div');
    el.className = 'falling-image';

    const img = document.createElement('img');
    img.src = IMAGE_FILES[Math.floor(Math.random() * IMAGE_FILES.length)];
    img.alt = 'rơi';
    img.loading = 'lazy';
    el.appendChild(img);

    const size = (Math.random() * 2.5 + 3.5).toFixed(2); // 3.5–6.0vmin
    const duration = (Math.random() * 3 + 5.5).toFixed(2); // 5.5–8.5s
    const delay = (Math.random() * 0.6).toFixed(2);
    const leftPos = (Math.random() * 86 + 7).toFixed(2); // 7–93% để không bị cắt cạnh
    const drift = (Math.random() * 80 - 40).toFixed(2);
    const rotStart = Math.round(Math.random() * 120 - 60);
    const rotEnd = Math.round(Math.random() * 360 - 180);

    el.style.cssText = `
      left: ${leftPos}%;
      --img-size: ${size}vmin;
      --fall-dur: ${duration}s;
      --fall-delay: ${delay}s;
      --fall-drift: ${drift}vw;
      --start-rot: ${rotStart}deg;
      --end-rot: ${rotEnd}deg;
    `;

    sakuraCont.appendChild(el);

    const totalMs = (parseFloat(duration) + parseFloat(delay)) * 1000 + 500;
    setTimeout(() => el.remove(), totalMs);
  }

  function spawnSakuraBurst() {
    if (!sakuraCont) return;
    // Điện thoại chỉ bung 8 cánh thay vì 18 cánh
    const burstCount = isMobileDevice() ? 8 : 18;
    for (let i = 0; i < burstCount; i++) {
      setTimeout(createSakuraPetal, Math.random() * 450);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function updatePlayerMeta(track) {
    if (!track) return;
    // If the YouTube player is available, prefer live metadata from the video
    if (youtubePlayer && typeof youtubePlayer.getVideoData === 'function') {
      try {
        const vd = youtubePlayer.getVideoData() || {};
        trackTitle.textContent = vd.title || track.title || '';
        trackArtist.textContent = vd.author || track.artist || '';
      } catch (e) {
        trackTitle.textContent = track.title || '';
        trackArtist.textContent = track.artist || '';
      }
    } else {
      trackTitle.textContent = track.title || '';
      trackArtist.textContent = track.artist || '';
    }
    progressBar.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationTimeEl.textContent = '0:00';
  }

  function updateProgress() {
    if (!youtubePlayer || typeof youtubePlayer.getDuration !== 'function') return;
    const duration = youtubePlayer.getDuration();
    const currentTime = youtubePlayer.getCurrentTime();
    if (!duration || duration <= 0) return;
    const percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    durationTimeEl.textContent = formatTime(duration);
  }

  function startProgressLoop() {
    if (progressUpdateInterval) return;
    progressUpdateInterval = setInterval(updateProgress, 250);
  }

  function stopProgressLoop() {
    if (progressUpdateInterval) {
      clearInterval(progressUpdateInterval);
      progressUpdateInterval = null;
    }
  }

  function loadTrack(index) {
    const track = playlist[index];
    if (!track) return;

    currentTrackIndex = index;
    // Update UI immediately with fallback data
    updatePlayerMeta(track);

    if (youtubePlayer && typeof youtubePlayer.loadVideoById === 'function') {
      // Load and autoplay the video
      try {
        youtubePlayer.loadVideoById(track.videoId);
        // attempt to play (may be blocked by browser autoplay policies)
        if (typeof youtubePlayer.playVideo === 'function') {
          youtubePlayer.playVideo();
        }

        // After a short delay, fetch the real video metadata from the player
        setTimeout(() => {
          if (youtubePlayer && typeof youtubePlayer.getVideoData === 'function') {
            const vd = youtubePlayer.getVideoData() || {};
            if (vd.title) trackTitle.textContent = vd.title;
            if (vd.author) trackArtist.textContent = vd.author;
          }
        }, 300);
      } catch (e) {
        // ignore
      }
    }
  }

  function updatePlayButton() {
    if (playPauseBtn) {
      playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
    }
    if (playPauseMiniBtn) {
      playPauseMiniBtn.textContent = isMini ? '💿' : (isPlaying ? '⏸' : '▶');
    }
  }

  let isMini = false;
  function setMiniMode(enabled) {
    isMini = enabled;
    if (playerEl) {
      playerEl.classList.toggle('music-player--mini', enabled);
      if (enabled) {
        playerEl.style.position = 'fixed';
        playerEl.style.setProperty('top', '16px', 'important');
        playerEl.style.setProperty('left', '16px', 'important');
        playerEl.style.setProperty('right', 'auto', 'important');
        playerEl.style.setProperty('bottom', 'auto', 'important');
        playerEl.style.transform = 'none';
        enableDragging();
      } else {
        disableDragging();
      }
    }
    if (toggleMiniBtn) {
      toggleMiniBtn.textContent = enabled ? '⬜' : '◯';
    }
    updatePlayButton();
  }

  function toggleMini() {
    setMiniMode(!isMini);
  }

  // Dragging logic for mini mode
  let isDragging = false;
  let hasMoved = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let startX = 0;
  let startY = 0;

  function clampToViewport(x, y, el) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const rect = el.getBoundingClientRect();
    const maxX = w - rect.width - 8; // 8px margin
    const maxY = h - rect.height - 8;
    const nx = Math.max(8, Math.min(maxX, x));
    const ny = Math.max(8, Math.min(maxY, y));
    return { x: nx, y: ny };
  }

  function onPointerDown(e) {
    // allow dragging from the mini play button area, but ignore other controls
    if (e.target.closest && e.target.closest('button:not(.player-btn--play-mini), input, a, .player-controls, .player-actions, .player-progress, .player-meta, .player-time, .player-title, .player-artist')) return;
    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    const rect = playerEl.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    playerEl.setPointerCapture(e.pointerId);
    playerEl.style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
    if (!hasMoved && dist < 5) return; // Bỏ qua nếu chỉ rung tay nhẹ (dưới 5px)
    
    hasMoved = true;
    const desiredLeft = e.clientX - dragOffsetX;
    const desiredTop = e.clientY - dragOffsetY;
    const pos = clampToViewport(desiredLeft, desiredTop, playerEl);
    playerEl.style.setProperty('left', pos.x + 'px', 'important');
    playerEl.style.setProperty('top', pos.y + 'px', 'important');
    playerEl.style.setProperty('right', 'auto', 'important');
    playerEl.style.setProperty('bottom', 'auto', 'important');
    playerEl.style.transform = 'none';
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    try { playerEl.releasePointerCapture(e.pointerId); } catch (err) {}
    playerEl.style.transition = '';
    
    // Nếu chỉ là click (không kéo đi) và đang thu nhỏ, mở to ra
    if (!hasMoved && isMini) {
      setMiniMode(false);
    }
    
    if (hasMoved) {
      const preventClick = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        playerEl.removeEventListener('click', preventClick, true);
      };
      playerEl.addEventListener('click', preventClick, true);
      setTimeout(() => playerEl.removeEventListener('click', preventClick, true), 50);
    }
  }

  function enableDragging() {
    if (!playerEl) return;
    playerEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    playerEl.style.touchAction = 'none';
    playerEl.style.cursor = 'grab';
  }

  function disableDragging() {
    if (!playerEl) return;
    playerEl.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    playerEl.style.touchAction = '';
    playerEl.style.cursor = '';
    // reset any inline positioning so CSS rules take over
    playerEl.style.removeProperty('left');
    playerEl.style.removeProperty('top');
    playerEl.style.removeProperty('right');
    playerEl.style.removeProperty('bottom');
    playerEl.style.removeProperty('transform');
    playerEl.style.removeProperty('position');
  }

  function togglePlayPause() {
    if (!youtubePlayer && window.youTubeReady) {
      createYouTubePlayer();
    }
    if (!youtubePlayer) return;
    const playerState = youtubePlayer.getPlayerState();
    if (playerState !== YT.PlayerState.PLAYING) {
      youtubePlayer.playVideo();
    } else {
      youtubePlayer.pauseVideo();
    }
  }

  function nextTrack() {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(nextIndex);
    if (youtubePlayer) {
      youtubePlayer.playVideo();
    }
    isPlaying = true;
    updatePlayButton();
  }

  function prevTrack() {
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(prevIndex);
    if (youtubePlayer) {
      youtubePlayer.playVideo();
    }
    isPlaying = true;
    updatePlayButton();
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }
  if (playPauseMiniBtn) {
    playPauseMiniBtn.addEventListener('click', () => {
      if (isMini) {
        // Bấm vào đĩa nhạc nhỏ → mở rộng ra player đầy đủ
        setMiniMode(false);
      } else {
        togglePlayPause();
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', nextTrack);
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', prevTrack);
  }
  if (toggleMiniBtn) {
    toggleMiniBtn.addEventListener('click', toggleMini);
  }
  if (progressContainer) {
    progressContainer.addEventListener('click', (event) => {
      if (!youtubePlayer || typeof youtubePlayer.getDuration !== 'function') return;
      const duration = youtubePlayer.getDuration();
      if (!duration || duration <= 0) return;
      const rect = progressContainer.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percent = clickX / rect.width;
      youtubePlayer.seekTo(duration * percent, true);
    });
  }

  function onPlayerStateChange(event) {
    const state = event.data;
    if (state === YT.PlayerState.PLAYING) {
      isPlaying = true;
      updatePlayButton();
      startProgressLoop();
      updateProgress();
    } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
      isPlaying = state === YT.PlayerState.PLAYING;
      updatePlayButton();
      if (state === YT.PlayerState.ENDED) {
        nextTrack();
      }
      stopProgressLoop();
    }
  }

  loadTrack(currentTrackIndex);

  // ========== DASHBOARD TOGGLE ==========
  const dashboardSidebar = document.getElementById('dashboardSidebar');
  const dashboardToggle = document.getElementById('dashboardToggle');
  
  if (dashboardToggle && dashboardSidebar) {
    // Tự động thu gọn trên mobile khi load trang
    if (window.innerWidth <= 768) {
      dashboardSidebar.classList.add('collapsed');
    }

    dashboardToggle.addEventListener('click', () => {
      dashboardSidebar.classList.toggle('collapsed');
      // Dịch music player theo sidebar
      if (playerEl && !isMini) {
        const isCollapsed = dashboardSidebar.classList.contains('collapsed');
        playerEl.style.left = isCollapsed ? '86px' : '256px';
        playerEl.style.width = isCollapsed
          ? 'min(calc(92vw - 86px), 42rem)'
          : 'min(calc(92vw - 256px), 42rem)';
      }
    });
  }

  // Bắt đầu mưa hoa đào và ảnh rơi ngay khi trang tải xong
  startSakuraRain();
  startImageRain();
};

// Đảm bảo chạy đúng sau khi tải xong toàn bộ resource
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}