// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Theme toggle (dark mode) =====
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = (() => {
  try { return localStorage.getItem('mk-theme'); } catch (e) { return null; }
})();
if (savedTheme) root.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  if (next === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  try { localStorage.setItem('mk-theme', next); } catch (e) { /* storage unavailable, ignore */ }
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const mainNav = document.querySelector('.main-nav');
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('nav-open'));
});

// ===== Typing animation for hero role line =====
const roles = [
  'Aspiring Data Analyst',
  'MIS Executive',
  'Reporting Analyst',
  'Business Analyst'
];
const typedEl = document.getElementById('typedRole');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeLoop() {
  if (prefersReducedMotion) {
    typedEl.textContent = roles.join(' · ');
    return;
  }
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  tick();
}
typeLoop();

// ===== Animated KPI counters (hero) =====
const counters = document.querySelectorAll('.metric-num');
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion) {
    el.textContent = target.toLocaleString() + suffix;
    return;
  }
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + suffix;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
counters.forEach(c => counterObserver.observe(c));

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ===== Sticky header shrink shadow on scroll + back-to-top =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 480) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

// ===== Contact form (UI only — opens a pre-filled email) =====
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const message = document.getElementById('cf-message').value.trim();

  if (!name || !email || !message) {
    formNote.style.color = 'var(--danger)';
    formNote.textContent = 'Please fill in all fields.';
    return;
  }

  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:kmohim461@gmail.com?subject=${subject}&body=${body}`;

  formNote.style.color = 'var(--success)';
  formNote.textContent = 'Opening your email client to send this message…';
  contactForm.reset();
});

// ===== Lazy loading images =====
document.querySelectorAll('img').forEach(img => {
  if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
});
