(function () {
  document.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
    var toggle = dropdown.querySelector('.nav-dropdown__toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dropdown.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

      document.querySelectorAll('.nav-dropdown').forEach(function (other) {
        if (other === dropdown) return;
        other.classList.remove('is-open');
        var otherToggle = other.querySelector('.nav-dropdown__toggle');
        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-dropdown.is-open').forEach(function (dropdown) {
      dropdown.classList.remove('is-open');
      var toggle = dropdown.querySelector('.nav-dropdown__toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('.mobile-menu__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('.mobile-menu__group');
      if (group) group.classList.toggle('is-open');
    });
  });
})();
