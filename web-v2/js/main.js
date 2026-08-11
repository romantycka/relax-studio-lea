/* Relax studio LEA — varianta 2
   Animace při scrollu, parallax, menu, detaily služeb, galerie, formulář. */
(function () {
  'use strict';

  var klid = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── video na pozadí hero ──
     Zdroj se nastavuje až v JS, aby se na mobilech a při úspoře dat nestahoval. */
  var video = document.getElementById('heroVideo');
  if (video && !klid && window.innerWidth > 860) {
    var setrneData = navigator.connection && navigator.connection.saveData;
    if (!setrneData) {
      video.src = 'video/hero.mp4?v=2';
      video.load();
      var prehrat = video.play();
      if (prehrat && prehrat.catch) prehrat.catch(function () {});
    }
  }

  /* ── hlavička ── */
  var hdr = document.getElementById('hdr');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function stav() {
    hdr.classList.toggle('is-stuck', window.scrollY > 60);
  }
  stav();

  burger.addEventListener('click', function () {
    var otevreno = hdr.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', otevreno ? 'true' : 'false');
    burger.setAttribute('aria-label', otevreno ? 'Zavřít menu' : 'Otevřít menu');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      hdr.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── odkrývání prvků při scrollu ── */
  var prvky = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
  if (klid || !('IntersectionObserver' in window)) {
    prvky.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var oko = new IntersectionObserver(function (zaznamy) {
      zaznamy.forEach(function (z) {
        if (z.isIntersecting) {
          z.target.classList.add('is-in');
          oko.unobserve(z.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    prvky.forEach(function (el) { oko.observe(el); });
  }

  /* ── parallax ── */
  var vrstvy = klid ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-speed]'));
  var ticking = false;

  function posun() {
    var vyska = window.innerHeight;
    vrstvy.forEach(function (el) {
      var box = el.getBoundingClientRect();
      if (box.bottom < -200 || box.top > vyska + 200) return;
      var stred = box.top + box.height / 2 - vyska / 2;
      var rychlost = parseFloat(el.dataset.speed) || 0.1;
      el.style.transform = 'translate3d(0,' + (-stred * rychlost).toFixed(2) + 'px,0)';
    });
    ticking = false;
  }

  function naScroll() {
    stav();
    if (!ticking) {
      window.requestAnimationFrame(posun);
      ticking = true;
    }
  }
  window.addEventListener('scroll', naScroll, { passive: true });
  window.addEventListener('resize', posun);
  posun();

  /* ── rozbalení detailu služby ── */
  document.querySelectorAll('.srv-more').forEach(function (btn) {
    var karta = btn.closest('.srv');
    var detail = karta.querySelector('.srv-detail');
    var puvodni = btn.innerHTML;
    btn.addEventListener('click', function () {
      var otevreno = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', otevreno ? 'false' : 'true');
      detail.hidden = otevreno;
      btn.innerHTML = otevreno ? puvodni : 'Skrýt';
    });
  });

  /* ── delší text „O mně“ ── */
  var aboutBtn = document.getElementById('aboutToggle');
  var aboutRest = document.getElementById('aboutRest');
  if (aboutBtn && aboutRest) {
    aboutBtn.addEventListener('click', function () {
      var otevreno = aboutBtn.getAttribute('aria-expanded') === 'true';
      aboutBtn.setAttribute('aria-expanded', otevreno ? 'false' : 'true');
      aboutRest.hidden = otevreno;
      aboutBtn.textContent = otevreno ? 'Číst celý příběh' : 'Skrýt příběh';
    });
  }

  /* ── tlačítko Objednat u služby → zaškrtne službu ve formuláři ── */
  var chips = document.getElementById('chips');

  function zaskrtni(nazev) {
    if (!chips) return null;
    var vstupy = chips.querySelectorAll('input[name="sluzba"]');
    for (var i = 0; i < vstupy.length; i++) {
      if (vstupy[i].value.indexOf(nazev) === 0) {
        vstupy[i].checked = true;
        return vstupy[i];
      }
    }
    return null;
  }

  document.querySelectorAll('.srv-book').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var karta = btn.closest('.srv');
      var nazev = karta.getAttribute('data-srv');
      var vstup = zaskrtni(nazev);
      karta.classList.add('is-picked');
      document.getElementById('objednavka').scrollIntoView({ behavior: klid ? 'auto' : 'smooth' });
      if (vstup) {
        window.setTimeout(function () {
          var jmeno = document.querySelector('input[name="jmeno"]');
          if (jmeno) jmeno.focus({ preventScroll: true });
        }, klid ? 0 : 700);
      }
    });
  });

  /* ── galerie / lightbox ── */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbX = document.getElementById('lbX');

  document.querySelectorAll('.gal').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      lbImg.src = a.getAttribute('href');
      lbImg.alt = a.querySelector('img').alt;
      lb.hidden = false;
      lbX.focus();
    });
  });
  function zavri() { lb.hidden = true; lbImg.removeAttribute('src'); }
  lbX.addEventListener('click', zavri);
  lb.addEventListener('click', function (e) { if (e.target === lb) zavri(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lb.hidden) zavri();
  });

  /* ── formulář ── */
  var form = document.getElementById('form');
  var hlaska = document.getElementById('formOk');

  function chyba(pole, zobrazit) {
    var obal = pole.closest('.f-field');
    var text = obal.querySelector('.f-err');
    obal.classList.toggle('is-bad', zobrazit);
    if (text) text.hidden = !zobrazit;
    pole.setAttribute('aria-invalid', zobrazit ? 'true' : 'false');
  }

  function platny(pole) {
    var v = pole.value.trim();
    if (!v) return false;
    if (pole.type === 'email') return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
    if (pole.type === 'tel') return v.replace(/[^\d]/g, '').length >= 9;
    return v.length >= 2;
  }

  var povinna = form.querySelectorAll('input[required]');
  povinna.forEach(function (pole) {
    pole.addEventListener('blur', function () {
      if (pole.value.trim()) chyba(pole, !platny(pole));
    });
    pole.addEventListener('input', function () {
      if (pole.closest('.f-field').classList.contains('is-bad') && platny(pole)) chyba(pole, false);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var prvniSpatne = null;
    povinna.forEach(function (pole) {
      var ok = platny(pole);
      chyba(pole, !ok);
      if (!ok && !prvniSpatne) prvniSpatne = pole;
    });
    if (prvniSpatne) {
      prvniSpatne.focus();
      return;
    }

    var data = new FormData(form);
    var sluzby = data.getAll('sluzba');
    var radky = [
      'Objednávka z webu Relax studio LEA',
      '',
      'Jméno: ' + data.get('jmeno'),
      'E-mail: ' + data.get('email'),
      'Telefon: ' + data.get('telefon'),
      'Preferovaný termín: ' + (data.get('datum') || 'neuveden'),
      '',
      'Vybrané služby:',
      sluzby.length ? sluzby.map(function (s) { return '- ' + s; }).join('\n') : '- neuvedeno (domluvíme se)',
      '',
      'Poznámka:',
      data.get('poznamka') || '—'
    ];

    var predmet = 'Objednávka masáže — ' + data.get('jmeno');
    window.location.href = 'mailto:leonaroubkova@centrum.cz'
      + '?subject=' + encodeURIComponent(predmet)
      + '&body=' + encodeURIComponent(radky.join('\n'));

    hlaska.hidden = false;
  });
})();
