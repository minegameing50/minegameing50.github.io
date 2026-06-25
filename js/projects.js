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
   * 3. PROJECT IMAGE ZOOM (class-based toggle)
   * --------------------------------------------------------*/
  const projectImages = document.querySelectorAll('.project-card .project-image');

  projectImages.forEach((img) => {
    img.addEventListener('mouseenter', () => img.classList.add('zoomed'));
    img.addEventListener('mouseleave', () => img.classList.remove('zoomed'));
  });

  /* ----------------------------------------------------------
   * 4. STAGGERED ENTRANCE ANIMATION
   * --------------------------------------------------------*/
  projectCards.forEach((card, index) => {
    // Start hidden
    card.classList.add('card-enter');

    // Stagger by 100ms per card
    setTimeout(() => {
      card.classList.add('visible');
    }, 100 * index);
  });
});
