/* --- js/darkmode.js --- */
/**
 * ============================================================
 * Dark Mode Toggle — Atul Dhanotiya Portfolio
 * Persists preference via localStorage & respects OS setting.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  /**
   * Apply the given theme to the document and persist the choice.
   * @param {'dark'|'light'} theme
   */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    updateIcon(theme);
  }

  /**
   * Sync the toggle button icon with the current theme.
   * Dark → show sun (so user can switch to light).
   * Light → show moon (so user can switch to dark).
   * @param {'dark'|'light'} theme
   */
  function updateIcon(theme) {
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');
    if (!icon) return;

    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  /* ----------------------------------------------------------
   * Initialization — determine starting theme
   * --------------------------------------------------------*/
  const stored = localStorage.getItem('theme');

  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
  } else {
    // Fall back to OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  /* ----------------------------------------------------------
   * Toggle handler
   * --------------------------------------------------------*/
  const toggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';

      // Smooth transition class (removed after CSS transition ends)
      html.classList.add('theme-transition');
      setTimeout(() => html.classList.remove('theme-transition'), 500);

      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  });
});


/* --- js/main.js --- */
/**
 * ============================================================
 * Main JavaScript — Atul Dhanotiya Portfolio
 * Vanilla ES6+ | No Dependencies
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
   * 1. LOADING SCREEN
   * --------------------------------------------------------*/
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.classList.add('loaded');

      // Remove from DOM after CSS transition finishes
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1500);
  }

  /* ----------------------------------------------------------
   * 2. SCROLL PROGRESS BAR
   * --------------------------------------------------------*/
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }

  /* ----------------------------------------------------------
   * 3. NAVBAR SCROLL BEHAVIOR
   * --------------------------------------------------------*/
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;

  function handleNavbarScroll() {
    if (!navbar) return;
    const currentScrollY = window.scrollY;

    // Hide on scroll-down, show on scroll-up
    if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 80) {
      navbar.classList.add('nav-hidden');
    } else if (currentScrollY < lastScrollY) {
      navbar.classList.remove('nav-hidden');
    }

    // Add background when scrolled past 50px
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  /* ----------------------------------------------------------
   * 4. ACTIVE SECTION HIGHLIGHTING
   * --------------------------------------------------------*/
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveSection() {
    if (!sections.length || !navLinks.length) return;

    let currentSectionId = '';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < 150) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
   * Unified scroll handler (debounced via requestAnimationFrame)
   * --------------------------------------------------------*/
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateScrollProgress();
        handleNavbarScroll();
        highlightActiveSection();
        handleBackToTop();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  // Fire once on load
  updateScrollProgress();
  highlightActiveSection();

  /* ----------------------------------------------------------
   * 5. MOBILE MENU
   * --------------------------------------------------------*/
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a mobile nav link is clicked
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Close mobile menu on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });

  /* ----------------------------------------------------------
   * 6. TYPEWRITER EFFECT
   * --------------------------------------------------------*/
  const typewriterEl = document.getElementById('typewriter');

  if (typewriterEl) {
    const roles = ['BCA Student', 'Web Developer', 'AI Enthusiast', 'Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Create blinking cursor span if it doesn't already exist
    if (!typewriterEl.nextElementSibling || !typewriterEl.nextElementSibling.classList.contains('typewriter-cursor')) {
      const cursor = document.createElement('span');
      cursor.classList.add('typewriter-cursor');
      cursor.textContent = '|';
      typewriterEl.parentNode.insertBefore(cursor, typewriterEl.nextSibling);
    }

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        // Typing forward
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
          // Pause at full word before deleting
          isDeleting = true;
          setTimeout(typeEffect, 2000);
          return;
        }
        setTimeout(typeEffect, 80);
      } else {
        // Deleting backward
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeEffect, 300);
          return;
        }
        setTimeout(typeEffect, 40);
      }
    }

    // Start after loading screen finishes
    setTimeout(typeEffect, 2000);
  }

  /* ----------------------------------------------------------
   * 7. SCROLL REVEAL (IntersectionObserver)
   * --------------------------------------------------------*/
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // One-time animation
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
   * 8. SMOOTH ANCHOR NAVIGATION
   * --------------------------------------------------------*/
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; // Skip bare "#" links

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
   * 9. BACK TO TOP BUTTON
   * --------------------------------------------------------*/
  const backToTopBtn = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    handleBackToTop(); // Initial check
  }

  /* ----------------------------------------------------------
   * 10. CUSTOM CURSOR (desktop only)
   * --------------------------------------------------------*/
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice) {
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');

    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let outlineX = 0;
    let outlineY = 0;
    let dotX = 0;
    let dotY = 0;

    document.addEventListener('mousemove', (e) => {
      dotX = e.clientX;
      dotY = e.clientY;
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;
    });

    // Smoothly animate outline to follow cursor
    function animateOutline() {
      outlineX += (dotX - outlineX) * 0.15;
      outlineY += (dotY - outlineY) * 0.15;
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      requestAnimationFrame(animateOutline);
    }
    requestAnimationFrame(animateOutline);

    // Hover-expand on interactive elements
    const interactiveSelectors = 'a, button, .gradient-btn, .card-hover, .project-card';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ----------------------------------------------------------
   * 11. COUNTER ANIMATION
   * --------------------------------------------------------*/
  const counters = document.querySelectorAll('.counter');

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /**
   * Smoothly animate a number from 0 to target over ~2 seconds.
   * @param {HTMLElement} el — element with data-target attribute
   */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 2000; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad for natural deceleration
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target; // Ensure exact final value
      }
    }

    requestAnimationFrame(step);
  }

  /* ----------------------------------------------------------
   * 12. CONTACT FORM HANDLING (Removed - Form deleted)
   * --------------------------------------------------------*/
});


/* --- js/projects.js --- */
/**
 * ============================================================
 * Projects Page Interactions — Atul Dhanotiya Portfolio
 * Card tilt, category filter, image zoom & staggered entrance.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
   * 1. PROJECT CARD TILT EFFECT (3D hover)
   * --------------------------------------------------------*/
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;

      // Mouse position relative to card center (–0.5 … 0.5)
      const xRatio = (e.clientX - rect.left) / cardWidth - 0.5;
      const yRatio = (e.clientY - rect.top) / cardHeight - 0.5;

      // Max ±5° rotation
      const rotateY = xRatio * 10;   // left-right tilt
      const rotateX = -yRatio * 10;  // up-down tilt

      card.style.transform = `perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'none';
      card.style.transition = 'transform 0.4s ease';
    });
  });

  /* ----------------------------------------------------------
   * 2. PROJECT CATEGORY FILTER
   * --------------------------------------------------------*/
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterableCards = document.querySelectorAll('.project-card[data-category]');

  if (filterBtns.length && filterableCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button state
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        filterableCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.display = '';

            // Trigger reflow then animate in
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';

            // Hide after transition completes
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------
   * 3. PROJECT IMAGE ZOOM (Removed - dead code)
   * --------------------------------------------------------*/

  /* ----------------------------------------------------------
   * 4. STAGGERED ENTRANCE ANIMATION
   * --------------------------------------------------------*/
  // Removed because `.card-enter` / `.visible` CSS is not defined.
  // The page already uses the `.reveal` + IntersectionObserver system.
});



