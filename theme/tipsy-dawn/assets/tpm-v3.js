/* TIPSY v3 sections. Ported from tipsy-af-v3/src/page.js. Loaded by sections/tpm-buy.liquid. */
(function () {
  // The page is split into several theme sections (sections/tpm-*.liquid). The
  // buy section holds the product data; every other section's buttons need it.
  var dataEl = document.querySelector('[data-tpm-data]');
  if (!dataEl || window.__tpmInit) return;
  window.__tpmInit = true;
  var root = document;

  // 'store' adds to the Shopify cart and goes to checkout; 'preview' (local
  // file) only reports what would be added, because there is no cart.
  var MODE = dataEl.getAttribute('data-tpm-mode') || 'store';
  var DATA = JSON.parse(dataEl.textContent);

  function money(n) { return '$' + n.toFixed(2); }
  function id(v) { var n = parseInt(v, 10); return n > 0 ? n : 0; }
  function $all(sel, el) { return Array.prototype.slice.call((el || root).querySelectorAll(sel)); }

  // ---- The Mix only exists once all three mixed variants are set ----
  var mixReady = Object.keys(DATA.offers).every(function (k) { return id(DATA.offers[k].variants.mix); });
  if (!mixReady && MODE !== 'preview') {
    delete DATA.flavors.mix;
    $all('[data-tpm-mix-only]').forEach(function (el) { el.remove(); });
  }
  function hasFlavor(f) { return !!DATA.flavors[f]; }

  // ---- Optional rewards ("60:Free shipping|100:Free gift") ----
  var REWARDS = String(DATA.rewards || '').split('|').map(function (part) {
    var kv = part.split(':');
    return { at: parseFloat(kv[0]), label: (kv.slice(1).join(':') || '').trim() };
  }).filter(function (r) { return r.at > 0 && r.label; }).sort(function (a, b) { return a.at - b.at; });

  // ---- Shared state ----
  var state = { flavor: 'bo', offer: 'trial', addons: {} };

  function dueToday() {
    var t = DATA.offers[state.offer].price;
    DATA.addons.forEach(function (a) { if (state.addons[a.id]) t += a.price; });
    return Math.round(t * 100) / 100;
  }

  function canStack(flavor) {
    if (flavor === 'mix') {
      return '<span class="tpm-can-pair"><img src="' + DATA.flavors.bo.img + '" alt=""><img src="' + DATA.flavors.pm.img + '" alt=""></span>';
    }
    return '<img src="' + DATA.flavors[flavor].img + '" alt="">';
  }

  // ---- Picker: flavor circles + size & plan cards (used inline and in the sheet) ----
  // Offer layout: 'cards' (three equal cards), or a highlighted 6-pack trial
  // with the 12-packs toned down: 'ticket', 'spotlight' or 'stamp'.
  var STYLES = ['spotlight', 'ticket', 'stamp', 'cards'];
  var offerStyle = String(DATA.offerStyle || '').trim();
  if (MODE === 'preview') {
    var q = (window.location.search.match(/[?&]offer=(\w+)/) || [])[1];
    if (q) offerStyle = q;
  }
  if (STYLES.indexOf(offerStyle) < 0) offerStyle = 'spotlight';

  function planOpt(n, k, cls, inner) {
    return '<label class="' + cls + '"><input type="radio" name="tpm-offer-' + n + '" value="' + k + '">' + inner + '</label>';
  }

  function plansHtml(n) {
    var keys = Object.keys(DATA.offers);
    if (offerStyle === 'cards') {
      return '<fieldset class="tpm-plan"><legend class="tpm-pick__label">Size &amp; plan</legend><div class="tpm-plan__row">' +
        keys.map(function (k) {
          var o = DATA.offers[k];
          return planOpt(n, k, 'tpm-plan__opt', '<span class="tpm-plan__card">' + (o.badge ? '<span class="tpm-plan__badge">' + o.badge + '</span>' : '') +
            '<span class="tpm-plan__name">' + o.name + '</span><span class="tpm-plan__price">' + money(o.price) + '</span>' +
            '<span class="tpm-plan__sub">' + o.sub + '</span></span>');
        }).join('') + '</div></fieldset>';
    }
    var t = DATA.offers.trial;
    var feature;
    if (offerStyle === 'ticket') {
      feature = planOpt(n, 'trial', 'tpm-deal tpm-deal--ticket',
        '<span class="tpm-ticket">' +
          '<span class="tpm-ticket__stub"><span class="tpm-ticket__big">6</span><span class="tpm-ticket__unit">cans</span></span>' +
          '<span class="tpm-ticket__main">' +
            '<span class="tpm-ticket__kicker">Trial offer</span>' +
            '<span class="tpm-ticket__price">' + money(t.price) + '</span>' +
            '<span class="tpm-ticket__sub">Then 12 cans for $49.80/mo. Cancel anytime.</span>' +
            '<span class="tpm-deal__state"><span class="tpm-deal__on">Offer applied</span><span class="tpm-deal__off">Tap to redeem</span></span>' +
          '</span>' +
        '</span>');
    } else if (offerStyle === 'spotlight') {
      feature = planOpt(n, 'trial', 'tpm-deal tpm-deal--spot',
        '<span class="tpm-spot">' +
          '<span class="tpm-spot__tag">Best way to start</span>' +
          '<span class="tpm-spot__cans" aria-hidden="true"><img src="' + DATA.flavors.bo.img + '" alt=""><img src="' + DATA.flavors.pm.img + '" alt=""></span>' +
          '<span class="tpm-spot__text">' +
            '<span class="tpm-spot__name">Try 6 cans</span>' +
            '<span class="tpm-spot__price">' + money(t.price) + '</span>' +
            '<span class="tpm-spot__sub">Then 12 cans for $49.80/mo. Cancel anytime.</span>' +
          '</span>' +
          '<span class="tpm-spot__check" aria-hidden="true"></span>' +
        '</span>');
    } else {
      feature = planOpt(n, 'trial', 'tpm-deal tpm-deal--stamp',
        '<span class="tpm-stamp">' +
          '<span class="tpm-stamp__cans" aria-hidden="true"><img src="' + DATA.flavors.bo.img + '" alt=""><img src="' + DATA.flavors.pm.img + '" alt=""></span>' +
          '<span class="tpm-stamp__text">' +
            '<span class="tpm-stamp__name">6-can trial</span>' +
            '<span class="tpm-stamp__price">' + money(t.price) + '</span>' +
            '<span class="tpm-stamp__sub">Then 12 cans for $49.80/mo. Cancel anytime.</span>' +
          '</span>' +
          '<span class="tpm-stamp__mark" aria-hidden="true"><span class="tpm-deal__on">Claimed</span><span class="tpm-deal__off">Claim</span></span>' +
        '</span>');
    }
    var others = keys.filter(function (k) { return k !== 'trial'; }).map(function (k) {
      var o = DATA.offers[k];
      return planOpt(n, k, 'tpm-alt', '<span class="tpm-alt__row"><span class="tpm-alt__name">' + o.name + '</span>' +
        '<span class="tpm-alt__sub">' + o.sub + '</span><span class="tpm-alt__price">' + money(o.price) + '</span></span>');
    }).join('');
    return '<fieldset class="tpm-plan tpm-plan--deal tpm-plan--' + offerStyle + '"><legend class="tpm-pick__label">Your offer</legend>' + feature +
      '<p class="tpm-alt__label">Or skip the trial</p><div class="tpm-alt__list">' + others + '</div></fieldset>';
  }

  var pickerCount = 0;
  // Flavor selector design: 'shelf' (chosen), or 'tiles', 'pop', 'chips'.
  var FLAVOR_STYLES = ['tiles', 'shelf', 'pop', 'chips'];
  var flavorStyle = String(DATA.flavorStyle || '').trim();
  if (MODE === 'preview') {
    var fq = (window.location.search.match(/[?&]flavor=(\w+)/) || [])[1];
    if (fq) flavorStyle = fq;
  }
  if (FLAVOR_STYLES.indexOf(flavorStyle) < 0) flavorStyle = 'shelf';

  var CHECK = '<span class="tpm-fcheck" aria-hidden="true"></span>';
  function flavorRadio(n, f, cls, inner) {
    return '<label class="' + cls + ' tpm-f--' + f + '"><input type="radio" name="tpm-flavor-' + n + '" value="' + f + '">' + inner + '</label>';
  }
  function flavorsHtml(n) {
    var keys = Object.keys(DATA.flavors);
    var legend = '<legend class="tpm-pick__label">Choose your flavor</legend>';
    var wrap = function (mod, inner) { return '<fieldset class="tpm-flav tpm-flav--' + mod + '">' + legend + inner + '</fieldset>'; };

    if (flavorStyle === 'shelf') {
      // Cans on a swipeable shelf; the can in the center is the chosen one.
      return wrap('shelf', '<div class="tpm-shelf"><div class="tpm-shelf__track" data-tpm-shelf-track>' + keys.map(function (f) {
        var d = DATA.flavors[f];
        return flavorRadio(n, f, 'tpm-shelf__opt', '<span class="tpm-shelf__box"><span class="tpm-shelf__img">' + canStack(f) + '</span>' +
          '<span class="tpm-shelf__name">' + d.name + '</span></span>');
      }).join('') + '</div></div><div class="tpm-shelf__dots" aria-hidden="true">' + keys.map(function (f) {
        return '<i data-tpm-dot="' + f + '"></i>';
      }).join('') + '</div><p class="tpm-shelf__note" data-tpm-fnote></p>');
    }
    if (flavorStyle === 'pop') {
      // Full-color cards with the can breaking out of the top edge.
      return wrap('pop', '<div class="tpm-pop">' + keys.map(function (f) {
        var d = DATA.flavors[f];
        return flavorRadio(n, f, 'tpm-pop__opt', '<span class="tpm-pop__box"><span class="tpm-pop__img">' + canStack(f) + '</span>' + CHECK +
          '<span class="tpm-pop__name">' + d.name + '</span><span class="tpm-pop__note">' + d.note + '</span></span>');
      }).join('') + '</div>');
    }
    if (flavorStyle === 'chips') {
      // Compact chips; the chosen one expands with its taste note.
      return wrap('chips', '<div class="tpm-chips">' + keys.map(function (f) {
        var d = DATA.flavors[f];
        return flavorRadio(n, f, 'tpm-chip2', '<span class="tpm-chip2__box"><span class="tpm-chip2__img">' + canStack(f) + '</span>' +
          '<span class="tpm-chip2__text"><strong>' + d.name + '</strong><span>' + d.note + '</span></span>' + CHECK + '</span>');
      }).join('') + '</div>');
    }
    return wrap('tiles', '<div class="tpm-ftiles">' + keys.map(function (f) {
      var d = DATA.flavors[f];
      return flavorRadio(n, f, 'tpm-ftile', '<span class="tpm-ftile__box">' + CHECK + '<span class="tpm-ftile__img">' + canStack(f) + '</span>' +
        '<span class="tpm-ftile__name">' + d.name + '</span><span class="tpm-ftile__note">' + d.note + '</span></span>');
    }).join('') + '</div>');
  }

  function pickerHtml(n) {
    return flavorsHtml(n) + plansHtml(n) + '<p class="tpm-pick__terms" data-tpm-terms></p>';
  }


  function renderPicker(el) {
    var n = ++pickerCount;
    el.setAttribute('data-tpm-picker-n', n);
    el.innerHTML = pickerHtml(n);
    el.addEventListener('change', function (e) {
      if (e.target.name.indexOf('tpm-flavor-') === 0) {
        state.flavor = e.target.value;
        var opt = e.target.closest('.tpm-shelf__opt');
        popFlavor(opt);
        var track = opt && opt.closest('[data-tpm-shelf-track]');
        if (track && centered(track) !== opt) centerOpt(track, opt, true);
      }
      if (e.target.name.indexOf('tpm-offer-') === 0) state.offer = e.target.value;
      sync();
    });
  }
  $all('[data-tpm-picker]').forEach(renderPicker);

  // ---- Swipeable shelf: the can that settles in the center gets selected ----
  function centered(track) {
    var mid = track.scrollLeft + track.clientWidth / 2;
    var best = null, bestD = Infinity;
    $all('.tpm-shelf__opt', track).forEach(function (o) {
      var d = Math.abs(o.offsetLeft + o.offsetWidth / 2 - mid);
      if (d < bestD) { bestD = d; best = o; }
    });
    return best;
  }
  function centerOpt(track, opt, smooth) {
    if (!track.clientWidth) return;
    track._prog = true;
    clearTimeout(track._pt);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: opt.offsetLeft + opt.offsetWidth / 2 - track.clientWidth / 2, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    track._pt = setTimeout(function () { track._prog = false; }, smooth ? 600 : 80);
  }
  $all('[data-tpm-shelf-track]').forEach(function (track) {
    track.addEventListener('scroll', function () {
      if (track._prog) return;
      clearTimeout(track._st);
      track._st = setTimeout(function () {
        var o = centered(track);
        var input = o && o.querySelector('input');
        if (input && !input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 90);
    }, { passive: true });
  });
  window.addEventListener('resize', function () {
    $all('[data-tpm-shelf-track]').forEach(function (t) {
      var sel = t.querySelector('input:checked');
      if (sel) centerOpt(t, sel.closest('.tpm-shelf__opt'), false);
    });
  });

  // ---- Shelf animations: cans rise in on entry, chosen can pops on change ----
  function restartClass(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth; // restart the CSS animation
    el.classList.add(cls);
  }
  function popFlavor(opt) {
    restartClass(opt, 'is-pop');
    var shelf = opt && opt.closest('.tpm-shelf');
    if (shelf) restartClass(shelf.parentNode.querySelector('[data-tpm-fnote]'), 'is-swap');
  }
  function enterShelf(scope) {
    $all('.tpm-shelf', scope).forEach(function (sh) { restartClass(sh, 'is-enter'); });
  }
  if ('IntersectionObserver' in window) {
    var shelfIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('is-waiting'); restartClass(en.target, 'is-enter'); shelfIo.unobserve(en.target); } });
    }, { threshold: 0.4 });
    $all('.tpm-buy .tpm-shelf').forEach(function (sh) { sh.classList.add('is-waiting'); shelfIo.observe(sh); });
  }


  // ---- Checkout sheet ----
  var sheet = root.querySelector('[data-tpm-checkout]');
  var step = 1;
  var errorEl = sheet.querySelector('[data-tpm-error]');
  var nextBtn = sheet.querySelector('[data-tpm-next]');
  var busy = false;

  function renderAddons() {
    var box = sheet.querySelector('[data-tpm-addons]');
    box.innerHTML = DATA.addons.map(function (a) {
      var on = !!state.addons[a.id];
      return '<div class="tpm-addon' + (on ? ' is-on' : '') + '"><img src="' + a.img + '" alt="">' +
        '<div class="tpm-addon__text"><strong>' + a.name + '</strong><span>' + a.note + '</span><b>' + money(a.price) + '</b></div>' +
        '<button type="button" class="tpm-addon__btn" data-tpm-addon="' + a.id + '" aria-pressed="' + on + '">' + (on ? 'Added' : 'Add') + '</button></div>';
    }).join('');
  }

  function renderRewards() {
    var wrap = sheet.querySelector('[data-tpm-rewards]');
    if (!REWARDS.length) { wrap.hidden = true; return; }
    wrap.hidden = false;
    var total = dueToday();
    var top = REWARDS[REWARDS.length - 1].at;
    var next = REWARDS.filter(function (r) { return total < r.at; })[0];
    sheet.querySelector('[data-tpm-rewards-fill]').style.width = Math.min(100, (total / top) * 100) + '%';
    sheet.querySelector('[data-tpm-rewards-msg]').innerHTML = next
      ? 'Add <strong>' + money(next.at - total) + '</strong> to unlock ' + next.label.toLowerCase()
      : '<strong>Every reward unlocked</strong>';
    if (MODE === 'preview') sheet.querySelector('[data-tpm-rewards-msg]').innerHTML += ' <em class="tpm-example">Example rewards</em>';
    sheet.querySelector('[data-tpm-rewards-marks]').innerHTML = REWARDS.map(function (r) {
      return '<li class="' + (total >= r.at ? 'is-on' : '') + '" style="left:' + (r.at / top) * 100 + '%"><span>' + r.label + '</span></li>';
    }).join('');
  }

  function renderReview() {
    var o = DATA.offers[state.offer];
    var f = DATA.flavors[state.flavor];
    var lines = '<li><span class="tpm-review__img">' + canStack(state.flavor) + '</span><div><strong>' + f.name + '</strong><span>' + o.name +
      (state.flavor === 'mix' ? ' · ' + o.split : '') + '</span></div><b>' + money(o.price) + '</b></li>';
    DATA.addons.forEach(function (a) {
      if (state.addons[a.id]) lines += '<li><span class="tpm-review__img"><img src="' + a.img + '" alt=""></span><div><strong>' + a.name + '</strong><span>' + a.note + '</span></div><b>' + money(a.price) + '</b></li>';
    });
    sheet.querySelector('[data-tpm-review]').innerHTML = lines;
    sheet.querySelector('[data-tpm-timeline]').hidden = state.offer !== 'trial';
  }

  function showStep(n, opened) {
    step = n;
    $all('[data-tpm-step]', sheet).forEach(function (s) { s.hidden = s.getAttribute('data-tpm-step') !== String(n); });
    $all('[data-tpm-stepdot]', sheet).forEach(function (d) {
      var k = parseInt(d.getAttribute('data-tpm-stepdot'), 10);
      d.classList.toggle('is-done', k < n);
      d.classList.toggle('is-on', k === n);
      if (k === n) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
    });
    sheet.querySelector('[data-tpm-back]').style.visibility = n > 1 ? 'visible' : 'hidden';
    if (n === 1 && opened) enterShelf(sheet);
    if (n === 2) { renderAddons(); renderRewards(); }
    if (n === 3) renderReview();
    errorEl.textContent = '';
    sync();
    var body = sheet.querySelector('.tpm-sheet__body');
    body.scrollTop = 0;
    var title = sheet.querySelector('[data-tpm-step="' + n + '"] .tpm-sheet__title');
    if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
  }

  function openCheckout(opts) {
    opts = opts || {};
    if (opts.flavor) state.flavor = hasFlavor(opts.flavor) ? opts.flavor : 'bo';
    if (opts.offer) state.offer = opts.offer;
    if (typeof sheet.showModal === 'function') { if (!sheet.open) sheet.showModal(); } else sheet.setAttribute('open', '');
    document.documentElement.classList.add('tpm-lock');
    showStep(opts.step || 1, true);
  }
  function closeCheckout() {
    if (typeof sheet.close === 'function') sheet.close(); else sheet.removeAttribute('open');
  }
  sheet.addEventListener('close', function () { document.documentElement.classList.remove('tpm-lock'); });
  sheet.addEventListener('click', function (e) {
    if (e.target === sheet) closeCheckout();
    var add = e.target.closest('[data-tpm-addon]');
    if (add) {
      var k = add.getAttribute('data-tpm-addon');
      state.addons[k] = !state.addons[k];
      renderAddons(); renderRewards(); sync();
    }
  });
  sheet.querySelector('[data-tpm-close]').addEventListener('click', closeCheckout);
  sheet.querySelector('[data-tpm-back]').addEventListener('click', function () { if (step > 1) showStep(step - 1); });
  nextBtn.addEventListener('click', function () {
    if (step < 3) showStep(step + 1); else checkout();
  });

  function cartItems() {
    var o = DATA.offers[state.offer];
    var main = { id: id(o.variants[state.flavor]), quantity: 1 };
    if (o.plan) main.selling_plan = o.plan;
    var items = [main];
    DATA.addons.forEach(function (a) { if (state.addons[a.id]) items.push({ id: id(a.variant), quantity: 1 }); });
    return items;
  }

  function checkout() {
    if (busy) return;
    var items = cartItems();
    if (!items[0].id) {
      if (MODE === 'preview') {
        window.alert('Preview only. The mixed pack has no Shopify variant yet. Add its variant ID in the theme editor to enable it.');
        return;
      }
      errorEl.textContent = 'This option isn\'t available right now. Please pick another flavor.';
      return;
    }
    if (MODE === 'preview') {
      window.alert('Preview only. On the store this adds ' + items.map(function (i) {
        return 'variant ' + i.id + (i.selling_plan ? ' (plan ' + i.selling_plan + ')' : '');
      }).join(' + ') + ' to the cart and goes to checkout.');
      return;
    }
    busy = true;
    nextBtn.disabled = true;
    sheet.querySelector('[data-tpm-next-label]').textContent = 'Heading to checkout…';
    errorEl.textContent = '';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ items: items })
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
        nextBtn.disabled = false;
        sync();
      });
  }

  // ---- Keep every picker, label and total in step ----
  function sync() {
    if (!hasFlavor(state.flavor)) state.flavor = 'bo';
    var o = DATA.offers[state.offer];
    $all('[data-tpm-picker] input').forEach(function (i) {
      i.checked = (i.name.indexOf('tpm-flavor-') === 0 && i.value === state.flavor) ||
        (i.name.indexOf('tpm-offer-') === 0 && i.value === state.offer);
    });
    $all('[data-tpm-fnote]').forEach(function (p) { p.textContent = DATA.flavors[state.flavor].note; });
    $all('[data-tpm-dot]').forEach(function (d) { d.classList.toggle('is-on', d.getAttribute('data-tpm-dot') === state.flavor); });
    $all('[data-tpm-shelf-track]').forEach(function (t) {
      var sel = t.querySelector('input[value="' + state.flavor + '"]');
      var opt = sel && sel.closest('.tpm-shelf__opt');
      if (opt && centered(t) !== opt && !t._prog) centerOpt(t, opt, false);
    });
    $all('[data-tpm-terms]').forEach(function (t) {
      t.textContent = (state.flavor === 'mix' ? o.split + '. ' : '') + o.terms;
    });
    var media = root.querySelector('[data-tpm-buy-media]');
    if (media) media.innerHTML = '<div class="tpm-buy__stage tpm-buy__stage--' + state.flavor + '">' + canStack(state.flavor) + '</div>';
    sheet.querySelector('[data-tpm-total]').textContent = money(dueToday());
    if (!busy) sheet.querySelector('[data-tpm-next-label]').textContent = step < 3 ? 'Continue' : 'Checkout · ' + money(dueToday());
  }

  // ---- Entry points into the checkout flow ----
  $all('[data-tpm-start]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      openCheckout({ step: parseInt(b.getAttribute('data-tpm-start-step'), 10) || 1 });
    });
  });
  $all('[data-tpm-pick]').forEach(function (b) {
    b.addEventListener('click', function () { openCheckout({ flavor: b.getAttribute('data-tpm-pick'), step: 1 }); });
  });
  $all('[data-tpm-apply]').forEach(function (b) {
    var parts = b.getAttribute('data-tpm-apply').split(':');
    var pickText = b.parentNode.querySelector('.tpm-use__pick');
    if (parts[0] === 'mix' && !hasFlavor('mix') && pickText) pickText.innerHTML = pickText.innerHTML.replace('The Mix', DATA.flavors.bo.name);
    b.addEventListener('click', function () { openCheckout({ flavor: parts[0], offer: parts[1], step: 1 }); });
  });

  // ---- Carousels: progress bar follows horizontal scroll ----
  $all('[data-tpm-carousel]').forEach(function (track) {
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
    // Names and prices come from the products picked in the buy section.
    var OFFER_NAMES = {};
    Object.keys(DATA.offers).forEach(function (k) {
      OFFER_NAMES[k] = DATA.offers[k].name + ' · ' + money(DATA.offers[k].price) + (k === 'autoship' ? '/mo' : '');
    });
    var showQ = function (n) {
      $all('[data-tpm-q]', quiz).forEach(function (p) { p.hidden = p.getAttribute('data-tpm-q') !== String(n); });
      stepLabel.textContent = n < 3 ? 'Question ' + n + ' of 2' : 'Done';
      var first = quiz.querySelector('[data-tpm-q="' + n + '"] button');
      if (first) first.focus();
    };
    $all('[data-tpm-quiz-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        answers = {};
        if (typeof quiz.showModal === 'function') quiz.showModal(); else quiz.setAttribute('open', '');
        showQ(1);
      });
    });
    $all('[data-tpm-answer]', quiz).forEach(function (b) {
      b.addEventListener('click', function () {
        var kv = b.getAttribute('data-tpm-answer').split(':');
        answers[kv[0]] = kv[1];
        if (kv[0] === 'flavor') { showQ(2); return; }
        quiz.querySelector('[data-tpm-quiz-match]').textContent = DATA.flavors[answers.flavor].name + ', ' + OFFER_NAMES[answers.offer];
        showQ(3);
      });
    });
    quiz.querySelector('[data-tpm-quiz-restart]').addEventListener('click', function () { answers = {}; showQ(1); });
    quiz.querySelector('[data-tpm-quiz-apply]').addEventListener('click', function () {
      if (typeof quiz.close === 'function') quiz.close(); else quiz.removeAttribute('open');
      openCheckout({ flavor: answers.flavor || 'bo', offer: answers.offer || 'trial', step: 1 });
    });
    quiz.addEventListener('click', function (e) { if (e.target === quiz) quiz.close(); });
  }

  // ---- Comparison table: hide the swipe hint and edge fade at the end ----
  $all('[data-tpm-ct]').forEach(function (sc) {
    var wrap = sc.parentNode;
    var paintCt = function () { wrap.classList.toggle('is-end', sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 4); };
    sc.addEventListener('scroll', paintCt, { passive: true });
    window.addEventListener('resize', paintCt);
    paintCt();
  });

  // ---- Reveal animations (chart draw, comparison checks) ----
  var animated = $all('[data-tpm-animate]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('will-animate'); en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.35 });
    animated.forEach(function (el) { el.classList.add('will-animate'); io.observe(el); });
  }

  // ---- Sticky CTA: after the hero, until the buy box ----
  var sticky = root.querySelector('[data-tpm-sticky]');
  var heroBtn = root.querySelector('.tpm-hero [data-tpm-start]') || root.querySelector('.tpm-hero');
  var buy = document.getElementById('tpm-buy');
  if (sticky && heroBtn && buy) {
    var queued = false;
    sticky.hidden = false;
    var update = function () {
      queued = false;
      var show = heroBtn.getBoundingClientRect().bottom < 0 && buy.getBoundingClientRect().top >= window.innerHeight;
      sticky.classList.toggle('is-visible', show);
      sticky.inert = !show;
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    };
    var queue = function () { if (!queued) { queued = true; window.requestAnimationFrame(update); } };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  }

  sync();
})();
