/* VCO — home page prototype. Small, dependency-free, and the page works without it. */
(function () {
  var doc = document.documentElement;
  var header = document.querySelector('.site-header');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: swap the descriptor for the small logo once the masthead has scrolled away. */
  var masthead = document.querySelector('.mark--hero');
  if (masthead && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('past-masthead', !entries[0].isIntersecting);
    }, { rootMargin: '-64px 0px 0px 0px' }).observe(masthead);
  }

  /* The layer index: six bars that fill as you read down the page. */
  var bars = document.querySelectorAll('.index span');
  var ticking = false;
  function paintIndex() {
    ticking = false;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 1;
    var filled = Math.min(6, 1 + Math.floor(p * 6 - 0.0001));
    for (var i = 0; i < bars.length; i++) bars[i].classList.toggle('on', i < filled);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(paintIndex); }
  }, { passive: true });
  window.addEventListener('resize', paintIndex);
  paintIndex();

  /* Rules draw themselves, once, as they come into view. */
  var rules = document.querySelectorAll('.draw');
  if (reduce || !('IntersectionObserver' in window)) {
    rules.forEach(function (r) { r.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    rules.forEach(function (r) { io.observe(r); });
  }

  /* Phone menu. */
  var menuButton = document.querySelector('.menu-button');
  if (menuButton) {
    menuButton.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuButton.textContent = open ? 'Close' : 'Menu';
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = 'Menu';
      });
    });
  }

  /* Local time in the office, in the footer. */
  var clock = document.querySelector('[data-clock]');
  function tick() {
    try {
      clock.textContent = new Intl.DateTimeFormat('en-NZ', {
        hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Pacific/Auckland'
      }).format(new Date()).replace(/\s/g, ' ').toUpperCase();
    } catch (e) { /* keep the static fallback */ }
  }
  if (clock) { tick(); setInterval(tick, 30000); }

  /* Contact form: this prototype has no back end, so it confirms without sending. */
  var form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var name = (form.elements.name.value || '').trim().split(/\s+/)[0];
      var thanks = form.querySelector('[data-thanks]');
      if (name) thanks.textContent = 'Thanks, ' + name + '. A valuer will be in touch.';
      form.classList.add('is-sent');
      form.querySelector('.sent').focus();
    });
  }
})();
