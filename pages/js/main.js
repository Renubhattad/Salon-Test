/* ============================================================
   JUICE SALON — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ——— PRELOADER ———
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  if (preloader && fill) {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) { p = 100; clearInterval(interval); }
      fill.style.width = p + '%';
      if (p === 100) {
        setTimeout(() => preloader.classList.add('hidden'), 300);
      }
    }, 80);
  }

  // ——— CUSTOM CURSOR ———
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    if (follower) {
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
    }
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverEls = document.querySelectorAll('a, button, .service-card, .team-card, .insta-item, .cal-day, .slot, .filter-btn');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor?.classList.add('hover');
      follower?.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor?.classList.remove('hover');
      follower?.classList.remove('hover');
    });
  });

  // ——— NAV SCROLL ———
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ——— MOBILE MENU ———
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
      const spans = burger.querySelectorAll('span');
      if (menuOpen) {
        spans[0].style.transform = 'translateY(6px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ——— SCROLL REVEAL ———
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  // Auto-add reveal to major sections
  document.querySelectorAll('.service-card, .team-card, .location-card, .stat-item, .team-full-card, .gallery-full-item, .insta-item, .award-item, .value-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    revealObs.observe(el);
  });

  // ——— STAT COUNTER ———
  const stats = document.querySelectorAll('.stat-num[data-target]');
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.target);
        const duration = 1800;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 4);
          const val = Math.round(ease * target);
          e.target.textContent = val >= 1000 ? val.toLocaleString() + '+' : (target >= 10 ? val : val);
          if (progress < 1) requestAnimationFrame(animate);
          else e.target.textContent = target >= 1000 ? target.toLocaleString() + '+' : target + (target < 100 ? '+' : '');
        };
        requestAnimationFrame(animate);
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => statObs.observe(s));

  // ——— TESTIMONIAL SLIDER ———
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(i) {
    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = i;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(parseInt(dot.dataset.index));
      startSlider();
    });
  });

  function startSlider() {
    slideInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, 5000);
  }
  if (slides.length) startSlider();

  // ——— SERVICE ACCORDION ———
  document.querySelectorAll('.service-item-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.service-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ——— SERVICE FILTER ———
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceItems = document.querySelectorAll('.service-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      serviceItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });

  // ——— NEWSLETTER FORM ———
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('You\'re on the list! Welcome to JUICE. ✦');
      nlForm.reset();
    });
  }

  // ——— CONTACT FORM ———
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Message sent! We\'ll be in touch shortly.');
      contactForm.reset();
    });
  }

  // ——— TOAST ———
  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
  window.showToast = showToast;

  // ——— BOOKING FLOW ———
  initBooking();

});

/* ——— BOOKING SYSTEM ——— */
function initBooking() {
  const steps = document.querySelectorAll('.booking-step');
  const panels = document.querySelectorAll('.booking-panel');
  const nextBtns = document.querySelectorAll('.btn-next');
  const prevBtns = document.querySelectorAll('.btn-prev');
  let currentStep = 0;

  const bookingData = { stylist: null, service: null, date: null, time: null };

  function goStep(i) {
    steps.forEach((s, idx) => {
      s.classList.remove('active', 'done');
      if (idx < i) s.classList.add('done');
      else if (idx === i) s.classList.add('active');
    });
    panels.forEach((p, idx) => p.classList.toggle('active', idx === i));
    currentStep = i;
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) goStep(currentStep + 1);
      updateSummary();
    });
  });
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) goStep(currentStep - 1);
    });
  });

  // Stylist select
  document.querySelectorAll('.stylist-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.stylist-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      bookingData.stylist = card.dataset.stylist;
    });
  });

  // Service select
  document.querySelectorAll('.service-select-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.service-select-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      bookingData.service = item.dataset.service;
      bookingData.price = item.dataset.price;
      bookingData.duration = item.dataset.duration;
    });
  });

  // Time slots
  document.querySelectorAll('.slot:not(.taken)').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      bookingData.time = slot.textContent;
    });
  });

  // Calendar
  initCalendar();

  function updateSummary() {
    const summaries = document.querySelectorAll('.summary-row[data-field]');
    summaries.forEach(row => {
      const field = row.dataset.field;
      const val = bookingData[field];
      const span = row.querySelector('span:last-child');
      if (span && val) span.textContent = val;
    });
  }

  // Booking confirm
  const confirmBtn = document.getElementById('confirmBooking');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      window.showToast?.('Booking confirmed! Check your email for details. ✦');
      goStep(0);
      document.querySelectorAll('.stylist-select-card, .service-select-item, .slot').forEach(el => el.classList.remove('selected'));
      document.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
      Object.keys(bookingData).forEach(k => bookingData[k] = null);
    });
  }
}

/* ——— CALENDAR ——— */
function initCalendar() {
  const calGrid = document.getElementById('calGrid');
  const calMonthYear = document.getElementById('calMonthYear');
  const prevMonBtn = document.getElementById('prevMon');
  const nextMonBtn = document.getElementById('nextMon');
  if (!calGrid) return;

  let now = new Date();
  let month = now.getMonth(), year = now.getFullYear();
  let selectedDate = null;

  function render() {
    calMonthYear.textContent = new Date(year, month).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    calGrid.innerHTML = '';
    const days = ['M','T','W','T','F','S','S'];
    days.forEach(d => {
      const span = document.createElement('span');
      span.className = 'cal-day-label';
      span.textContent = d;
      calGrid.appendChild(span);
    });
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < offset; i++) {
      const span = document.createElement('span');
      span.className = 'cal-day empty';
      calGrid.appendChild(span);
    }
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    for (let d = 1; d <= daysInMonth; d++) {
      const span = document.createElement('span');
      span.className = 'cal-day';
      span.textContent = d;
      const date = new Date(year, month, d);
      if (date < today && !(date.toDateString() === today.toDateString())) span.classList.add('disabled');
      if (date.toDateString() === today.toDateString()) span.classList.add('today');
      if (selectedDate && date.toDateString() === selectedDate.toDateString()) span.classList.add('selected');
      span.addEventListener('click', () => {
        calGrid.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
        span.classList.add('selected');
        selectedDate = date;
      });
      calGrid.appendChild(span);
    }
  }

  render();
  prevMonBtn?.addEventListener('click', () => { month--; if (month < 0) { month = 11; year--; } render(); });
  nextMonBtn?.addEventListener('click', () => { month++; if (month > 11) { month = 0; year++; } render(); });
}