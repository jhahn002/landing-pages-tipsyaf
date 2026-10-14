(function () {
  var root = document.getElementById('tpm');
  if (!root) return;

  // 'store' posts to Shopify's /cart/add.js; 'preview' (local file) only
  // reports what would be added, because there is no cart to post to.
  var MODE = root.getAttribute('data-tpm-mode') || 'store';

  var form = root.querySelector('[data-tpm-form]');
  var addBtn = root.querySelector('[data-tpm-add]');
  var errorEl = root.querySelector('[data-tpm-error]');
  var trialOnly = root.querySelector('[data-tpm-trial-only]');
  var sticky = root.querySelector('[data-tpm-sticky]');
  var busy = false;

  function selected() {
    return form.querySelector('input[name="tpm-offer"]:checked');
  }

  function syncOffer() {
    var opt = selected();
    if (!opt) return;
    addBtn.textContent = opt.getAttribute('data-label');
    if (trialOnly) trialOnly.hidden = opt.value !== 'trial';
    showError('');
  }

  function showError(msg) {
    errorEl.textContent = msg || '';
  }

  // Same behaviour as the theme's existing offer selector: open the Dawn cart
  // drawer when it exists, otherwise go to the cart page so the click is never
  // silent.
  function cartDrawer() {
    var el = document.querySelector('cart-drawer');
    return el && typeof el.renderContents === 'function' ? el : null;
  }

  function afterAdd(data) {
    var drawer = cartDrawer();
    if (drawer && data && data.sections) {
      drawer.classList.remove('is-empty');
      drawer.renderContents(data);
      return;
    }
    window.location.href = '/cart';
  }

  function addToCart(opt) {
    var item = { id: parseInt(opt.getAttribute('data-variant'), 10), quantity: 1 };
    var plan = parseInt(opt.getAttribute('data-plan'), 10);
    if (!isNaN(plan) && plan > 0) item.selling_plan = plan;

    if (MODE === 'preview') {
      showError('');
      window.alert('Preview only. On the store this adds: variant ' + item.id +
        (item.selling_plan ? ', selling plan ' + item.selling_plan : ', one-time purchase') + ', quantity 1.');
      return Promise.resolve();
    }

    var body = { items: [item] };
    var drawer = cartDrawer();
    if (drawer) {
      body.sections = drawer.getSectionsToRender().map(function (s) { return s.id; });
      body.sections_url = window.location.pathname;
    }

    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (r) {
        return r.json().then(function (data) {
          if (!r.ok) throw new Error(data.description || data.message || 'Something went wrong. Please try again.');
          return data;
        });
      })
      .then(afterAdd);
  }

  form.addEventListener('change', syncOffer);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    var opt = selected();
    if (!opt) { showError('Choose an option to continue.'); return; }
    busy = true;
    addBtn.disabled = true;
    var label = addBtn.textContent;
    addBtn.textContent = 'Adding…';
    showError('');
    addToCart(opt)
      .catch(function (err) { showError(err.message); })
      .then(function () {
        busy = false;
        addBtn.disabled = false;
        addBtn.textContent = label;
      });
  });

  // In-page jumps: move focus to the purchase heading for keyboard users.
  Array.prototype.forEach.call(root.querySelectorAll('[data-tpm-jump]'), function (a) {
    a.addEventListener('click', function (e) {
      var target = document.getElementById('tpm-buy');
      if (!target) return;
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      var heading = target.querySelector('h2');
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    });
  });

  // Sticky CTA: shown once the hero button has scrolled away, hidden while the
  // purchase section or anything after it is on screen so it never covers the
  // options, terms or FAQ.
  if (sticky) {
    var heroBtn = root.querySelector('.tpm-hero [data-tpm-jump]');
    var buy = document.getElementById('tpm-buy');
    var queued = false;
    sticky.hidden = false;
    root.classList.add('has-sticky');
    // Read positions on scroll (once per frame) rather than with an
    // IntersectionObserver, which misses jumps straight past a section.
    function update() {
      queued = false;
      var heroGone = heroBtn.getBoundingClientRect().bottom < 0;
      var buyReached = buy.getBoundingClientRect().top < window.innerHeight;
      var show = heroGone && !buyReached;
      sticky.classList.toggle('is-visible', show);
      sticky.inert = !show;
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
    function queue() { if (!queued) { queued = true; window.requestAnimationFrame(update); } }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  }

  syncOffer();
})();
