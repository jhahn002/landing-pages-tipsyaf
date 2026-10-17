(function () {
  var root = document.getElementById('tpa');
  if (!root) return;

  // 'store' adds to the Shopify cart and goes to checkout; 'preview' (local
  // file) only reports what would be added.
  var MODE = root.getAttribute('data-tpm-mode') || 'store';
  var buyBtn = root.querySelector('[data-tpa-buy]');
  var errorEl = root.querySelector('[data-tpa-error]');
  var offer = document.getElementById('tpa-offer');
  var busy = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // In-page jumps to the offer
  Array.prototype.forEach.call(root.querySelectorAll('[data-tpa-jump]'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      offer.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      var first = offer.querySelector('input:checked');
      if (first) first.focus({ preventScroll: true });
    });
  });

  // Trial checkout: chosen flavor's 6-pack starter kit on the trial plan
  buyBtn.addEventListener('click', function () {
    if (busy) return;
    var flavor = root.querySelector('input[name="tpa-flavor"]:checked');
    var item = { id: parseInt(flavor.value, 10), quantity: 1, selling_plan: parseInt(buyBtn.getAttribute('data-tpa-plan'), 10) };
    if (MODE === 'preview') {
      window.alert('Preview only. On the store this adds variant ' + item.id + ' (plan ' + item.selling_plan + ') to the cart and goes to checkout.');
      return;
    }
    busy = true;
    buyBtn.disabled = true;
    var label = buyBtn.textContent;
    buyBtn.textContent = 'Heading to checkout…';
    errorEl.textContent = '';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: [item] })
    })
      .then(function (r) {
        return r.json().then(function (d) {
          if (!r.ok) throw new Error(d.description || d.message || 'Something went wrong. Please try again.');
        });
      })
      .then(function () { window.location.href = '/checkout'; })
      .catch(function (err) {
        errorEl.textContent = err.message;
        busy = false;
        buyBtn.disabled = false;
        buyBtn.textContent = label;
      });
  });

  // Draw the experience chart when it scrolls into view
  var chart = root.querySelector('[data-tpa-animate]');
  if (chart && 'IntersectionObserver' in window) {
    chart.classList.add('will-animate');
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { chart.classList.remove('will-animate'); chart.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(chart);
  }

  // Evening timeline: steps light up as they scroll in
  var night = root.querySelector('[data-tpe-night]');
  if (night && 'IntersectionObserver' in window && !reduce) {
    var steps = night.querySelectorAll('li');
    Array.prototype.forEach.call(steps, function (li) { li.classList.add('is-waiting'); });
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('is-waiting'); en.target.classList.add('is-in'); nio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(steps, function (li) { nio.observe(li); });
  }

  // Sticky CTA: after the first screen, hidden once the offer is on screen
  var sticky = root.querySelector('[data-tpa-sticky]');
  if (sticky) {
    sticky.hidden = false;
    var queued = false;
    var update = function () {
      queued = false;
      var show = window.scrollY > window.innerHeight * 0.8 && offer.getBoundingClientRect().top > window.innerHeight;
      sticky.classList.toggle('is-visible', show);
      sticky.inert = !show;
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    };
    window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
})();
