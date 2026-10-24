(function () {
  function L(s) {
    if (window.__psGetLang && window.__psGetLang() === 'kz' && typeof window.__psT === 'function') {
      return window.__psT(s);
    }
    return s;
  }

  var checks = [
    { id: 'photos', label: 'На карточке 15+ нормальных фото (номера, ванная, общие зоны)' },
    { id: 'calendar', label: 'Календарь открыт минимум на 3–6 месяцев вперёд' },
    { id: 'price', label: 'Цены выглядят логично vs похожие объекты рядом' },
    { id: 'rating', label: 'Рейтинг 8.5+ или активно поднимаем отзывы' },
    { id: 'replies', label: 'Отвечаем на отзывы (особенно негативные) за 48 часов' },
    { id: 'desc', label: 'В описании есть конкретика: район, кому подходит, что рядом' },
    { id: 'policies', label: 'Правила заезда/отмены понятные, без сюрпризов для гостя' },
    { id: 'messages', label: 'Сообщения гостям отвечаем быстро в рабочее время' }
  ];

  var list = document.getElementById('checkerList');
  var scoreEl = document.getElementById('checkerScore');
  var verdictEl = document.getElementById('checkerVerdict');
  var tipsEl = document.getElementById('checkerTips');
  var ring = document.getElementById('checkerRing');
  var urlInput = document.getElementById('checkerUrl');
  var waBtn = document.getElementById('checkerWa');
  if (!list || !scoreEl) return;

  function renderList() {
    var selectedIds = Array.prototype.slice.call(list.querySelectorAll('input:checked')).map(function (el) {
      return el.value;
    });
    list.innerHTML = checks.map(function (c) {
      var on = selectedIds.indexOf(c.id) !== -1 ? ' checked' : '';
      return (
        '<label class="checker__item" data-id="' + c.id + '">' +
        '<input type="checkbox" value="' + c.id + '"' + on + '>' +
        '<span>' + L(c.label) + '</span>' +
        '</label>'
      );
    }).join('');
  }

  function selected() {
    return Array.prototype.slice.call(list.querySelectorAll('input:checked')).map(function (el) {
      return el.value;
    });
  }

  function update() {
    var on = selected();
    var score = Math.round((on.length / checks.length) * 100);
    scoreEl.textContent = score + '%';
    if (ring) ring.style.setProperty('--score', String(score));

    list.querySelectorAll('.checker__item').forEach(function (row) {
      var input = row.querySelector('input');
      row.classList.toggle('is-on', !!(input && input.checked));
    });

    var missing = checks.filter(function (c) { return on.indexOf(c.id) === -1; });
    var verdictRu;
    var tipsRu;
    if (score >= 85) {
      verdictRu = 'Карточка в хорошей форме';
      tipsRu = 'База ок. Следующий шаг — точечно усилить слабые даты и второй канал (Ostrovok/Bronevik), чтобы не зависеть только от Booking.';
    } else if (score >= 55) {
      verdictRu = 'Есть запас роста';
      tipsRu = 'Брони «отъедают» пробелы ниже. Закройте 2–3 пункта из списка — обычно это быстрее, чем крутить скидки.';
    } else {
      verdictRu = 'Карточка теряет гостей';
      tipsRu = 'Сейчас гости чаще уходят к конкурентам. Сначала фото, календарь и отзывы — без этого акции почти не помогают.';
    }
    if (verdictEl) verdictEl.textContent = L(verdictRu);
    if (tipsEl) {
      var html = '<p>' + L(tipsRu) + '</p>';
      if (missing.length) {
        html += '<ul>' + missing.slice(0, 4).map(function (m) {
          return '<li>' + L(m.label) + '</li>';
        }).join('') + '</ul>';
      }
      tipsEl.innerHTML = html;
    }

    if (waBtn) {
      var urlRaw = (urlInput && urlInput.value.trim()) || '';
      var url = urlRaw || L('ссылку пришлю отдельно');
      var msg =
        L('Хочу бесплатный разбор карточки за 24 часа. Ссылка: ') + url +
        '. ' + L('Самопроверка:') + ' ' + score + '%. ' + L('Не отмечено:') + ' ' +
        (missing.map(function (m) { return L(m.label); }).join('; ') || L('всё отмечено'));
      waBtn.setAttribute('data-wa-msg', msg);
      if (typeof window.refreshWaLinks === 'function') window.refreshWaLinks();
      else {
        var phone = '77073281573';
        var base = L('Здравствуйте! Интересует Project Sauyt. ');
        waBtn.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(base + msg);
        waBtn.target = '_blank';
        waBtn.rel = 'noopener noreferrer';
      }
    }
  }

  function boot() {
    renderList();
    update();
  }

  list.addEventListener('change', update);
  if (urlInput) urlInput.addEventListener('input', update);
  document.addEventListener('ps:lang', boot);
  boot();
})();
