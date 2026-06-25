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
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';

      // Smooth transition class (removed after CSS transition ends)
      html.classList.add('theme-transition');
      setTimeout(() => html.classList.remove('theme-transition'), 500);

      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }
});
