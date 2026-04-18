/**
 * ═══════════════════════════════════════════════════════════
 * HUMERA TASMIYA · PORTFOLIO SCRIPT
 * Features:
 *  - Smooth scrolling & active nav link tracking
 *  - Navbar scroll behaviour
 *  - Dark / Light theme toggle (persisted to localStorage)
 *  - Hamburger menu (mobile)
 *  - Scroll-reveal animations (IntersectionObserver)
 *  - Skill bar animations triggered on scroll
 *  - Typewriter effect in hero subtitle
 *  - Contact form validation
 *  - Footer year auto-update
 * ═══════════════════════════════════════════════════════════
 */

/* ── DOMContentLoaded wrapper ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════
     1. FOOTER YEAR
  ════════════════════════════════ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ════════════════════════════════
     2. THEME TOGGLE
  ════════════════════════════════ */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');
  const html        = document.documentElement;

  /** Apply theme and update icon */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
    localStorage.setItem('ht-theme', theme);
  }

  // Load saved preference, default to 'light'
  const saved = localStorage.getItem('ht-theme') || 'light';
  applyTheme(saved);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });


  /* ════════════════════════════════
     3. NAVBAR — scroll + active link
  ════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    // Scrolled class for shadow
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Active link based on scroll position
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar(); // run once on load


  /* ════════════════════════════════
     4. HAMBURGER MENU (mobile)
  ════════════════════════════════ */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('navLinks');

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when a nav link is clicked
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) closeMenu();
  });


  /* ════════════════════════════════
     5. SMOOTH SCROLLING
     (CSS scroll-behavior covers most browsers;
      this JS fallback handles edge-cases)
  ════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ════════════════════════════════
     6. SCROLL-REVEAL ANIMATIONS
  ════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings within the same grid parent
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;

          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ════════════════════════════════
     7. SKILL BAR ANIMATIONS
  ════════════════════════════════ */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill  = entry.target;
          const width = fill.getAttribute('data-width');
          // Small delay so the reveal animation happens first
          setTimeout(() => { fill.style.width = `${width}%`; }, 300);
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillFills.forEach(fill => skillObserver.observe(fill));


  /* ════════════════════════════════
     8. TYPEWRITER EFFECT (Hero)
  ════════════════════════════════ */
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'BCA Graduate',
    'Web Developer',
    'UI/UX Enthusiast',
    'MERN Stack Explorer',
    'Problem Solver',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    if (paused) return;

    const phrase = phrases[phraseIdx];

    if (!deleting) {
      // Typing
      typedEl.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === phrase.length) {
        // Pause before deleting
        paused = true;
        setTimeout(() => {
          paused   = false;
          deleting = true;
          type();
        }, 1800);
        return;
      }
    } else {
      // Deleting
      typedEl.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = deleting ? 60 : 100;
    setTimeout(type, speed);
  }

  // Start with a small delay
  setTimeout(type, 600);


  /* ════════════════════════════════
     9. CONTACT FORM VALIDATION
  ════════════════════════════════ */
  const form       = document.getElementById('contactForm');
  const nameInput  = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const msgInput   = document.getElementById('message');
  const nameError  = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const msgError   = document.getElementById('msgError');
  const formSuccess= document.getElementById('formSuccess');

  /** Validate a single field; returns true if valid */
  function validateField(input, errorEl, rules) {
    const val = input.value.trim();
    let message = '';

    if (rules.required && !val) {
      message = 'This field is required.';
    } else if (rules.minLength && val.length < rules.minLength) {
      message = `Must be at least ${rules.minLength} characters.`;
    } else if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      message = 'Please enter a valid email address.';
    }

    errorEl.textContent = message;
    input.classList.toggle('error', !!message);
    return !message;
  }

  /** Run all validations; returns true if all pass */
  function validateAll() {
    const v1 = validateField(nameInput,  nameError,  { required: true, minLength: 2 });
    const v2 = validateField(emailInput, emailError, { required: true, email: true });
    const v3 = validateField(msgInput,   msgError,   { required: true, minLength: 10 });
    return v1 && v2 && v3;
  }

  // Live validation on blur
  nameInput .addEventListener('blur', () => validateField(nameInput,  nameError,  { required: true, minLength: 2 }));
  emailInput.addEventListener('blur', () => validateField(emailInput, emailError, { required: true, email: true }));
  msgInput  .addEventListener('blur', () => validateField(msgInput,   msgError,   { required: true, minLength: 10 }));

  // Clear error on input
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });

  // Submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateAll()) return;

    // Simulate sending (replace with real fetch/EmailJS in production)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled  = true;
    btn.innerHTML = '<i class="ri-loader-4-line"></i> Sending…';

    setTimeout(() => {
      form.reset();
      btn.disabled  = false;
      btn.innerHTML = '<i class="ri-send-plane-fill"></i> Send Message';
      formSuccess.classList.add('show');

      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1400);
  });


  /* ════════════════════════════════
     10. HERO CHIP HOVER — subtle parallax
  ════════════════════════════════ */
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip, i) => {
    chip.style.animationDelay = `${i * 0.1}s`;
    chip.style.animation = `chipPop .5s ${i * 0.1}s both`;
  });

  // Inject chip keyframes dynamically
  const chipStyle = document.createElement('style');
  chipStyle.textContent = `
    @keyframes chipPop {
      from { opacity: 0; transform: translateY(12px) scale(.9); }
      to   { opacity: 1; transform: translateY(0)    scale(1); }
    }
  `;
  document.head.appendChild(chipStyle);


  /* ════════════════════════════════
     11. HERO PARALLAX ON MOUSEMOVE
  ════════════════════════════════ */
  const blobs = document.querySelectorAll('.blob');

  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 0.5;
      blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });


  /* ════════════════════════════════
     12. PROJECT CARD TILT EFFECT
  ════════════════════════════════ */
  const cards = document.querySelectorAll('.project-card, .ach-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -6;  // degrees
      const tiltY  = dx *  6;

      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

}); // end DOMContentLoaded