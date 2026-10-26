/**
 * CHERIAN JAMES - HIGH-IMPACT SCROLL & INTERACTIVE ANIMATIONS
 * Staggered 3D perspective reveals, parallax depth, kinetic counters,
 * interactive before/after split slider, and custom cursor physics
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Interactive Cursor with trailing physics
  initCustomCursor();

  // 2. Scroll-Triggered Reveal Animations (IntersectionObserver + 3D tilts)
  initScrollReveals();

  // 3. Dynamic Number Counter Animation on scroll
  initCounterAnimations();

  // 4. Interactive Wireframe vs Render Split Slider
  initComparisonSlider();

  // 5. Parallax Depth on Background Orbs & Cards
  initParallaxEffects();

  // 6. Smooth Navbar Scroll state
  initNavbarScroll();

  // 7. Hero Giant Background Typography Parallax (Ref 2 Staging)
  initHeroParallax();

  // 8. Career Moments Accordion (Ref 2 Interactive Accordion)
  initMomentsAccordion();

  // 9. Comic SFX Callout Popups on Scroll (Ref 1 Action Bubbles)
  initComicSfxScrollPops();
});

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function renderCursor() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover states on interactive targets
  const interactiveElements = document.querySelectorAll('a, button, .work-card, .filter-btn, .reel-chip, .contact-card, input, textarea');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}

/* ==========================================================================
   2. SCROLL REVEALS (Intersection Observer + Stagger)
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .work-card, .skill-pillar-card, .timeline-card, .contact-card');

  // Inject initial CSS states for hardware-accelerated animations
  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translate3d(0, 45px, 0) scale(0.96)';
    el.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.willChange = 'opacity, transform';
  });

  const isMobile = window.innerWidth <= 768;
  const observerOptions = {
    root: null,
    rootMargin: isMobile ? '50px 0px 50px 0px' : '0px 0px -80px 0px',
    threshold: isMobile ? 0.02 : 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        // Check for stagger index if inside a grid
        const siblings = target.parentElement ? Array.from(target.parentElement.children) : [];
        const staggerIndex = siblings.indexOf(target);
        const delay = Math.min((staggerIndex % 3) * 120, 360);

        setTimeout(() => {
          target.style.opacity = '1';
          target.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }, delay);

        obs.unobserve(target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('.stat-num[data-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = target % 1 !== 0 ? 1 : 0;
        const duration = 1800; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease Out Quart
          const easeOut = 1 - Math.pow(1 - progress, 4);
          const currentVal = (target * easeOut).toFixed(decimals);

          el.textContent = currentVal + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. INTERACTIVE WIREFRAME VS RENDER SLIDER
   ========================================================================== */
function initComparisonSlider() {
  const container = document.querySelector('.slider-container');
  const sliderBefore = document.querySelector('.slider-before');
  const sliderHandle = document.querySelector('.slider-handle');
  if (!container || !sliderBefore || !sliderHandle) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = container.getBoundingClientRect();
    let position = ((clientX - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));

    sliderBefore.style.width = `${position}%`;
    sliderHandle.style.left = `${position}%`;
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support for mobile & tablets
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   5. PARALLAX EFFECTS
   ========================================================================== */
function initParallaxEffects() {
  const orbs = document.querySelectorAll('.glow-orb');
  const cards = document.querySelectorAll('.work-card');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;

        // Subtle background orb floating parallax
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.08;
          orb.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 3D Tilt on Hover for Work Cards (Desktop)
  if (window.innerWidth > 992) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
}

/* ==========================================================================
   6. NAVBAR SCROLL STATE & ACTIVE LINK TRACKING
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Section Highlighting
    let currentSectionId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   7. HERO GIANT TYPOGRAPHY PARALLAX & FLOATING 2D VECTOR LOGOS
   ========================================================================== */
function initHeroParallax() {
  const giantText = document.querySelector('.hero-bg-text-giant');
  const floatingLogos = document.querySelectorAll('.floating-vector-logo');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (giantText && scrollY < 1200) {
      giantText.style.transform = `translate3d(${-scrollY * 0.35}px, 0, 0)`;
    }
  }, { passive: true });

  if (floatingLogos.length > 0) {
    let mouseTargetX = 0, mouseTargetY = 0;
    let mouseCurrentX = 0, mouseCurrentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseTargetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseTargetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function renderLogoParallax() {
      mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.06;
      mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.06;

      floatingLogos.forEach((el, idx) => {
        const factor = (idx % 2 === 0 ? 1 : -1) * (14 + idx * 4);
        el.style.setProperty('--px', `${(mouseCurrentX * factor).toFixed(2)}px`);
        el.style.setProperty('--py', `${(mouseCurrentY * factor).toFixed(2)}px`);
      });

      requestAnimationFrame(renderLogoParallax);
    }
    requestAnimationFrame(renderLogoParallax);
  }
}

/* ==========================================================================
   8. CAREER MOMENTS ACCORDION (REF 2 INTERACTIVE MOMENTS)
   ========================================================================== */
function initMomentsAccordion() {
  const momentCards = document.querySelectorAll('.moment-card');

  momentCards.forEach(card => {
    const header = card.querySelector('.moment-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const wasActive = card.classList.contains('active');

      // Close other cards for a clean editorial feel
      momentCards.forEach(c => c.classList.remove('active'));

      if (!wasActive) {
        card.classList.add('active');
        if (window.playSfx) window.playSfx('switch');
      } else {
        if (window.playSfx) window.playSfx('click');
      }
    });
  });
}

/* ==========================================================================
   9. COMIC SFX CALLOUT POPS ON SCROLL (REF 1)
   ========================================================================== */
function initComicSfxScrollPops() {
  const bubbles = document.querySelectorAll('.comic-sfx-bubble');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = el.getAttribute('data-pop-transform') || 'scale(1) rotate(-4deg)';
        if (window.playSfx) window.playSfx('open');
      }
    });
  }, { threshold: 0.2 });

  bubbles.forEach(b => {
    b.style.opacity = '0';
    b.style.transform = 'scale(0.3) rotate(-15deg)';
    b.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease';
    observer.observe(b);
  });
}
