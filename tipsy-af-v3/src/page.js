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
  var mixNote = root.querySelector('[data-tpm-mix-note]');
  var busy = false;

  // The Mix option needs a mixed-pack variant for every purchase option (set in
  // the theme editor). On the store, hide it until all three exist rather than
  // offer something that can't be added. The preview keeps it visible.
  var offerInputs = form.querySelectorAll('input[name="tpm-offer"]');
  var mixReady = Array.prototype.every.call(offerInputs, function (i) {
    return parseInt(i.getAttribute('data-variant-mix'), 10) > 0;
  });
  if (!mixReady && MODE !== 'preview') {
    Array.prototype.forEach.call(root.querySelectorAll('[data-tpm-mix-only]'), function (el) { el.remove(); });
  }

  function selected() {
    return form.querySelector('input[name="tpm-offer"]:checked');
  }

  function selectedFlavor() {
    var f = form.querySelector('input[name="tpm-flavor"]:checked');
    return f ? f.value : null;
  }

  function syncOffer() {
    var opt = selected();
    if (!opt) return;
    addBtn.textContent = opt.getAttribute('data-label');
    if (trialOnly) trialOnly.hidden = opt.value !== 'trial';
    var flavor = selectedFlavor();
    Array.prototype.forEach.call(root.querySelectorAll('[data-tpm-media]'), function (m) {
      m.hidden = m.getAttribute('data-tpm-media') !== flavor;
    });
    if (mixNote) {
      var isMix = selectedFlavor() === 'mix';
      mixNote.hidden = !isMix;
      mixNote.textContent = isMix ? 'Your pack: ' + opt.getAttribute('data-mix-split') + '.' : '';
    }
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
    var flavor = selectedFlavor();
    var item = { id: parseInt(opt.getAttribute('data-variant-' + flavor), 10), quantity: 1 };
    var plan = parseInt(opt.getAttribute('data-plan'), 10);
    if (!isNaN(plan) && plan > 0) item.selling_plan = plan;

    if (MODE === 'preview' && !item.id) {
      window.alert('Preview only. The mixed ' + opt.getAttribute('data-mix-split') +
        ' pack has no Shopify variant yet. Add its variant ID in the theme editor to enable it.');
      return Promise.resolve();
    }
    if (!item.id) return Promise.reject(new Error('This option isn\'t available right now. Please pick another flavor.'));

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
    if (!selectedFlavor()) { showError('Pick a flavor to continue.'); return; }
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
  function jumpToBuy(focusEl) {
    var target = document.getElementById('tpm-buy');
    if (!target) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    var el = focusEl || target.querySelector('h2');
    if (!focusEl) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
  Array.prototype.forEach.call(root.querySelectorAll('[data-tpm-jump]'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); jumpToBuy(); });
  });

  // Flavor cards preselect that flavor in the purchase form.
  Array.prototype.forEach.call(root.querySelectorAll('[data-tpm-pick]'), function (b) {
    b.addEventListener('click', function () {
      var input = form.querySelector('input[name="tpm-flavor"][value="' + b.getAttribute('data-tpm-pick') + '"]');
      if (!input) return;
      input.checked = true;
      syncOffer();
      jumpToBuy(input);
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

  // ---- Shared: preselect a flavor and pack in the buy box ----
  var FLAVOR_NAMES = { bo: 'Blood Orange Margarita', pm: 'Pineapple Martini', mix: 'The Mix' };
  function hasFlavor(f) { return !!form.querySelector('input[name="tpm-flavor"][value="' + f + '"]'); }
  function applyPick(flavor, offer) {
    if (!hasFlavor(flavor)) flavor = 'bo';
    var f = form.querySelector('input[name="tpm-flavor"][value="' + flavor + '"]');
    var o = form.querySelector('input[name="tpm-offer"][value="' + offer + '"]');
    if (f) f.checked = true;
    if (o) o.checked = true;
    syncOffer();
    jumpToBuy(addBtn);
  }
  Array.prototype.forEach.call(root.querySelectorAll('[data-tpm-apply]'), function (b) {
    var parts = b.getAttribute('data-tpm-apply').split(':');
    // Without the Mix products on the store, recommend the fan favorite instead.
    var pickText = b.parentNode.querySelector('.tpm-use__pick');
    if (parts[0] === 'mix' && !hasFlavor('mix') && pickText) pickText.innerHTML = pickText.innerHTML.replace('The Mix', FLAVOR_NAMES.bo);
    b.addEventListener('click', function () { applyPick(parts[0], parts[1]); });
  });

  // ---- Carousels: progress bar follows horizontal scroll ----
  Array.prototype.forEach.call(root.querySelectorAll('[data-tpm-carousel]'), function (track) {
    var bar = track.parentNode.querySelector('[data-tpm-progress]');
    if (!bar) return;
    function paint() {
      var max = track.scrollWidth - track.clientWidth;
      var shown = track.clientWidth / track.scrollWidth;
      bar.parentNode.hidden = max <= 1;
      bar.style.width = (shown * 100) + '%';
      bar.style.transform = 'translateX(' + (max > 0 ? (track.scrollLeft / max) * ((1 - shown) / shown) * 100 : 0) + '%)';
    }
    track.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  });

  // ---- "Help me choose" quiz ----
  var quiz = root.querySelector('[data-tpm-quiz]');
  if (quiz) {
    var answers = {};
    var stepLabel = quiz.querySelector('[data-tpm-quiz-step]');
    var OFFER_NAMES = { trial: '6-pack trial · $29.94', onetime: '12-pack · $60.00', autoship: '12-pack auto ship · $49.80/mo' };
    function show(n) {
      Array.prototype.forEach.call(quiz.querySelectorAll('[data-tpm-q]'), function (p) {
        p.hidden = p.getAttribute('data-tpm-q') !== String(n);
      });
      stepLabel.textContent = n < 3 ? 'Question ' + n + ' of 2' : 'Done';
      var first = quiz.querySelector('[data-tpm-q="' + n + '"] button');
      if (first) first.focus();
    }
    function openQuiz() {
      answers = {};
      if (typeof quiz.showModal === 'function') quiz.showModal(); else quiz.setAttribute('open', '');
      show(1);
    }
    Array.prototype.forEach.call(root.querySelectorAll('[data-tpm-quiz-open]'), function (b) {
      b.addEventListener('click', openQuiz);
    });
    Array.prototype.forEach.call(quiz.querySelectorAll('[data-tpm-answer]'), function (b) {
      b.addEventListener('click', function () {
        var kv = b.getAttribute('data-tpm-answer').split(':');
        answers[kv[0]] = kv[1];
        if (kv[0] === 'flavor') { show(2); return; }
        quiz.querySelector('[data-tpm-quiz-match]').textContent = FLAVOR_NAMES[answers.flavor] + ', ' + OFFER_NAMES[answers.offer];
        show(3);
      });
    });
    quiz.querySelector('[data-tpm-quiz-restart]').addEventListener('click', function () { answers = {}; show(1); });
    quiz.querySelector('[data-tpm-quiz-apply]').addEventListener('click', function () {
      if (typeof quiz.close === 'function') quiz.close(); else quiz.removeAttribute('open');
      applyPick(answers.flavor || 'bo', answers.offer || 'trial');
    });
    // Close when the backdrop is clicked.
    quiz.addEventListener('click', function (e) { if (e.target === quiz) quiz.close(); });
  }

  syncOffer();
})();
