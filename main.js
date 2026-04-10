/**
 * Softgile Service Catalog — Main JavaScript
 * Handles: navigation, scroll animations, tabs, form, back-to-top
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════
     1. NAVBAR — scroll behaviour & mobile toggle
  ══════════════════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');

  // Scroll → add 'scrolled' class
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Mobile toggle
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  /* ══════════════════════════════════════════════
     2. ACTIVE NAV LINK — highlight current section
  ══════════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ══════════════════════════════════════════════
     3. SCROLL ANIMATIONS — Intersection Observer
  ══════════════════════════════════════════════ */
  const animateEls = document.querySelectorAll('.animate-fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animateEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    animateEls.forEach(el => el.classList.add('visible'));
  }

  /* ══════════════════════════════════════════════
     4. INDUSTRY TABS — filter case cards
  ══════════════════════════════════════════════ */
  const tabs = document.querySelectorAll('.ind-tab');
  const caseCards = document.querySelectorAll('.case-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.tab;

      caseCards.forEach(card => {
        if (filter === 'all' || card.dataset.industry === filter) {
          card.classList.remove('hidden');
          card.style.display = '';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });

  /* ══════════════════════════════════════════════
     5. BACK TO TOP BUTTON
  ══════════════════════════════════════════════ */
  const bttBtn = document.createElement('button');
  bttBtn.className = 'back-to-top';
  bttBtn.setAttribute('aria-label', 'Back to top');
  bttBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(bttBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      bttBtn.classList.add('visible');
    } else {
      bttBtn.classList.remove('visible');
    }
  }, { passive: true });

  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ══════════════════════════════════════════════
     6. CONTACT FORM — submit handler (mock)
  ══════════════════════════════════════════════ */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      // Loading state
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Simulate async (1.5s)
      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';

        // Show toast notification
        showToast('<i class="fas fa-check-circle"></i> Message sent successfully!');
      }, 1500);
    });
  }

  /* ══════════════════════════════════════════════
     7. TOAST NOTIFICATION
  ══════════════════════════════════════════════ */
  function showToast(html) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = html;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
    });

    // Auto-hide after 4s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  /* ══════════════════════════════════════════════
     8. SMOOTH SCROLL — all internal anchor links
  ══════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ══════════════════════════════════════════════
     9. HERO VISUAL — wrap content in container div
  ══════════════════════════════════════════════ */
  const heroSection = document.querySelector('section.hero');
  if (heroSection) {
    const bgShapes = heroSection.querySelector('.hero-bg-shapes');
    const heroContent = heroSection.querySelector('.hero-content');
    const heroVisual = heroSection.querySelector('.hero-visual');

    if (heroContent && heroVisual) {
      const wrapper = document.createElement('div');
      wrapper.className = 'hero-content-outer';
      heroSection.insertBefore(wrapper, heroContent);
      wrapper.appendChild(heroContent);
      wrapper.appendChild(heroVisual);
    }
  }

  /* ══════════════════════════════════════════════
     10. SOLUTION CARD — "Learn More" expand toggle
  ══════════════════════════════════════════════ */
  // Add subtle hover ripple effect to solution cards
  document.querySelectorAll('.solution-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s ease';
    });
  });

  /* ══════════════════════════════════════════════
     11. COUNTER ANIMATION — company numbers
  ══════════════════════════════════════════════ */
  function animateCounter(el, target, suffix, duration = 1800) {
    let start = 0;
    const increment = target / (duration / 16);
    const isFloat = target % 1 !== 0;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = isFloat ? start.toFixed(1) : Math.floor(start) + suffix;
    }, 16);
  }

  // Observe the company-numbers section
  const numbersSection = document.querySelector('.company-numbers');
  let countersStarted = false;

  if (numbersSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;

        const items = [
          { selector: '.number-item:nth-child(1) .number-big', target: 415, suffix: '+' },
          { selector: '.number-item:nth-child(2) .number-big', target: 20,  suffix: '+' },
          { selector: '.number-item:nth-child(3) .number-big', target: 8,   suffix: '+' },
          { selector: '.number-item:nth-child(4) .number-big', target: 100, suffix: '%' },
        ];

        items.forEach(item => {
          const el = document.querySelector(item.selector);
          if (el) {
            // Remove the <sup> tags temporarily for animation, restore after
            el.innerHTML = '0' + item.suffix;
            animateCounter(el, item.target, item.suffix);
          }
        });
      }
    }, { threshold: 0.5 });

    counterObserver.observe(numbersSection);
  }

  /* ══════════════════════════════════════════════
     12. ASOA LAYER — re-trigger animation on scroll
  ══════════════════════════════════════════════ */
  const asoaBanner = document.querySelector('.asoa-banner');
  if (asoaBanner && 'IntersectionObserver' in window) {
    const asoaObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.asoa-layer').forEach((layer, i) => {
          layer.style.opacity = '0';
          layer.style.transform = 'translateX(20px)';
          setTimeout(() => {
            layer.style.transition = 'all 0.5s ease';
            layer.style.opacity = '1';
            layer.style.transform = 'translateX(0)';
          }, i * 120);
        });
        asoaObserver.unobserve(asoaBanner);
      }
    }, { threshold: 0.3 });
    asoaObserver.observe(asoaBanner);
  }

  console.log('%c✦ Softgile Service Catalog — Powered by Atlassian', 
    'color: #E94F32; font-weight: bold; font-size: 13px;');

})();
