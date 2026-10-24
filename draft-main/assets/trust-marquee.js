(function () {
  var SCROLL_DURATION = 55;
  var DRAG_THRESHOLD = 10;

  window.initTrustMarqueeControls = function () {
    var marquee = document.getElementById('trustMarquee');
    if (!marquee) return;

    var track = marquee.querySelector('.trust__track');
    if (!track) return;

    var paused = false;
    var dragging = false;
    var pointerDown = false;
    var startX = 0;
    var startScroll = 0;
    var dragDistance = 0;
    var lastTime = 0;
    var wheelTimer = null;
    var halfWidth = 0;
    var activePointerId = null;

    window.trustMarqueeDidDrag = false;

    function measure() {
      halfWidth = track.scrollWidth / 2;
    }

    function wrapScroll() {
      if (halfWidth <= 0) return;
      if (marquee.scrollLeft >= halfWidth) marquee.scrollLeft -= halfWidth;
      if (marquee.scrollLeft < 0) marquee.scrollLeft += halfWidth;
    }

    function loop(now) {
      if (!lastTime) lastTime = now;
      var dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!paused && !dragging && !pointerDown && halfWidth > 0) {
        marquee.scrollLeft += (halfWidth / SCROLL_DURATION) * dt;
        if (marquee.scrollLeft >= halfWidth - 1) {
          marquee.scrollLeft -= halfWidth;
        }
      }

      requestAnimationFrame(loop);
    }

    marquee.addEventListener('mouseenter', function () {
      paused = true;
    });

    marquee.addEventListener('mouseleave', function () {
      if (!dragging && !pointerDown) paused = false;
    });

    marquee.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointerDown = true;
      dragging = false;
      dragDistance = 0;
      activePointerId = e.pointerId;
      paused = true;
      startX = e.clientX;
      startScroll = marquee.scrollLeft;
    });

    marquee.addEventListener('pointermove', function (e) {
      if (!pointerDown || e.pointerId !== activePointerId) return;

      var dx = e.clientX - startX;
      dragDistance = Math.max(dragDistance, Math.abs(dx));

      if (!dragging && dragDistance > DRAG_THRESHOLD) {
        dragging = true;
        marquee.classList.add('is-dragging');
        if (marquee.setPointerCapture) {
          try { marquee.setPointerCapture(e.pointerId); } catch (_) {}
        }
      }

      if (dragging) {
        marquee.scrollLeft = startScroll - dx;
        wrapScroll();
        e.preventDefault();
      }
    });

    function endPointer(e) {
      if (!pointerDown || e.pointerId !== activePointerId) return;

      window.trustMarqueeDidDrag = dragDistance > DRAG_THRESHOLD;

      pointerDown = false;
      dragging = false;
      activePointerId = null;
      marquee.classList.remove('is-dragging');

      if (marquee.releasePointerCapture) {
        try { marquee.releasePointerCapture(e.pointerId); } catch (_) {}
      }

      if (!marquee.matches(':hover')) paused = false;
    }

    marquee.addEventListener('pointerup', endPointer);
    marquee.addEventListener('pointercancel', endPointer);

    marquee.addEventListener('click', function (e) {
      if (window.trustMarqueeDidDrag) {
        e.preventDefault();
        e.stopPropagation();
        window.trustMarqueeDidDrag = false;
      }
    }, true);

    marquee.addEventListener('wheel', function (e) {
      var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (!delta) return;
      marquee.scrollLeft += delta;
      wrapScroll();
      paused = true;
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function () {
        if (!marquee.matches(':hover') && !pointerDown) paused = false;
      }, 2500);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('resize', measure);
    measure();
    requestAnimationFrame(loop);
  };

  window.initTrustMarqueeControls();
})();
