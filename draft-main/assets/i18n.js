/**
 * Full-page RU ↔ KZ for the main landing.
 * Depends on assets/i18n-dict.js (window.__PS_I18N_DICT).
 */
(function () {
  'use strict';

  var KEYS = {
    'nav.services': 'Қызметтер',
    'nav.process': 'Қалай жұмыс істейміз',
    'nav.cases': 'Кейстер',
    'nav.platforms': 'Платформалар',
    'nav.crm': 'CRM',
    'nav.blog': 'Блог',
    'nav.study': 'Студенттерге',
    'nav.faq': 'FAQ',
    'nav.about': 'Компания туралы',
    'hero.badge': 'B2B · OTA оқыту және баптау',
    'hero.title1': 'Оқыту ',
    'hero.title2': 'Қазақстан қонақ үйлеріне',
    'hero.sub': 'Project Sauyt қонақ үйлер, апартаменттер мен демалыс базаларына онлайн сатылымды өсіруге көмектеседі. Біз персоналды оқытамыз, OTA баптаймыз және нәтижеге дейін қараймыз.',
    'hero.cta1': 'Карточканы 24 сағатта тегін талдау',
    'hero.cta2': 'Карточканы өзім тексеру',
    'online.on': 'Қазір байланыста · жауап әдетте 30 мин ішінде',
    'online.off': 'Қазір желіде емес · жұмыс уақытында жауап береміз',
    'sec.compare': 'Әдеттегі объект vs бапталған',
    'sec.traps': 'Көрінімді төмендететін қателер',
    'sec.timeline': 'Төлемнен кейін не болады',
    'sec.objections': 'Жиі қарсылықтар',
    'sec.reviews': 'WhatsApp хат алмасулары',
    'sec.reviews.desc': 'Клиенттердің нақты хат алмасулары — жариялауға дайындап жатырмыз. Жақында аттары бұлыңғыр скриндерді көрсетеміз.',
    'sec.reviews.soon': 'Жақында жариялаймыз',
    'sec.reviews.soonBody': 'Клиенттердің келісімін жинап, аттарды бұлыңғырлаймыз. Бөлім WhatsApp скриндерімен қайтады — «сусыз» және бөтен сандарсыз.',
    'sec.reviews.badge': 'Жұмыс үстінде',
    'cta.title': 'Бүгіннен брондарды өсіруді бастаңыз',
    'cta.sub': 'WhatsApp-қа жазыңыз — объектіңізді талқылаймыз.',
    'cta.wa': 'WhatsApp-қа жазу'
  };

  var MAP = window.__PS_I18N_DICT || {};
  var PAIR_LIST = Object.keys(MAP).sort(function (a, b) { return b.length - a.length; });

  var originals = new WeakMap();
  var attrOriginals = new WeakMap();
  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt', 'data-wa-msg', 'data-online-on', 'data-online-off'];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, TEXTAREA: 1, SVG: 1, PATH: 1, PRE: 1 };

  var currentLang = 'ru';

  function normalize(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function translatePiece(ru) {
    var t = normalize(ru);
    if (!t) return null;
    if (MAP[t]) return MAP[t];
    // soft hyphen / dash variants
    var soft = t.replace(/\u2011/g, '-').replace(/\u2013/g, '–');
    if (soft !== t && MAP[soft]) return MAP[soft];
    return null;
  }

  /** Translate a Russian string (exact or longest-phrase replace). */
  function t(ru) {
    if (currentLang !== 'kz') return ru;
    if (ru == null) return ru;
    var s = String(ru);
    var exact = translatePiece(s);
    if (exact != null) return exact;
    var out = s;
    for (var i = 0; i < PAIR_LIST.length; i++) {
      var k = PAIR_LIST[i];
      if (k.length < 3) continue;
      if (out.indexOf(k) !== -1) out = out.split(k).join(MAP[k]);
    }
    return out;
  }

  function translateNodeValue(orig) {
    if (currentLang === 'ru') return orig;
    var lead = orig.match(/^\s*/)[0];
    var trail = orig.match(/\s*$/)[0];
    var core = orig.slice(lead.length, orig.length - trail.length);
    if (!core) return orig;
    var exact = translatePiece(core);
    if (exact != null) return lead + exact + trail;
    return lead + t(core) + trail;
  }

  function walkText(node) {
    if (node.nodeType === 3) {
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      node.nodeValue = translateNodeValue(originals.get(node));
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.tagName;
    if (SKIP[tag]) return;
    if (node.hasAttribute && node.hasAttribute('data-i18n')) return;
    if (node.hasAttribute && node.hasAttribute('data-i18n-skip')) return;
    if (node.closest && node.closest('[data-i18n-skip]')) return;

    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A') {
      if (!attrOriginals.has(node)) {
        var bag = {};
        ATTRS.forEach(function (a) {
          if (node.hasAttribute(a)) bag[a] = node.getAttribute(a);
        });
        attrOriginals.set(node, bag);
      }
      var stored = attrOriginals.get(node);
      ATTRS.forEach(function (a) {
        if (!(a in stored)) return;
        node.setAttribute(a, currentLang === 'ru' ? stored[a] : t(stored[a]));
      });
    }

    // OPTION labels
    if (tag === 'OPTION') {
      if (!originals.has(node)) originals.set(node, node.textContent);
      var o = originals.get(node);
      node.textContent = currentLang === 'ru' ? o : (translatePiece(o) || t(o));
      return;
    }

    for (var c = node.firstChild; c; c = c.nextSibling) walkText(c);
  }

  function applyKeys() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (currentLang === 'ru') {
        if (el.hasAttribute('data-i18n-ru')) el.textContent = el.getAttribute('data-i18n-ru');
        return;
      }
      if (!el.hasAttribute('data-i18n-ru')) el.setAttribute('data-i18n-ru', el.textContent);
      if (KEYS[key]) el.textContent = KEYS[key];
    });
  }

  function applyOnline() {
    document.querySelectorAll('[data-online-chip]').forEach(function (el) {
      if (currentLang === 'kz') {
        el.setAttribute('data-online-on', KEYS['online.on']);
        el.setAttribute('data-online-off', KEYS['online.off']);
      } else {
        el.setAttribute('data-online-on', 'Сейчас на связи · ответ обычно до 30 мин');
        el.setAttribute('data-online-off', 'Сейчас вне линии · ответим в рабочее время');
      }
    });
    if (typeof window.__psRefreshOnline === 'function') window.__psRefreshOnline();
  }

  function refreshWaHrefs() {
    if (typeof window.refreshWaLinks === 'function') window.refreshWaLinks();
  }

  function applyLang(lang) {
    currentLang = lang === 'kz' ? 'kz' : 'ru';
    window.__psLang = currentLang;
    window.__psLangApplying = true;
    document.documentElement.lang = currentLang === 'kz' ? 'kk' : 'ru';
    document.documentElement.setAttribute('data-lang', currentLang);

    document.dispatchEvent(new CustomEvent('ps:lang', { detail: { lang: currentLang } }));

    applyKeys();
    walkText(document.body);
    applyOnline();
    refreshWaHrefs();

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === currentLang);
    });
    try { localStorage.setItem('ps_lang', currentLang); } catch (e) {}
    window.__psLangApplying = false;
  }

  function initLang() {
    var saved = 'ru';
    try { saved = localStorage.getItem('ps_lang') || 'ru'; } catch (e) {}
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () {
        applyLang(b.getAttribute('data-lang'));
      });
    });
    window.__psLang = saved === 'kz' ? 'kz' : 'ru';
    if (saved === 'kz') applyLang('kz');
  }

  window.__psT = t;
  window.__psApplyLang = applyLang;
  window.__psGetLang = function () { return currentLang; };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }
})();
