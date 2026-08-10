// ── Hlavička: změna vzhledu po scrollu ──
const header = document.getElementById('siteHeader');
const onScrollHeader = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScrollHeader();
window.addEventListener('scroll', onScrollHeader, { passive: true });

// ── Mobilní menu ──
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.main-nav a').forEach(a =>
  a.addEventListener('click', () => document.body.classList.remove('nav-open'))
);

// ── Parallax pozadí ──
const parallaxEls = document.querySelectorAll('.parallax');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && parallaxEls.length) {
  let ticking = false;
  const updateParallax = () => {
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh; // -1..1
      const speed = parseFloat(el.dataset.speed || 0.3);
      el.style.transform = `translateY(${progress * speed * -220}px)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
  }, { passive: true });
  updateParallax();
}

// ── Reveal animace při scrollu ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

// ── Zvýraznění aktivní sekce v menu ──
const sections = ['uvod', 'o-mne', 'cenik', 'aktuality', 'kontakt']
  .map(id => document.getElementById(id)).filter(Boolean);
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sectionIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => sectionIO.observe(s));

// ── Fotogalerie — lightbox ──
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
document.querySelectorAll('.g-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    lbImg.src = item.getAttribute('href');
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});
const closeLb = () => { lightbox.hidden = true; document.body.style.overflow = ''; };
document.getElementById('lbClose').addEventListener('click', closeLb);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLb(); });

// ── Aktuality: příspěvky z Facebooku (zdroj viz js/aktuality.js) ──
const fbFeed = document.getElementById('fbFeed');

const vykresliPrispevky = odkazy => {
  fbFeed.innerHTML = odkazy.slice(0, 3).map(url =>
    '<iframe class="fb-embed" loading="lazy" scrolling="no" allowfullscreen'
    + ' title="Příspěvek na Facebooku"'
    + ' src="https://www.facebook.com/plugins/post.php?width=500&show_text=true&href='
    + encodeURIComponent(url) + '"></iframe>'
  ).join('');
};

const vykresliUkazku = () => {
  const demo = [
    ['před 2 dny', 'V červenci máme ještě volné termíny na Breussovu masáž. Dopřejte svým zádům zasloužený odpočinek. 🌿'],
    ['před týdnem', 'Novinka ve studiu — regenerační baňkování. Objednávejte se na tel. 737 706 415. ✨'],
    ['před 2 týdny', 'Děkujeme za Vaše krásné recenze, moc si jich vážíme. Těšíme se na Vás! 💚']
  ];
  fbFeed.innerHTML =
    '<div class="fb-demo-note">Ukázka — zde se zobrazí příspěvky z&nbsp;Facebooku</div>'
    + demo.map(([kdy, text]) =>
      '<article class="fb-post"><header><span class="fb-avatar">L</span>'
      + '<div><strong>Relax studio LEA</strong><time>' + kdy + '</time></div></header>'
      + '<p>' + text + '</p></article>'
    ).join('');
};

// z textu tabulky vytáhne odkazy na facebookové příspěvky
const odkazyZTabulky = text => (text.match(/https?:\/\/[^\s",]+/g) || [])
  .filter(url => /facebook\.com|fb\.watch/.test(url));

const zaloha = (typeof FB_PRISPEVKY !== 'undefined' ? FB_PRISPEVKY : [])
  .filter(url => typeof url === 'string' && url.includes('facebook.com'));

if (typeof TABULKA_AKTUALIT !== 'undefined' && TABULKA_AKTUALIT) {
  fetch(TABULKA_AKTUALIT)
    .then(r => r.ok ? r.text() : Promise.reject(r.status))
    .then(text => {
      const odkazy = odkazyZTabulky(text);
      odkazy.length ? vykresliPrispevky(odkazy) : (zaloha.length ? vykresliPrispevky(zaloha) : vykresliUkazku());
    })
    .catch(() => zaloha.length ? vykresliPrispevky(zaloha) : vykresliUkazku());
} else if (zaloha.length) {
  vykresliPrispevky(zaloha);
} else {
  vykresliUkazku();
}

// ── Objednávkový formulář (bez backendu → předvyplněný e-mail) ──
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (!f.checkValidity()) { f.reportValidity(); return; }
  const d = new FormData(f);
  const body = [
    'Dobrý den,', '',
    'chci se objednat na masáž.', '',
    'Jméno a příjmení: ' + d.get('jmeno'),
    'E-mail: ' + d.get('email'),
    'Telefonní číslo: ' + d.get('telefon'),
    'Preferované datum: ' + (d.get('datum') || 'dle domluvy'),
    'Poznámka: ' + (d.get('poznamka') || '—')
  ].join('\n');
  window.location.href = 'mailto:leonaroubkova@centrum.cz'
    + '?subject=' + encodeURIComponent('Objednávka na masáž — ' + d.get('jmeno'))
    + '&body=' + encodeURIComponent(body);
  document.getElementById('formSent').hidden = false;
});
