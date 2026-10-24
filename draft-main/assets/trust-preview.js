(function () {
  var modal = document.getElementById('trustModal');
  var modalBody = document.getElementById('trustModalBody');
  if (!modal || !modalBody || !window.TRUST_CLIENTS) return;

  var photoIndex = 0;
  var activeClient = null;
  var lastFocus = null;

  function L(s) {
    if (window.__psGetLang && window.__psGetLang() === 'kz' && typeof window.__psT === 'function') {
      return window.__psT(s);
    }
    return s;
  }

  function trustRoomLabel(n) {
    if (n == null) return '';
    var m = n % 10;
    var m2 = n % 100;
    if (m2 >= 11 && m2 <= 14) return n + ' ' + L('номеров');
    if (m === 1) return n + ' ' + L('номер');
    if (m >= 2 && m <= 4) return n + ' ' + L('номера');
    return n + ' ' + L('номеров');
  }

  function starsHtml(count) {
    if (!count) return '';
    var s = '';
    for (var i = 0; i < count; i++) s += '★';
    return '<span class="trust-preview__stars" aria-label="' + count + ' ' + L('звезды') + '">' + s + '</span>';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function galleryHtml(client) {
    var photos = client.photos || [];
    if (!photos.length) {
      return (
        '<div class="trust-preview__gallery">' +
          '<div class="trust-preview__gallery-placeholder">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
              '<path d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>' +
              '<path d="M9 21V12h6v9"/>' +
            '</svg>' +
            '<span>' + L('Фото и рейтинг — на странице Booking.com') + '</span>' +
          '</div>' +
        '</div>'
      );
    }

    var dots = photos.map(function (_, i) {
      return '<button type="button" class="trust-preview__gallery-dot' + (i === 0 ? ' is-active' : '') +
        '" data-trust-photo="' + i + '" aria-label="' + L('Фото') + ' ' + (i + 1) + '"></button>';
    }).join('');

    var nav = photos.length > 1
      ? '<button type="button" class="trust-preview__gallery-nav trust-preview__gallery-nav--prev" data-trust-photo-prev aria-label="' + L('Предыдущее фото') + '">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>' +
        '</button>' +
        '<button type="button" class="trust-preview__gallery-nav trust-preview__gallery-nav--next" data-trust-photo-next aria-label="' + L('Следующее фото') + '">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>' +
        '</button>' +
        '<div class="trust-preview__gallery-dots">' + dots + '</div>'
      : '';

    return (
      '<div class="trust-preview__gallery" id="trustPreviewGallery">' +
        '<img src="' + escapeHtml(photos[0]) + '" alt="' + escapeHtml(client.name) + '" id="trustPreviewPhoto">' +
        nav +
      '</div>'
    );
  }

  function scoreHtml(client) {
    if (client.rating == null) return '';
    var label = L(client.ratingLabel || 'Оценка гостей');
    return (
      '<div class="trust-preview__score">' +
        '<b>' + client.rating.toFixed(1).replace('.', ',') + '</b>' +
        '<span>' + escapeHtml(label) + '</span>' +
      '</div>'
    );
  }

  function reviewsHtml(client) {
    if (!client.reviews) return '';
    return '<p class="trust-preview__reviews">' + client.reviews.toLocaleString('ru-RU') + ' ' + L('отзывов на Booking.com') + '</p>';
  }

  function previewHint(client) {
    if (client.instagramUrl && !client.bookingUrl) return L('Профиль в Instagram');
    return L('Предпросмотр на Booking.com');
  }

  function primaryLink(client) {
    if (client.bookingUrl) {
      return {
        href: client.bookingUrl,
        label: L('Открыть на Booking.com'),
        badge: 'Booking.com',
        subtitle: L('Предпросмотр профиля объекта')
      };
    }
    if (client.instagramUrl) {
      return {
        href: client.instagramUrl,
        label: L('Открыть в Instagram'),
        badge: 'Instagram',
        subtitle: L('Профиль объекта в соцсети')
      };
    }
    return null;
  }

  function noteHtml(client) {
    var link = primaryLink(client);
    if (client.work) return '<p class="trust-preview__note">' + L(client.work) + '</p>';
    var platform = link && link.badge === 'Instagram' ? 'Instagram' : 'Booking.com';
    return (
      '<p class="trust-preview__note">' +
        '<strong>Project Sauyt</strong> ' + L('настраивал и сопровождает этот объект.') + ' ' +
        L('Полный профиль с актуальным рейтингом и галереей — на') + ' ' + platform + '.' +
      '</p>'
    );
  }

  function renderModal(client) {
    photoIndex = 0;
    activeClient = client;
    var link = primaryLink(client);
    var brand = link || { badge: 'Booking.com', subtitle: L('Предпросмотр профиля объекта'), href: '#', label: L('Закрыть') };
    var actions = link
      ? '<a class="trust-preview__btn trust-preview__btn--primary" href="' + escapeHtml(link.href) + '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(link.label) +
        '</a>'
      : '';

    modalBody.innerHTML =
      galleryHtml(client) +
      '<div class="trust-preview__brand trust-preview__brand--' + (link && link.badge === 'Instagram' ? 'instagram' : 'booking') + '">' +
        '<span class="trust-preview__brand-badge">' + escapeHtml(link ? link.badge : 'Project Sauyt') + '</span>' +
        '<span>' + escapeHtml(link ? link.subtitle : L('Предпросмотр объекта')) + '</span>' +
      '</div>' +
      '<div class="trust-preview__body">' +
        '<div class="trust-preview__head">' +
          '<div>' +
            '<h3 class="trust-preview__title" id="trustModalTitle">' + escapeHtml(client.name) + '</h3>' +
            '<div class="trust-preview__meta">' +
              '<span><img class="inline-flag" src="assets/flags/kz.svg" alt="" width="16" height="12" decoding="async"> ' + escapeHtml(L(client.city)) + '</span>' +
              starsHtml(client.stars) +
              (client.rooms != null ? '<span>' + trustRoomLabel(client.rooms) + '</span>' : '') +
            '</div>' +
            reviewsHtml(client) +
          '</div>' +
          scoreHtml(client) +
        '</div>' +
        noteHtml(client) +
      '</div>' +
      '<div class="trust-preview__actions">' +
        actions +
        '<button type="button" class="trust-preview__btn trust-preview__btn--ghost" data-trust-close>' + L('Закрыть') + '</button>' +
      '</div>';

    bindGallery(client);
  }

  function setPhoto(index) {
    if (!activeClient || !activeClient.photos || !activeClient.photos.length) return;
    var photos = activeClient.photos;
    photoIndex = (index + photos.length) % photos.length;
    var img = document.getElementById('trustPreviewPhoto');
    if (img) img.src = photos[photoIndex];
    modalBody.querySelectorAll('.trust-preview__gallery-dot').forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === photoIndex);
    });
  }

  function bindGallery(client) {
    if (!client.photos || client.photos.length <= 1) return;
    var prev = modalBody.querySelector('[data-trust-photo-prev]');
    var next = modalBody.querySelector('[data-trust-photo-next]');
    if (prev) prev.addEventListener('click', function () { setPhoto(photoIndex - 1); });
    if (next) next.addEventListener('click', function () { setPhoto(photoIndex + 1); });
    modalBody.querySelectorAll('[data-trust-photo]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setPhoto(parseInt(btn.getAttribute('data-trust-photo'), 10));
      });
    });
  }

  function openModal(id) {
    var client = window.TRUST_CLIENTS_BY_ID[id];
    if (!client) return;
    lastFocus = document.activeElement;
    renderModal(client);
    modal.hidden = false;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var closeBtn = modal.querySelector('.trust-modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      modal.hidden = true;
      modalBody.innerHTML = '';
      activeClient = null;
    }, 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var item = e.target.closest('[data-trust-id]');
    if (item) {
      if (window.trustMarqueeDidDrag) {
        window.trustMarqueeDidDrag = false;
        return;
      }
      e.preventDefault();
      openModal(item.getAttribute('data-trust-id'));
      return;
    }
    if (e.target.closest('[data-trust-close]')) {
      e.preventDefault();
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  window.renderTrustItems = function () {
    return window.TRUST_CLIENTS.map(function (c) {
      return (
        '<button type="button" class="trust__item" data-trust-id="' + escapeHtml(c.id) + '">' +
          '<span class="trust__item-name">' + escapeHtml(c.name) + '</span>' +
          '<span class="trust__item-city"><img class="inline-flag" src="assets/flags/kz.svg" alt="" width="16" height="12" decoding="async">' + escapeHtml(L(c.city)) + '</span>' +
          (c.rooms != null ? '<span class="trust__item-rooms">' + trustRoomLabel(c.rooms) + '</span>' : '') +
          '<span class="trust__item-hint">' + previewHint(c) + '</span>' +
        '</button>'
      );
    }).join('');
  };

  window.initTrustMarquee = function () {
    var el = document.getElementById('trustMarquee');
    if (!el) return;
    var items = window.renderTrustItems();
    el.innerHTML = '<div class="trust__track">' + items + items + '</div>';
  };

  window.initTrustMarquee();

  document.addEventListener('ps:lang', function () {
    window.initTrustMarquee();
    if (activeClient && modal.classList.contains('is-open')) {
      renderModal(activeClient);
    }
  });
})();
