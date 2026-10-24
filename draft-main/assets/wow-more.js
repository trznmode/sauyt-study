(function () {
  'use strict';

  var WA_PHONE = '77073281573';
  var WA_BASE = 'Здравствуйте! Интересует Project Sauyt. ';

  function waHref(msg) {
    return 'https://wa.me/' + WA_PHONE + '?text=' + encodeURIComponent(WA_BASE + msg);
  }

  function hourAlmaty() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Almaty',
        hour: 'numeric',
        hour12: false
      }).formatToParts(new Date());
      var h = parts.find(function (p) { return p.type === 'hour'; });
      return h ? parseInt(h.value, 10) : new Date().getHours();
    } catch (e) {
      return new Date().getHours();
    }
  }

  function isOnlineNow() {
    var h = hourAlmaty();
    var d = new Date();
    var day = d.getDay();
    if (day === 0 || day === 6) return h >= 10 && h < 18;
    return h >= 9 && h < 20;
  }

  function initOnlineChips() {
    var online = isOnlineNow();
    document.querySelectorAll('[data-online-chip]').forEach(function (el) {
      el.classList.toggle('is-away', !online);
      var text = el.querySelector('[data-online-text]');
      if (text) {
        text.textContent = online
          ? (el.getAttribute('data-online-on') || 'Сейчас на связи · ответ обычно до 30 мин')
          : (el.getAttribute('data-online-off') || 'Сейчас вне линии · ответим в рабочее время');
      }
    });
    var fab = document.getElementById('fabOnline');
    if (fab) fab.hidden = !online;
  }


  function initWaReviewShots() {
    document.querySelectorAll('[data-wa-shot]').forEach(function (wrap) {
      var src = wrap.getAttribute('data-wa-shot');
      if (!src) return;
      var img = wrap.querySelector('img');
      var ph = wrap.querySelector('[data-wa-ph]');
      if (!img) return;
      img.addEventListener('load', function () {
        img.hidden = false;
        if (ph) ph.hidden = true;
      });
      img.addEventListener('error', function () {
        img.hidden = true;
        if (ph) ph.hidden = false;
      });
      img.src = src;
    });
  }


  function initHeroMotion() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    requestAnimationFrame(function () { hero.classList.add('is-ready'); });
  }

  window.__psRefreshOnline = initOnlineChips;

  function boot() {
    initOnlineChips();
    initWaReviewShots();
    initHeroMotion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
