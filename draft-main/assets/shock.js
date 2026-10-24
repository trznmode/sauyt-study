(function () {
  'use strict';

  function money(n) {
    var v = Math.round(n);
    return v.toLocaleString('ru-RU') + ' ₸';
  }

  function initRotting() {
    var days = document.getElementById('rotDays');
    var replies = document.getElementById('rotReplies');
    var box = document.getElementById('rotStatus');
    if (!days || !replies || !box) return;

    function sync() {
      var d = parseInt(days.value, 10) || 0;
      var r = replies.value;
      var bad = d < 60 || r === 'no';
      box.classList.toggle('is-bad', bad);
      box.classList.toggle('is-ok', !bad);
      var title = box.querySelector('[data-rot-title]');
      var text = box.querySelector('[data-rot-text]');
      if (bad) {
        if (title) title.textContent = 'Карточка гниёт · сейчас теряете выдачу';
        if (text) {
          text.textContent = d < 60 && r === 'no'
            ? 'Календарь короче 60 дней и отзывы без ответов — двойной удар по видимости и доверию.'
            : d < 60
              ? 'Календарь открыт меньше чем на 60 дней: гости ищут дальше — вас просто нет в выдаче.'
              : 'Гости читают молчание на отзывы как «объекту всё равно». Это режет конверсию.';
        }
      } else {
        if (title) title.textContent = 'База живая';
        if (text) text.textContent = 'Календарь ≥ 60 дней и отзывы в работе. Дальше — цена, фото и события на ближайшие дни.';
      }
    }
    days.addEventListener('input', sync);
    replies.addEventListener('change', sync);
    sync();
  }

  function initEventsHeat() {
    var heatEl = document.getElementById('heatGrid');
    var listEl = document.getElementById('eventList');
    if (!heatEl || !listEl) return;

    var today = new Date();
    var dow = today.getDay(); // 0 sun
    function lvl(city) {
      // simple public-signal proxy: weekend+resort high, weekday biz mid/high
      if (city === 'Боровое') return (dow === 5 || dow === 6 || dow === 0) ? 'high' : 'mid';
      if (city === 'Алматы') return (dow >= 1 && dow <= 4) ? 'high' : 'mid';
      if (city === 'Астана') return (dow >= 1 && dow <= 5) ? 'high' : 'low';
      if (city === 'Капчагай') return (dow === 5 || dow === 6) ? 'high' : 'low';
      if (city === 'Актау') return 'mid';
      return 'mid';
    }
    var label = { high: 'высокий сегодня', mid: 'средний', low: 'спокойно' };
    var cities = ['Алматы', 'Астана', 'Боровое', 'Капчагай', 'Шымкент', 'Актау'];
    heatEl.innerHTML = cities.map(function (c) {
      var l = lvl(c);
      return '<div class="heat-pill" data-lvl="' + l + '"><b>' + c + '</b><span>' + label[l] + '</span></div>';
    }).join('');

    var pool = [
      { city: 'Алматы', title: 'Концерт / арена', tip: 'поднять пт–вс' },
      { city: 'Астана', title: 'Деловой форум', tip: 'будни + стоп' },
      { city: 'Боровое', title: 'Выездные выходные', tip: 'мин. 2 ночи' },
      { city: 'Капчагай', title: 'Жара + выезд из города', tip: 'короткие брони' },
      { city: 'Алматы', title: 'Стендап / клубное событие', tip: 'ночи рядом' },
      { city: 'Шымкент', title: 'Региональный праздник', tip: 'открыть даты' },
      { city: 'Актау', title: 'Вахтовый разъезд', tip: 'длинные брони' },
      { city: 'Астана', title: 'Выставка', tip: 'пакет 1–2 ночи' },
      { city: 'Боровое', title: 'Школьные каникулы (ориентир)', tip: 'неделя+' },
      { city: 'Алматы', title: 'Матч / спорт', tip: 'соседние даты' }
    ];

    var months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    var html = '';
    for (var i = 0; i < 14; i++) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      var ev = pool[(i * 3 + dow) % pool.length];
      html += '<div class="event-row"><time>' + d.getDate() + ' ' + months[d.getMonth()] + '</time><div><strong>' + ev.title + '</strong><em>' + ev.city + '</em></div><span class="tip">' + ev.tip + '</span></div>';
    }
    listEl.innerHTML = html;
  }

  function initSimulator() {
    var root = document.getElementById('bookingSim');
    if (!root) return;
    var photo = root.querySelector('[name="simPhoto"]');
    var cal = root.querySelector('[name="simCal"]');
    var price = root.querySelector('[name="simPrice"]');
    var reviews = root.querySelector('[name="simReviews"]');
    var meter = root.querySelector('[data-sim-meter]');
    var chance = root.querySelector('[data-sim-chance]');
    var moneyEl = root.querySelector('[data-sim-money]');
    var rooms = root.querySelector('[name="simRooms"]');
    var adr = root.querySelector('[name="simAdr"]');

    function score() {
      var p = parseInt(photo.value, 10);
      var c = parseInt(cal.value, 10);
      var pr = parseInt(price.value, 10);
      var r = parseInt(reviews.value, 10);
      // weighted 0-100
      return Math.round(p * 0.3 + c * 0.3 + pr * 0.2 + r * 0.2);
    }

    function sync() {
      var s = score();
      if (chance) chance.textContent = s + '%';
      meter.classList.remove('is-low', 'is-mid', 'is-high');
      meter.classList.add(s < 45 ? 'is-low' : s < 70 ? 'is-mid' : 'is-high');
      var hint = root.querySelector('[data-sim-hint]');
      if (hint) {
        hint.textContent = s < 45
          ? 'Проваливаетесь: гость уходит к соседу ещё на выдаче.'
          : s < 70
            ? 'Середина: брони есть, но вы недобираете очевидные даты.'
            : 'Сильная позиция: держите календарь и не ломайте базу скидками.';
      }
      var rm = parseInt((rooms && rooms.value) || '20', 10);
      var a = parseInt((adr && adr.value) || '25000', 10);
      var miss = (100 - s) / 100 * rm * 0.35 * a * 30; // rough monthly miss
      if (moneyEl) moneyEl.textContent = 'Ориентир недобора / мес.: ≈ ' + money(miss);
      root.querySelectorAll('[data-sim-val]').forEach(function (el) {
        var key = el.getAttribute('data-sim-val');
        var input = root.querySelector('[name="' + key + '"]');
        if (input) el.textContent = input.value;
      });
    }

    root.querySelectorAll('input').forEach(function (el) {
      el.addEventListener('input', sync);
    });

    root.querySelectorAll('[data-break]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.classList.toggle('is-on');
        var on = btn.classList.contains('is-on');
        var map = {
          cal: ['simCal', 25],
          photo: ['simPhoto', 20],
          price: ['simPrice', 30],
          reviews: ['simReviews', 25]
        };
        var key = btn.getAttribute('data-break');
        var conf = map[key];
        if (!conf) return;
        var input = root.querySelector('[name="' + conf[0] + '"]');
        if (!input) return;
        if (on) {
          input.dataset.prev = input.value;
          input.value = String(conf[1]);
        } else if (input.dataset.prev) {
          input.value = input.dataset.prev;
        }
        sync();
      });
    });

    sync();
  }

  function initCompareSlider() {
    var root = document.getElementById('compareSlider');
    if (!root) return;
    var top = root.querySelector('.compare-slider__top');
    var handle = root.querySelector('.compare-slider__handle');
    var dragging = false;

    function setPos(clientX) {
      var rect = root.getBoundingClientRect();
      var x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      var pct = (x / rect.width) * 100;
      top.style.width = pct + '%';
      handle.style.left = pct + '%';
      var img = top.querySelector('img');
      if (img) img.style.width = rect.width + 'px';
    }

    function start(e) {
      dragging = true;
      root.classList.add('is-dragging');
      setPos(e.touches ? e.touches[0].clientX : e.clientX);
    }
    function move(e) {
      if (!dragging) return;
      setPos(e.touches ? e.touches[0].clientX : e.clientX);
    }
    function end() {
      dragging = false;
      root.classList.remove('is-dragging');
    }

    handle.addEventListener('mousedown', start);
    handle.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
    root.addEventListener('click', function (e) {
      if (e.target.closest('.compare-slider__handle')) return;
      setPos(e.clientX);
    });
    window.addEventListener('resize', function () {
      setPos(root.getBoundingClientRect().left + root.offsetWidth * 0.5);
    });
    setPos(root.getBoundingClientRect().left + root.offsetWidth * 0.5);
  }

  function initLossCalc() {
    var rooms = document.getElementById('lossRooms');
    var adr = document.getElementById('lossAdr');
    var empty = document.getElementById('lossEmpty');
    var closed = document.getElementById('lossClosed');
    var out = document.getElementById('lossOut');
    var sub = document.getElementById('lossSub');
    if (!rooms || !out) return;

    function sync() {
      var r = parseFloat(rooms.value) || 0;
      var a = parseFloat(adr.value) || 0;
      var e = parseFloat(empty.value) || 0; // empty nights share 0-100 of month capacity miss
      var c = parseFloat(closed.value) || 0; // days calendar closed beyond near term as miss factor
      // empty nights per month ≈ rooms * 30 * (empty%/100)
      var emptyNights = r * 30 * (e / 100);
      // closed calendar penalty: assume c days of invisible demand * rooms * 0.25 fill chance
      var closedNights = r * c * 0.25;
      var total = (emptyNights + closedNights) * a;
      out.textContent = '− ' + money(total) + ' / мес.';
      if (sub) {
        sub.textContent = 'Пустые ночи ≈ ' + Math.round(emptyNights) +
          ' + «невидимые» из‑за короткого календаря ≈ ' + Math.round(closedNights) +
          '. Это ориентир потерь, не отчёт Booking.';
      }
    }
    [rooms, adr, empty, closed].forEach(function (el) {
      if (el) el.addEventListener('input', sync);
    });
    sync();
  }

  function initReviewMoney() {
    var drop = document.getElementById('revDrop');
    var bookings = document.getElementById('revBookings');
    var adr = document.getElementById('revAdr');
    var out = document.getElementById('revOut');
    if (!drop || !out) return;
    function sync() {
      var d = parseFloat(drop.value) || 0; // 0.1 steps
      var b = parseFloat(bookings.value) || 0;
      var a = parseFloat(adr.value) || 0;
      // model: each -0.1 rating ≈ 3% of monthly bookings lost
      var units = d / 0.1;
      var lostBookings = b * 0.03 * units;
      var lostMoney = lostBookings * a;
      out.textContent = '≈ −' + lostBookings.toFixed(1) + ' брони / мес. · −' + money(lostMoney);
      var label = document.getElementById('revDropLbl');
      if (label) label.textContent = '−' + d.toFixed(1);
    }
    [drop, bookings, adr].forEach(function (el) { el.addEventListener('input', sync); });
    sync();
  }

  function boot() {
    initRotting();
    initEventsHeat();
    initSimulator();
    initCompareSlider();
    initLossCalc();
    initReviewMoney();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
