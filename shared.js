/* ═══════════════════════════════════
   XOANON — Shared JS Engine
   Cursor · Magnetic · SVG Draw · Reveal · Page Transition
═══════════════════════════════════ */

(function() {
  /* ── CURSOR ── */
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx=0,my=0,rx=0,ry=0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx+'px'; cur.style.top = my+'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.09;
    ry += (my - ry) * 0.09;
    ring.style.left = rx+'px';
    ring.style.top  = ry+'px';
    requestAnimationFrame(animRing);
  })();

  // Hover expand
  document.querySelectorAll('a,button,.magnetic,.team-card,.cap-card,.price-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  });

  /* ── MAGNETIC ── */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const dx = (e.clientX - cx) * 0.32;
      const dy = (e.clientY - cy) * 0.32;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
    });
  });

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, {passive:true});
  }

  /* ── SCROLL REVEAL ── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  /* ── SVG DRAW ON SCROLL ── */
  const drawObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('drawn');
        drawObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.svg-draw, .draw-svg').forEach(el => drawObs.observe(el));

  // Also trigger hero draw paths on load
  window.addEventListener('load', () => {
    document.querySelectorAll('.dp').forEach(p => {
      setTimeout(() => p.classList.add('drawn'), 400);
    });
  });

  /* ── PAGE TRANSITION ── */
  const ptrans = document.getElementById('ptrans');

  // Fade in on load
  if (ptrans) {
    ptrans.classList.add('show');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ptrans.classList.remove('show');
        ptrans.classList.add('hide');
      });
    });
  }

  // Intercept internal links
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      if (ptrans) {
        ptrans.classList.remove('hide');
        ptrans.classList.add('show');
        setTimeout(() => { window.location.href = href; }, 680);
      } else {
        window.location.href = href;
      }
    });
  });

  /* ── SMOOTH ANCHOR ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── PARALLAX (subtle) ── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${sy * speed}px)`;
      });
    }, {passive:true});
  }

  /* ── NUMBER COUNT UP ── */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count || '0');
      const suffix = el.dataset.suffix || '';
      const isFloat = String(target).includes('.');
      const dur = 1800;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now-start)/dur, 1);
        const ease = 1 - Math.pow(1-p, 3);
        el.textContent = (isFloat ? (target*ease).toFixed(1) : Math.floor(target*ease)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  /* ── ACCORDION ── */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

})();
