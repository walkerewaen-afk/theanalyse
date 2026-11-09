(function () {
  var d = portfolioData;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var list = function (a) { return '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
  var chips = function (a) { return '<ul class="chips">' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };

  /* Simple text and link bindings */
  document.querySelectorAll('[data-bind]').forEach(function (el) { el.textContent = d[el.dataset.bind] || ''; });
  document.querySelectorAll('[data-href]').forEach(function (el) {
    var k = el.dataset.href, v = d[k] || '#';
    if (k === 'email') v = 'mailto:' + d.email;
    if (k === 'phone') v = 'tel:' + d.phone.replace(/\s/g, '');
    el.href = v;
  });
  $('#c-email').textContent = d.email;
  $('#c-phone').textContent = d.phone;

  /* About */
  $('#about-text').innerHTML = d.about.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
    '<ul class="edu">' + d.education.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>';

  /* Experience */
  $('#timeline').innerHTML = d.experience.map(function (e) {
    return '<li><h3>' + esc(e.role) + ', ' + esc(e.company) + '</h3>' +
      '<p class="meta">' + esc(e.dates) + ' &middot; ' + esc(e.place) + '</p>' +
      '<p>' + esc(e.summary) + '</p>' + list(e.achievements) +
      (e.impact ? '<p class="impact">' + esc(e.impact) + '</p>' : '') +
      (e.tools ? '<p class="tools">Tools: ' + esc(e.tools) + '</p>' : '') + '</li>';
  }).join('');

  /* Skills */
  $('#skills-list').innerHTML = '<dl>' + d.skills.map(function (g) {
    return '<div class="g"><dt>' + esc(g.group) + '</dt><dd style="margin:0">' + chips(g.items) + '</dd></div>';
  }).join('') + '</dl>';

  /* Project cards */
  $('#cards').innerHTML = d.projects.map(function (p, i) {
    return '<article class="card"><div class="media" data-img="' + esc(p.image || '') + '" data-alt="' + esc(p.name) + '"></div>' +
      '<div class="card-b"><p class="cat">' + esc(p.category) + '</p><h3>' + esc(p.name) + '</h3><p>' + esc(p.short) + '</p>' +
      '<p class="tools">Tools: ' + esc(p.tools.join(', ')) + '</p>' + chips(p.skills) +
      '<button class="btn" data-case="' + i + '">View Case Study</button></div></article>';
  }).join('');
  /* Image with graceful placeholder if the file has not been added yet */
  document.querySelectorAll('.media').forEach(function (m) {
    var ph = function () { m.innerHTML = '<div class="ph">' + esc(m.dataset.alt) + '</div>'; };
    if (!m.dataset.img) return ph();
    var im = new Image();
    im.className = 'thumb'; im.loading = 'lazy'; im.alt = 'Preview of ' + m.dataset.alt;
    im.onerror = ph; im.src = m.dataset.img; m.appendChild(im);
  });

  /* Case study dialog */
  var dlg = $('#case');
  function sec(t, body) { return '<section><h3>' + t + '</h3>' + body + '</section>'; }
  function open(i) {
    var p = d.projects[i], para = function (s) { return '<p>' + esc(s) + '</p>'; };
    var links = '';
    if (p.github) links += '<a class="btn ghost" href="' + esc(p.github) + '" target="_blank" rel="noopener">GitHub</a>';
    if (p.dashboard) links += '<a class="btn ghost" href="' + esc(p.dashboard) + '" target="_blank" rel="noopener">Dashboard</a>';
    if (p.doc) links += '<a class="btn ghost" href="' + esc(p.doc) + '" target="_blank" rel="noopener">Supporting document</a>';
    $('#case-body').innerHTML = '<p class="cat">' + esc(p.category) + '</p><h2 id="case-title">' + esc(p.name) + '</h2>' +
      sec('My role', para(p.role)) + sec('Business problem', para(p.problem)) + sec('Objective', para(p.objective)) +
      sec('Approach', para('Methods: ' + p.skills.join(', ') + '. Tools: ' + p.tools.join(', ') + '. Source: ' + p.data)) +
      sec('Analysis', list(p.analysis)) + sec('Findings', list(p.findings)) + sec('Recommendations', list(p.recs)) +
      sec('Outcome', para(p.outcome)) + sec('Business impact', para(p.impact)) + (links ? '<div class="case-links">' + links + '</div>' : '');
    dlg.showModal(); dlg.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-case]'); if (b) open(+b.dataset.case);
    if (e.target === dlg) dlg.close();
  });
  $('#close').addEventListener('click', function () { dlg.close(); });

  /* Theme toggle */
  $('#theme').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  });

  /* Mobile menu and nav border */
  var burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', function () {
    var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  var nav = $('#nav');
  addEventListener('scroll', function () { nav.classList.toggle('scrolled', scrollY > 8); }, { passive: true });

  /* Reveal sections */
  var rv = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .08 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* Contact form: Formspree with validation, loading, success and error states */
  var form = $('#form'), status = $('#status'), send = $('#send');
  form.action = d.formspreeEndpoint;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('.err').forEach(function (n) { n.remove(); });
    form.querySelectorAll('[required]').forEach(function (f) {
      f.removeAttribute('aria-invalid');
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
      if (bad) {
        ok = false; f.setAttribute('aria-invalid', 'true');
        var m = document.createElement('div'); m.className = 'err';
        m.textContent = f.type === 'email' ? 'Enter a valid email address.' : 'This field is required.';
        f.parentNode.appendChild(m);
      }
    });
    if (!ok) { form.querySelector('[aria-invalid]').focus(); status.className = 'bad'; status.textContent = 'Please fix the highlighted fields.'; return; }
    send.disabled = true; send.textContent = 'Sending...'; status.className = ''; status.textContent = '';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (r.ok) { form.reset(); status.className = 'ok'; status.textContent = 'Thank you. Your message has been sent.'; }
        else throw new Error();
      })
      .catch(function () { status.className = 'bad'; status.textContent = 'The message could not be sent. Please try again or email ' + d.email + '.'; })
      .finally(function () { send.disabled = false; send.textContent = 'Send message'; });
  });
})();
