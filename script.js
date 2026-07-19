const introScreen = document.getElementById('introScreen');
const startBtn = document.getElementById('startBtn');
const mainContent = document.getElementById('mainContent');
const showMessageBtn = document.getElementById('showMessageBtn');
const message = document.getElementById('message');
const confettiLayer = document.getElementById('confettiLayer');
const glitterLayer = document.querySelector('.glitter-layer');
const fireworksLayer = document.querySelector('.fireworks-layer');

if (startBtn) {
  startBtn.addEventListener('click', startExperience);
}

const toastMessage = document.getElementById('toastMessage');
const track = document.getElementById('track');
const autoplayMusicBtn = document.getElementById('autoplayMusicBtn');

// Code modal elements for protected message view
const codeModal = document.getElementById('codeModal');
const codeInput = document.getElementById('codeInput');
const birthDay = document.getElementById('birthDay');
const birthMonth = document.getElementById('birthMonth');
const birthYear = document.getElementById('birthYear');
const codeSubmitBtn = document.getElementById('codeSubmitBtn');
const codeCancelBtn = document.getElementById('codeCancelBtn');
const messageBirth = document.getElementById('messageBirth');

if (showMessageBtn && message) {
  showMessageBtn.addEventListener('click', () => {
    const isVisible = message.style.display === 'block';
    if (isVisible) {
      // hide
      message.style.display = 'none';
      showMessageBtn.textContent = 'Xem lời chúc';
      showToast('Lời chúc đã được ẩn.');
      return;
    }
    // show modal to request code + birthdate
    if (codeModal) {
      codeModal.classList.remove('hidden');
      codeModal.setAttribute('aria-hidden', 'false');
      if (codeInput) codeInput.focus();
    }
  });
}

function closeCodeModal() {
  if (!codeModal) return;
  codeModal.classList.add('hidden');
  codeModal.setAttribute('aria-hidden', 'true');
  if (codeInput) {
    codeInput.value = '';
    codeInput.classList.remove('is-invalid');
  }
  if (birthDay) birthDay.value = '';
  if (birthMonth) birthMonth.value = '';
  if (birthYear) birthYear.value = '';
}

if (codeCancelBtn) codeCancelBtn.addEventListener('click', () => closeCodeModal());

if (codeSubmitBtn) {
  codeSubmitBtn.addEventListener('click', () => {
    const code = codeInput ? codeInput.value.trim() : '';
    if (code !== '2007') {
      showToast('Mã không đúng. Vui lòng nhập mã hợp lệ.');
      if (codeInput) codeInput.classList.add('is-invalid');
      return;
    }
    // code correct
    const day = birthDay ? birthDay.value : '';
    const month = birthMonth ? birthMonth.value : '';
    const year = birthYear ? birthYear.value : '';
    if (!day || !month || !year) {
      showToast('Vui lòng chọn đầy đủ ngày, tháng, năm.');
      return;
    }
    const dateVal = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const d = new Date(dateVal);
    const isValidDate = d && d.getDate() === Number(day) && d.getMonth() + 1 === Number(month) && d.getFullYear() === Number(year);
    if (!isValidDate) {
      showToast('Ngày sinh không hợp lệ.');
      return;
    }
    if (message) {
      messageBirth.textContent = `Ngày sinh: ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
      message.style.display = 'block';
      showMessageBtn.textContent = 'Ẩn lời chúc';
      showToast('Lời chúc đã hiển thị.');
    }
    closeCodeModal();
  });
}

// Enter key submit inside modal
if (codeInput) {
  codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      codeSubmitBtn && codeSubmitBtn.click();
    }
  });
}
['birthDay', 'birthMonth', 'birthYear'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        codeSubmitBtn && codeSubmitBtn.click();
      }
    });
  }
});

function showToast(text) {
  if (!toastMessage) return;
  toastMessage.textContent = text;
  toastMessage.classList.remove('hidden');
  toastMessage.classList.add('show');

  clearTimeout(toastMessage.toastTimeout);
  toastMessage.toastTimeout = setTimeout(() => {
    toastMessage.classList.remove('show');
    toastMessage.classList.add('hidden');
  }, 2800);
}

function startExperience() {
  if (introScreen) {
    introScreen.classList.add('hidden');
    introScreen.style.display = 'none';
  }
  if (mainContent) {
    mainContent.classList.remove('hidden');
  }
  launchConfetti(50);
  createRoseRain(30);
  startFlowerRain();
  initScrollReveal();
  // try to unmute/play audio when user starts the experience
  tryEnableAudio();
}

function tryEnableAudio() {
  if (!track) return;
  // If audio is muted (autoplayed muted), attempt to unmute and resume on a user gesture
  if (track.muted) {
    // Unmute only when allowed by user gesture (startExperience is a user click)
    track.muted = false;
    track.volume = 0.9;
    const p = track.play();
    if (p && p.catch) {
      p.catch(() => {
        // If playback fails, keep it muted and show button for manual control
        track.muted = true;
        if (autoplayMusicBtn) autoplayMusicBtn.classList.remove('paused');
        showToast('Trình duyệt chặn nhạc tự động — nhấn nút phát để bật âm thanh.');
      });
    }
  }
}

function startFlowerRain() {
  if (window.flowerRainInterval) return;
  createGlitter(14);
  window.flowerRainInterval = setInterval(() => {
    createRoseRain(8);
    createGlitter(12);
    triggerFireworks();
  }, 1200);
}

function triggerFireworks() {
  createFireworks('left');
  createFireworks('right');
}

function createFireworks(side) {
  if (!fireworksLayer) return;
  const count = 14;
  const originX = side === 'left' ? 32 : window.innerWidth - 32;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'firework-particle';
    particle.style.setProperty('--dx', `${(Math.random() * 120 + 32) * (side === 'left' ? 1 : -1)}px`);
    particle.style.setProperty('--dy', `-${Math.random() * 180 + 120}px`);
    particle.style.background = ['#ff9fc0', '#ff7a9f', '#ffd8e8', '#ffbbc7'][Math.floor(Math.random() * 4)];
    particle.style.left = originX + 'px';
    particle.style.animationDelay = `${Math.random() * 0.15}s`;
    particle.style.opacity = '0.95';
    fireworksLayer.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
  }
}

function createGlitter(count) {
  if (!glitterLayer) return;
  for (let i = 0; i < count; i += 1) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    const size = 4 + Math.random() * 6;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${-20 - Math.random() * 30}px`;
    sparkle.style.animationDelay = `${Math.random() * 0.4}s`;
    sparkle.style.opacity = '0';
    glitterLayer.appendChild(sparkle);

    sparkle.addEventListener('animationend', () => {
      sparkle.remove();
    });
  }
}

function launchConfetti(count) {
  const colors = ['#ff93b0', '#ffb6c1', '#f5a3b1', '#ffd1e1', '#fcb1c8'];
  for (let i = 0; i < count; i += 1) {
    const confetti = document.createElement('span');
    confetti.className = 'confetti';
    const size = Math.random() * 10 + 8;
    confetti.style.width = `${size * 0.6}px`;
    confetti.style.height = `${size}px`;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confettiLayer.appendChild(confetti);

    const delay = Math.random() * 0.4;
    const duration = 1.5 + Math.random() * 0.6;
    confetti.style.animationDelay = `${delay}s`;
    confetti.style.animationDuration = `${duration}s`;

    confetti.addEventListener('animationend', () => {
      confetti.remove();
    });
  }
}

// Attempt automatic playback on load (muted allowed by browsers)
document.addEventListener('DOMContentLoaded', () => {
  if (!track) return;
  // Ensure it's playing muted (autoplay); browsers typically allow muted autoplay
  track.muted = true;
  track.volume = 0.7;
  const p = track.play();
  if (p && p.catch) {
    p.catch(() => {
      // Show play button if autoplay with sound blocked (we keep it muted)
      if (autoplayMusicBtn) autoplayMusicBtn.classList.remove('paused');
    });
  }
});

// Play/pause toggle and unmute logic
if (autoplayMusicBtn && track) {
  autoplayMusicBtn.addEventListener('click', () => {
    if (track.paused) {
      // Try to unmute and play
      track.muted = false;
      track.volume = 0.9;
      track.play().then(() => {
        autoplayMusicBtn.textContent = '⏸';
        autoplayMusicBtn.classList.add('paused');
      }).catch(() => {
        track.muted = true;
        showToast('Không thể phát nhạc tự động — cho phép âm thanh trên trình duyệt.');
      });
    } else {
      track.pause();
      autoplayMusicBtn.textContent = '▶';
      autoplayMusicBtn.classList.remove('paused');
    }
  });
}

// If the page gets any user click, try to unmute if track is muted
document.addEventListener('click', (e) => {
  if (!track) return;
  if (track.muted) {
    // Only unmute when clicking the start button or the music button
    const isControlClick = e.target.closest('#startBtn') || e.target.closest('#autoplayMusicBtn') || e.target.closest('#startBtn');
    if (isControlClick) {
      tryEnableAudio();
    }
  }
});

function createRoseRain(count) {
  const roseRain = document.querySelector('.rose-rain');
  if (!roseRain) return;
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'rose-petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 1.2}s`;
    petal.style.animationDuration = `${3 + Math.random() * 1.5}s`;
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    roseRain.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove());
  }
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        createFlowerGrowth(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach((el) => observer.observe(el));
}

function createFlowerGrowth(target) {
  if (target.dataset.flowerAdded) return;
  target.dataset.flowerAdded = 'true';
  target.style.position = 'relative';
  target.style.overflow = 'visible';

  const positions = [
    { top: '8%', left: '-10%', size: '18px', delay: '0s' },
    { top: '20%', right: '-12%', size: '20px', delay: '0.08s' },
    { bottom: '12%', left: '4%', size: '16px', delay: '0.12s' },
    { bottom: '18%', right: '0%', size: '22px', delay: '0.05s' },
    { top: '50%', left: '-8%', size: '14px', delay: '0.16s' },
    { top: '5%', right: '8%', size: '20px', delay: '0.22s' }
  ];

  positions.forEach((pos) => {
    const bud = document.createElement('span');
    bud.className = 'flower-decoration';
    bud.style.top = pos.top || 'auto';
    bud.style.bottom = pos.bottom || 'auto';
    if (pos.left) bud.style.left = pos.left;
    if (pos.right) bud.style.right = pos.right;
    bud.style.setProperty('--size', pos.size);
    bud.style.setProperty('--delay', pos.delay);
    bud.style.setProperty('--rotate', `${Math.random() * 40 - 20}deg`);
    target.appendChild(bud);
  });
}

/* Wishes: save, render, and handle submissions */
const wishForm = document.getElementById('wishForm');
const wishInput = document.getElementById('wishInput');
const wishName = document.getElementById('wishName');
const wishList = document.getElementById('wishList');
const clearWishesBtn = document.getElementById('clearWishesBtn');

let wishes = [];

function loadWishes() {
  try {
    wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
  } catch (e) {
    wishes = [];
  }
  renderWishes();
}

function saveWishes() {
  localStorage.setItem('wishes', JSON.stringify(wishes));
}

function renderWishes() {
  if (!wishList) return;
  wishList.innerHTML = '';
  // show newest first
  const items = wishes.slice().reverse();
  items.forEach((w) => {
    const card = document.createElement('div');
    card.className = 'wish-card animate-pop position-relative';
    const author = w.name ? `<div class="wish-meta"><div class="wish-author"><span class="wish-initial">${escapeHtml((w.name||'')[0]||'•')}</span><div class="name">${escapeHtml(w.name)}</div></div></div>` : '';
    const time = `<small>${new Date(w.time).toLocaleString()}</small>`;
    card.innerHTML = `${author}<div class="wish-text">${escapeHtml(w.text)}</div>${time}<button class="wish-delete" data-time="${w.time}" aria-label="Xóa">✕</button>`;
    wishList.appendChild(card);
    setTimeout(() => card.classList.remove('animate-pop'), 900);
  });
}

function addWish(text) {
  if (!text || !text.trim()) {
    showToast('Vui lòng nhập lời ước trước khi gửi.');
    return;
  }
  const entry = { text: text.trim(), name: (wishName && wishName.value) ? wishName.value.trim() : '', time: Date.now() };
  wishes.push(entry);
  saveWishes();
  renderWishes();
  showToast('Lời ước của bạn đã được gửi. Cảm ơn!');
  if (wishInput) wishInput.value = '';
  if (wishName) wishName.value = '';
  // celebration effects when a new wish is sent
  launchConfetti(80);
  triggerFireworks();
  showFloatingHeart();
}

function clearWishes() {
  if (!confirm('Xóa toàn bộ lời ước? Hành động này không thể hoàn tác.')) return;
  wishes = [];
  saveWishes();
  renderWishes();
  showToast('Bảng lời ước đã được xóa.');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (wishForm) {
  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addWish(wishInput.value);
  });
}

if (clearWishesBtn) clearWishesBtn.addEventListener('click', clearWishes);

// Initialize wishes on load
document.addEventListener('DOMContentLoaded', loadWishes);

// event delegation for deleting single wish
if (wishList) {
  wishList.addEventListener('click', (e) => {
    const btn = e.target.closest('.wish-delete');
    if (!btn) return;
    const time = Number(btn.getAttribute('data-time'));
    if (!time) return;
    wishes = wishes.filter((w) => w.time !== time);
    saveWishes();
    renderWishes();
    showToast('Đã xóa lời ước.');
  });
}

function showFloatingHeart() {
  const rect = (document.querySelector('#wishForm button[type="submit"]') || {}).getBoundingClientRect?.();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  document.body.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}
