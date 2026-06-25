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
   * 12. CONTACT FORM HANDLING
   * --------------------------------------------------------*/
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Find or create success message element
      let successMsg = contactForm.querySelector('.form-success');
      if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.classList.add('form-success');
        successMsg.textContent = 'Thank you! Message sent successfully.';
        contactForm.appendChild(successMsg);
      }

      // Show success feedback
      successMsg.classList.add('visible');

      // Reset form & hide message after 3 seconds
      setTimeout(() => {
        contactForm.reset();
        successMsg.classList.remove('visible');
      }, 3000);
    });
  }
});
