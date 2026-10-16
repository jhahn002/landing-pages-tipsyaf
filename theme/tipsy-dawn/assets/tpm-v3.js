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

  // ---- The Mix: real Mix products, or two different six-packs (see cartItems) ----
  var mixReady = Object.keys(DATA.offers).every(function (k) { return id(DATA.offers[k].variants.mix); });
  var allowMixed = mixReady || DATA.mixFallback !== false;
  if (!allowMixed && MODE !== 'preview') {
    delete DATA.flavors.mix;
    $all('[data-tpm-mix-only]').forEach(function (el) { el.remove(); });
  }
  function hasFlavor(f) { return !!DATA.flavors[f]; }
  // One case is one flavor. "Both flavors" is a second case (the Customize step's
  // offer), so six-packs inside an order are never mixed. mixPage only decides
  // whether the page's "both flavors" buttons stay.
  var mixPage = allowMixed;
  allowMixed = false;

  // ---- Second case offer (Customize step): add another 12-pack at a discount ----
  var CASE2 = DATA.case2 || {};
  var case2On = CASE2.enabled !== false && CASE2.percent > 0;

  // ---- Optional rewards ("60:Free shipping|100:Free gift") ----
  var REWARDS = String(DATA.rewards || '').split('|').map(function (part) {
    var kv = part.split(':');
    return { at: parseFloat(kv[0]), label: (kv.slice(1).join(':') || '').trim() };
  }).filter(function (r) { return r.at > 0 && r.label; }).sort(function (a, b) { return a.at - b.at; });

  // ---- Shared state ----
  // An order is built from six-packs: the trial is one, a 12-pack is two. Each
  // six-pack is one flavor, so a 12-pack can be 6 + 6 of different flavors.
  // packs[i] is a flavor key, or null for an empty slot (the "box" design).
  var PACK_FLAVORS = Object.keys(DATA.flavors).filter(function (f) { return f !== 'mix'; });
  var PACKS_PER_OFFER = { trial: 1, autoship: 2, onetime: 2 };
  var state = { offer: 'trial', packs: [PACK_FLAVORS[0]], addons: {}, seq: 0, case2: null };

  function packsNeeded(offer) { return PACKS_PER_OFFER[offer || state.offer] || 1; }
  function packsFull() { return state.packs.length === packsNeeded() && state.packs.every(Boolean); }
  function fillPacks(flavor) {
    var n = packsNeeded();
    var list = flavor === 'mix' && allowMixed ? PACK_FLAVORS.slice(0, 2) : [hasFlavor(flavor) && flavor !== 'mix' ? flavor : PACK_FLAVORS[0]];
    state.packs = [];
    for (var i = 0; i < n; i++) state.packs.push(list[i % list.length]);
    state.seq = 0;
  }
  function setOffer(k) {
    if (!DATA.offers[k]) return;
    var last = state.packs.filter(Boolean).slice(-1)[0] || PACK_FLAVORS[0];
    state.offer = k;
    var n = packsNeeded();
    state.packs = state.packs.slice(0, n);
    while (state.packs.length < n) state.packs.push(last);
    if (!allowMixed) state.packs = state.packs.map(function () { return state.packs[0] || last; });
    state.seq = Math.min(state.seq, n - 1);
    if (!case2Available()) state.case2 = null;
  }
  function case2Available() { return case2On && state.offer !== 'trial' && packsNeeded() > 1; }
  function case2Price() { return Math.round(DATA.offers[state.offer].price * (100 - CASE2.percent)) / 100; }
  function case2Saving() { return Math.round((DATA.offers[state.offer].price - case2Price()) * 100) / 100; }
  if (DATA.defaultOffer && DATA.defaultOffer !== state.offer) setOffer(DATA.defaultOffer);

  function packFlavor() {
    var f = state.packs.filter(Boolean);
    if (!f.length) return PACK_FLAVORS[0];
    return f.every(function (x) { return x === f[0]; }) ? f[0] : 'mix';
  }

  function dueToday() {
    var t = DATA.offers[state.offer].price;
    if (state.case2) t += case2Price();
    DATA.addons.forEach(function (a) { if (state.addons[a.id]) t += a.price; });
    return Math.round(t * 100) / 100;
  }

  function canStack(flavor) {
    if (flavor === 'mix') {
      return '<span class="tpm-can-pair">' + PACK_FLAVORS.slice(0, 2).map(function (f) { return '<img src="' + DATA.flavors[f].img + '" alt="">'; }).join('') + '</span>';
    }
    return '<img src="' + DATA.flavors[flavor].img + '" alt="">';
  }

  // ---- Offer cards ----
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

  // ---- Checkout sheet ----
  var sheet = root.querySelector('[data-tpm-checkout]');
  var step = 1;
  var errorEl = sheet.querySelector('[data-tpm-error]');
  var nextBtn = sheet.querySelector('[data-tpm-next]');
  var busy = false;

  // ---- Offer picker (buy box and the "Change" panel in the checkout) ----
  var pickerCount = 0;
  function pickerHtml(n) {
    return plansHtml(n) + '<p class="tpm-pick__terms" data-tpm-terms></p>';
  }
  function renderPicker(el) {
    var n = ++pickerCount;
    el.setAttribute('data-tpm-picker-n', n);
    el.innerHTML = pickerHtml(n);
    el.addEventListener('change', function (e) {
      if (e.target.name.indexOf('tpm-offer-') === 0) {
        setOffer(e.target.value);
      }
      sync();
    });
  }
  $all('[data-tpm-picker]').forEach(renderPicker);

  // ---- Flavor step: fill the order with six-packs ----
  // Five designs, chosen in the theme editor (TIPSY buy box > Flavor step) or
  // previewed with ?packer=shelf|box|steppers|sequence|split. 'shelf' is the chosen one.
  var PACKER_STYLES = ['shelf', 'box', 'steppers', 'sequence', 'split'];
  var packerStyle = String(DATA.packerStyle || '').trim();
  var pq = (window.location.search.match(/[?&]packer=(\w+)/) || [])[1];
  if (pq) packerStyle = pq;
  if (PACKER_STYLES.indexOf(packerStyle) < 0) packerStyle = 'shelf';

  function fname(f) { return DATA.flavors[f].name; }
  function canImg(f, cls) { return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + DATA.flavors[f].img + '" alt="">'; }
  function sixCans(f) {
    var h = '';
    for (var i = 0; i < 6; i++) h += canImg(f);
    return '<span class="tpm-six tpm-f--' + f + '" aria-hidden="true">' + h + '</span>';
  }
  function countOf(f) { return state.packs.filter(function (x) { return x === f; }).length; }
  function cansLine() {
    var filled = state.packs.filter(Boolean).length * 6;
    return '<strong>' + filled + '</strong> of ' + packsNeeded() * 6 + ' cans';
  }

  function boxHtml() {
    var n = packsNeeded();
    var slots = '';
    for (var i = 0; i < n; i++) {
      var f = state.packs[i];
      slots += f
        ? '<button type="button" class="tpm-box__slot is-filled tpm-f--' + f + '" data-tpm-slot="' + i + '" aria-label="Six-pack ' + (i + 1) + ': ' + fname(f) + '. Tap to empty.">' +
            sixCans(f) + '<span class="tpm-box__name">' + DATA.flavors[f].short + '</span><span class="tpm-box__x" aria-hidden="true">×</span></button>'
        : '<div class="tpm-box__slot is-empty"><span class="tpm-box__plus" aria-hidden="true">+</span><span class="tpm-box__name">Six-pack ' + (i + 1) + '</span></div>';
    }
    var full = packsFull();
    var adds = PACK_FLAVORS.map(function (f) {
      var dis = full && !allowMixed && countOf(f) === 0 && n > 1;
      return '<button type="button" class="tpm-addpack tpm-f--' + f + '" data-tpm-add="' + f + '"' + (dis ? ' disabled' : '') + '>' +
        canImg(f, 'tpm-addpack__can') + '<span class="tpm-addpack__text"><strong>' + fname(f) + '</strong><span>' + DATA.flavors[f].note + '</span></span>' +
        '<span class="tpm-addpack__btn">' + (full ? 'Swap in' : '+ 6') + '</span></button>';
    }).join('');
    return '<div class="tpm-pk tpm-pk--box">' +
      '<p class="tpm-pk__count" aria-live="polite">' + cansLine() + '</p>' +
      '<div class="tpm-box tpm-box--n' + n + '">' + slots + '</div>' +
      '<p class="tpm-pk__hint">' + (full ? 'Your box is full. Tap a six-pack to empty it, or swap a flavor in.' : 'Tap a flavor to drop in a six-pack.') + '</p>' +
      '<div class="tpm-addpacks">' + adds + '</div></div>';
  }

  function steppersHtml() {
    var n = packsNeeded();
    var rows = PACK_FLAVORS.map(function (f) {
      var c = countOf(f);
      return '<div class="tpm-stp tpm-f--' + f + (c ? ' is-on' : '') + '">' + canImg(f, 'tpm-stp__can') +
        '<div class="tpm-stp__text"><strong>' + fname(f) + '</strong><span>' + DATA.flavors[f].note + '</span></div>' +
        '<div class="tpm-stp__ctl" role="group" aria-label="' + fname(f) + ' six-packs">' +
          '<button type="button" data-tpm-dec="' + f + '" aria-label="One less ' + fname(f) + ' six-pack"' + (c === 0 || (c === n && n === 1) ? ' disabled' : '') + '>−</button>' +
          '<output aria-live="polite">' + c + '</output>' +
          '<button type="button" data-tpm-inc="' + f + '" aria-label="One more ' + fname(f) + ' six-pack"' + (c === n || (!allowMixed && n > 1) ? ' disabled' : '') + '>+</button>' +
        '</div><span class="tpm-stp__cans">' + c * 6 + ' cans</span></div>';
    }).join('');
    return '<div class="tpm-pk tpm-pk--steppers">' +
      '<div class="tpm-pk__meter" aria-hidden="true">' + state.packs.map(function (f) { return '<span class="tpm-f--' + f + '"></span>'; }).join('') + '</div>' +
      '<p class="tpm-pk__count" aria-live="polite">' + (n === 1 ? 'One six-pack. Pick its flavor.' : n + ' six-packs. Split them any way you like.') + '</p>' +
      rows + '</div>';
  }

  function sequenceHtml() {
    var n = packsNeeded();
    var i = Math.min(state.seq, n - 1);
    var chips = '';
    for (var k = 0; k < n; k++) {
      var f = state.packs[k];
      chips += '<li class="' + (k === i ? 'is-on' : '') + '"><button type="button" data-tpm-seq="' + k + '">' +
        '<span class="tpm-seq__dot tpm-f--' + f + '"></span>Six-pack ' + (k + 1) + '<em>' + (f ? DATA.flavors[f].short : '') + '</em></button></li>';
    }
    var opts = PACK_FLAVORS.map(function (f) {
      var same = i > 0 && state.packs[i - 1] === f;
      var on = state.packs[i] === f;
      return '<button type="button" class="tpm-seq__opt tpm-f--' + f + (on ? ' is-on' : '') + '" data-tpm-seqpick="' + f + '" aria-pressed="' + on + '">' +
        (same ? '<span class="tpm-seq__same">Same again</span>' : '') +
        '<span class="tpm-seq__img">' + canImg(f) + '</span><strong>' + fname(f) + '</strong><span>' + DATA.flavors[f].note + '</span></button>';
    }).join('');
    return '<div class="tpm-pk tpm-pk--seq">' + (n > 1 ? '<ol class="tpm-seq__packs">' + chips + '</ol>' : '') +
      '<p class="tpm-seq__q">' + (n > 1 ? 'Six-pack ' + (i + 1) + ' of ' + n + ': pick a flavor' : 'Pick your six-pack') + '</p>' +
      '<div class="tpm-seq__opts">' + opts + '</div></div>';
  }

  function splitHtml() {
    var n = packsNeeded();
    var combos = [];
    if (n === 1) PACK_FLAVORS.forEach(function (f) { combos.push([f]); });
    else {
      combos.push([PACK_FLAVORS[0], PACK_FLAVORS[0]]);
      if (allowMixed && PACK_FLAVORS[1]) combos.push([PACK_FLAVORS[0], PACK_FLAVORS[1]]);
      if (PACK_FLAVORS[1]) combos.push([PACK_FLAVORS[1], PACK_FLAVORS[1]]);
    }
    var cur = state.packs.join(',');
    var opts = combos.map(function (c) {
      var key = c.join(',');
      var mixed = c[0] !== c[c.length - 1];
      var title = mixed ? 'Half and half' : (n === 1 ? fname(c[0]) : 'All ' + DATA.flavors[c[0]].short);
      var sub = mixed ? '6 ' + fname(c[0]) + ' + 6 ' + fname(c[1]) : n * 6 + ' ' + fname(c[0]) + (n === 1 ? ' · ' + DATA.flavors[c[0]].note : '');
      var cans = c.map(function (f) { return sixCans(f); }).join('');
      return '<button type="button" class="tpm-split' + (key === cur ? ' is-on' : '') + (mixed ? ' tpm-split--mixed' : ' tpm-f--' + c[0]) + '" data-tpm-split="' + key + '" aria-pressed="' + (key === cur) + '">' +
        '<span class="tpm-split__cans tpm-split__cans--n' + n + '">' + cans + '</span>' +
        '<span class="tpm-split__text"><strong>' + title + '</strong><span>' + sub + '</span></span><span class="tpm-split__check" aria-hidden="true"></span></button>';
    }).join('');
    return '<div class="tpm-pk tpm-pk--split"><div class="tpm-splits">' + opts + '</div></div>';
  }

  // The swipeable shelf: the can in the center is the flavor of the whole case.
  function shelfNote(f) { return '<strong>' + (packsNeeded() * 6) + ' cans of ' + fname(f) + '</strong> · ' + DATA.flavors[f].note; }
  function shelfHtml() {
    var n = packsNeeded();
    var cur = state.packs[0] || PACK_FLAVORS[0];
    var opts = PACK_FLAVORS.map(function (f) {
      return '<label class="tpm-shelf__opt tpm-f--' + f + '"><input type="radio" name="tpm-pk-shelf" value="' + f + '"' + (f === cur ? ' checked' : '') + '>' +
        '<span class="tpm-shelf__box"><span class="tpm-shelf__img">' + canImg(f) + '</span><span class="tpm-shelf__name">' + fname(f) + '</span></span></label>';
    }).join('');
    var dots = PACK_FLAVORS.map(function (f) { return '<i' + (f === cur ? ' class="is-on"' : '') + '></i>'; }).join('');
    return '<div class="tpm-pk tpm-pk--shelf">' +
      '<p class="tpm-pk__count">' + (n > 1 ? 'One case, one flavor. Tap or swipe.' : 'Tap or swipe to pick your flavor.') + '</p>' +
      '<div class="tpm-shelf"><div class="tpm-shelf__track" data-tpm-shelf-track role="radiogroup" aria-label="Flavor">' + opts + '</div></div>' +
      '<div class="tpm-shelf__dots" aria-hidden="true">' + dots + '</div>' +
      '<p class="tpm-shelf__note" data-tpm-fnote aria-live="polite">' + shelfNote(cur) + '</p>' +
      (case2Available() && PACK_FLAVORS.length > 1 ? '<p class="tpm-shelf__tease"><span aria-hidden="true">🎁</span><span>Want both flavors? <strong>Add a second case for ' + CASE2.percent + '% off</strong> on the next step.</span></p>' : '') +
      '</div>';
  }

  // ---- Shelf scrolling: the can that settles in the center gets selected ----
  function restartClass(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth; // restart the CSS animation
    el.classList.add(cls);
  }
  function shelfCentered(track) {
    var mid = track.scrollLeft + track.clientWidth / 2, best = null, bestD = Infinity;
    $all('.tpm-shelf__opt', track).forEach(function (o) {
      var d = Math.abs(o.offsetLeft + o.offsetWidth / 2 - mid);
      if (d < bestD) { bestD = d; best = o; }
    });
    return best;
  }
  function shelfCenter(track, opt, smooth) {
    if (!track.clientWidth || !opt) return;
    track._prog = true;
    clearTimeout(track._pt);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: opt.offsetLeft + opt.offsetWidth / 2 - track.clientWidth / 2, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    track._pt = setTimeout(function () { track._prog = false; }, smooth ? 600 : 80);
  }
  function initShelf(enter) {
    var track = packerEl.querySelector('[data-tpm-shelf-track]');
    if (!track) return;
    var shelf = track.parentNode;
    if (enter) restartClass(shelf, 'is-enter');
    requestAnimationFrame(function () {
      var sel = track.querySelector('input:checked');
      shelfCenter(track, sel && sel.closest('.tpm-shelf__opt'), false);
    });
    track.addEventListener('scroll', function () {
      if (track._prog) return;
      clearTimeout(track._st);
      track._st = setTimeout(function () {
        var o = shelfCentered(track);
        var input = o && o.querySelector('input');
        if (input && !input.checked) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 90);
    }, { passive: true });
  }
  // Picking a flavor updates the shelf in place so the swipe isn't interrupted.
  function shelfChange(input) {
    var f = input.value;
    state.packs = state.packs.map(function () { return f; });
    var opt = input.closest('.tpm-shelf__opt');
    var track = opt.closest('[data-tpm-shelf-track]');
    restartClass(opt, 'is-pop');
    if (shelfCentered(track) !== opt) shelfCenter(track, opt, true);
    var opts = $all('.tpm-shelf__opt', track);
    $all('.tpm-shelf__dots i', packerEl).forEach(function (d, k) { d.classList.toggle('is-on', opts[k] === opt); });
    var note = packerEl.querySelector('[data-tpm-fnote]');
    if (note) { note.innerHTML = shelfNote(f); restartClass(note, 'is-swap'); }
    sync();
  }
  window.addEventListener('resize', function () {
    if (!packerEl) return;
    var track = packerEl.querySelector('[data-tpm-shelf-track]');
    var sel = track && track.querySelector('input:checked');
    if (sel) shelfCenter(track, sel.closest('.tpm-shelf__opt'), false);
  });

  // Savings nudge: one six-pack -> two (auto ship), or one-time -> auto ship.
  function upsellHtml() {
    var t = DATA.offers.trial, a = DATA.offers.autoship, o = DATA.offers.onetime;
    if (!a || !a.price) return '';
    if (state.offer === 'trial' && t && t.price) {
      var perTrial = t.price / 6, perAuto = a.price / 12;
      var pct = Math.round((1 - perAuto / perTrial) * 100);
      if (pct <= 0) return '';
      return '<div class="tpm-upsell"><div class="tpm-upsell__text"><strong>Add another six-pack, save ' + pct + '% a can</strong>' +
        '<span>12 cans for ' + money(a.price) + '/mo is ' + money(perAuto) + ' a can, vs ' + money(perTrial) + ' on the trial. Cancel anytime.</span></div>' +
        '<button type="button" class="tpm-upsell__btn" data-tpm-upsell="autoship">+ 6 cans</button></div>';
    }
    if (state.offer === 'onetime' && o && o.price > a.price) {
      return '<div class="tpm-upsell"><div class="tpm-upsell__text"><strong>Save ' + money(o.price - a.price) + ' with auto ship</strong>' +
        '<span>The same 12 cans for ' + money(a.price) + ', delivered monthly. Cancel anytime.</span></div>' +
        '<button type="button" class="tpm-upsell__btn" data-tpm-upsell="autoship">Switch</button></div>';
    }
    return '';
  }

  var packerEl = null;
  var LABELS = { toFlavors: DATA.labels && DATA.labels.toFlavors || 'Choose flavors', toCustomize: DATA.labels && DATA.labels.toCustomize || 'Continue' };
  function renderPacker(enter) {
    if (!packerEl) return;
    var html = packerStyle === 'shelf' ? shelfHtml() : packerStyle === 'steppers' ? steppersHtml() : packerStyle === 'sequence' ? sequenceHtml() : packerStyle === 'split' ? splitHtml() : boxHtml();
    var o = DATA.offers[state.offer];
    packerEl.innerHTML = '<p class="tpm-pk__offer"><strong>' + o.name + '</strong> · ' + money(o.price) + (state.offer === 'autoship' ? '/mo' : '') + '</p>' +
      html + upsellHtml() + '<p class="tpm-pk__terms" data-tpm-terms></p>';
    packerEl.className = 'tpm-packer tpm-packer--' + packerStyle;
    if (packerStyle === 'shelf') initShelf(enter === true);
    sync();
  }

  function packerClick(e) {
    var t;
    if ((t = e.target.closest('[data-tpm-add]'))) {
      var f = t.getAttribute('data-tpm-add');
      var empty = state.packs.indexOf(null);
      if (empty < 0 && state.packs.length < packsNeeded()) empty = state.packs.length;
      if (empty < 0) empty = packsNeeded() - 1;
      state.packs[empty] = f;
      if (!allowMixed) state.packs = state.packs.map(function (x) { return x ? f : x; });
    } else if ((t = e.target.closest('[data-tpm-slot]'))) {
      state.packs[parseInt(t.getAttribute('data-tpm-slot'), 10)] = null;
    } else if ((t = e.target.closest('[data-tpm-inc]'))) {
      var inc = t.getAttribute('data-tpm-inc');
      var other = state.packs.lastIndexOf(state.packs.filter(function (x) { return x !== inc; }).slice(-1)[0]);
      if (other >= 0) state.packs[other] = inc;
    } else if ((t = e.target.closest('[data-tpm-dec]'))) {
      var dec = t.getAttribute('data-tpm-dec');
      var alt = PACK_FLAVORS.filter(function (x) { return x !== dec; })[0];
      var at = state.packs.lastIndexOf(dec);
      if (at >= 0 && alt) state.packs[at] = alt;
    } else if ((t = e.target.closest('[data-tpm-seq]'))) {
      state.seq = parseInt(t.getAttribute('data-tpm-seq'), 10);
    } else if ((t = e.target.closest('[data-tpm-seqpick]'))) {
      var sf = t.getAttribute('data-tpm-seqpick');
      state.packs[state.seq] = sf;
      if (!allowMixed) state.packs = state.packs.map(function () { return sf; });
      if (state.seq < packsNeeded() - 1) state.seq++;
    } else if ((t = e.target.closest('[data-tpm-split]'))) {
      state.packs = t.getAttribute('data-tpm-split').split(',');
    } else if ((t = e.target.closest('[data-tpm-upsell]'))) {
      var before = state.packs.length;
      setOffer(t.getAttribute('data-tpm-upsell'));
      if (state.packs.length > before) {
        state.seq = before;
        // In the box, the new slot starts empty so the shopper picks its flavor.
        if (packerStyle === 'box') for (var b = before; b < state.packs.length; b++) state.packs[b] = null;
      }
    } else return;
    renderPacker();
  }

  packerEl = sheet.querySelector('[data-tpm-packer]');
  if (packerEl) {
    packerEl.addEventListener('click', packerClick);
    packerEl.addEventListener('change', function (e) { if (e.target.name === 'tpm-pk-shelf') shelfChange(e.target); });
  }

  // ---- Customize step: the order as cart lines, plus one offer ----
  // 12-packs get the second-case switch; the trial gets the upgrade to 12 cans.
  function lineHtml(f, name, sub, price, was, tag) {
    return '<div class="tpm-line tpm-f--' + f + '"><span class="tpm-line__thumb">' + canImg(f) + '</span>' +
      '<span class="tpm-line__text"><strong>' + name + '</strong><span>' + sub + '</span>' + (tag ? '<em class="tpm-line__tag">' + tag + '</em>' : '') + '</span>' +
      '<span class="tpm-line__price"><b>' + money(price) + '</b>' + (was ? '<s>' + money(was) + '</s>' : '') + '</span></div>';
  }
  function planText() { return state.offer === 'onetime' ? 'One time' : 'Every month'; }
  function renderOrder() {
    var box = sheet.querySelector('[data-tpm-order]');
    if (!box) return;
    var o = DATA.offers[state.offer], f = state.packs[0] || PACK_FLAVORS[0];
    var html = lineHtml(f, o.name, fname(f) + ' · ' + planText(), o.price);
    if (state.case2) html += lineHtml(state.case2, 'Second case', fname(state.case2) + ' · ' + planText(), case2Price(), o.price, CASE2.percent + '% off');
    if (case2Available()) {
      var on = !!state.case2;
      html += '<div class="tpm-c2' + (on ? ' is-on' : '') + '">' +
        (CASE2.tag ? '<span class="tpm-c2__tag"><span aria-hidden="true">⏱</span>' + CASE2.tag + (CASE2.ends ? ' · ' + CASE2.ends : '') + '</span>' : '') +
        '<button type="button" class="tpm-c2__row" role="switch" aria-checked="' + on + '" data-tpm-case2>' +
          '<span class="tpm-c2__icon" aria-hidden="true">%</span>' +
          '<span class="tpm-c2__text"><strong>' + (on ? 'Saving ' + money(case2Saving()) + ' on case 2' : 'Add a 2nd case, save ' + money(case2Saving())) + '</strong>' +
          '<span>Second case ' + CASE2.percent + '% off · ' + planText().toLowerCase() + '</span></span>' +
          '<span class="tpm-c2__switch" aria-hidden="true"></span></button>' +
        (on ? '<div class="tpm-c2__flavors" role="radiogroup" aria-label="Flavor for case 2">' + PACK_FLAVORS.map(function (k) {
          var sel = k === state.case2;
          return '<button type="button" role="radio" aria-checked="' + sel + '" class="tpm-c2__flavor tpm-f--' + k + '" data-tpm-case2-flavor="' + k + '">' + canImg(k) + DATA.flavors[k].short + '</button>';
        }).join('') + '</div>' : '') +
      '</div>';
    } else if (state.offer === 'trial' && DATA.offers.autoship && DATA.offers.autoship.price > o.price) {
      var a = DATA.offers.autoship;
      html += '<div class="tpm-c2 tpm-c2--up"><div class="tpm-c2__row"><span class="tpm-c2__icon" aria-hidden="true">+6</span>' +
        '<span class="tpm-c2__text"><strong>Add 6 more cans for ' + money(a.price - o.price) + '</strong><span>12 cans for ' + money(a.price) + '/mo · ' + money(a.price / 12) + ' a can</span></span>' +
        '<button type="button" class="tpm-c2__btn" data-tpm-upgrade>Upgrade</button></div></div>';
    }
    box.innerHTML = html;
    var pills = sheet.querySelector('[data-tpm-pills]');
    if (pills) {
      pills.hidden = step !== 3;
      pills.innerHTML = (state.case2 ? '<span class="tpm-pill tpm-pill--save">You\'re saving ' + money(case2Saving()) + '</span>' : '') +
        '<span class="tpm-pill tpm-pill--ok">' + (DATA.guarantee || '100-day money-back guarantee') + '</span>';
    }
  }
  sheet.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-tpm-case2]'))) {
      var cur = state.packs[0];
      state.case2 = state.case2 ? null : (PACK_FLAVORS.filter(function (k) { return k !== cur; })[0] || cur);
    } else if ((t = e.target.closest('[data-tpm-case2-flavor]'))) {
      state.case2 = t.getAttribute('data-tpm-case2-flavor');
    } else if ((t = e.target.closest('[data-tpm-upgrade]'))) {
      setOffer('autoship');
    } else return;
    renderOrder(); sync();
  });

  function renderAddons() {
    var box = sheet.querySelector('[data-tpm-addons]');
    if (!box) return;
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
    sheet.classList.toggle('is-dark', n === 2);
    if (n === 2) {
      if (!packsFull() && packerStyle !== 'box') fillPacks(packFlavor());
      renderPacker(true);
    }
    if (n === 3) {
      renderOrder(); renderAddons(); renderRewards();
      var tl = sheet.querySelector('[data-tpm-timeline]');
      if (tl) tl.hidden = state.offer !== 'trial';
    }
    errorEl.textContent = '';
    sync();
    var body = sheet.querySelector('.tpm-sheet__body');
    body.scrollTop = 0;
    var title = sheet.querySelector('[data-tpm-step="' + n + '"] .tpm-sheet__title');
    if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
  }

  function openCheckout(opts) {
    opts = opts || {};
    if (opts.offer) setOffer(opts.offer);
    // "Get both" needs two six-packs, so the trial steps up to the 12-pack auto ship.
    if (opts.flavor === 'mix' && case2On && packsNeeded() === 1 && !opts.offer) setOffer('autoship');
    if (opts.flavor) fillPacks(opts.flavor);
    if (opts.flavor === 'mix' && case2Available()) state.case2 = PACK_FLAVORS[1] || null;
    else if (!packsFull() && packerStyle !== 'box') fillPacks(packFlavor());
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
    if (step === 2 && !packsFull()) { errorEl.textContent = 'Fill your box first: ' + (packsNeeded() - state.packs.filter(Boolean).length) + ' more six-pack to go.'; return; }
    if (step < 3) showStep(step + 1); else checkout();
  });

  function cartItems() {
    var o = DATA.offers[state.offer];
    var f = packFlavor();
    var main = { quantity: 1 };
    if (f !== 'mix') main.id = id(o.variants[f]);
    else if (mixReady) main.id = id(o.variants.mix);
    else {
      // No Mix product yet: add the first flavor's 12-pack and note the split.
      main.id = id(o.variants[state.packs[0]]);
      main.properties = { Flavors: state.packs.map(function (x) { return '6 ' + fname(x); }).join(' + ') };
    }
    if (o.plan) main.selling_plan = o.plan;
    var items = [main];
    if (state.case2 && id(o.variants[state.case2])) {
      var c2 = { id: id(o.variants[state.case2]), quantity: 1, properties: { _offer: 'Second case ' + CASE2.percent + '% off' } };
      if (o.plan) c2.selling_plan = o.plan;
      // Two cases of one flavor share a variant; Shopify merges them into one line of 2.
      items.push(c2);
    }
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
      errorEl.textContent = 'This option isn\'t available right now. Please pick another flavor or plan.';
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
      .then(function () { window.location.href = '/checkout' + (state.case2 && CASE2.code ? '?discount=' + encodeURIComponent(CASE2.code) : ''); })
      .catch(function (err) {
        errorEl.textContent = err.message;
        busy = false;
        nextBtn.disabled = false;
        sync();
      });
  }

  // ---- Keep every picker, label and total in step ----
  function sync() {
    var o = DATA.offers[state.offer];
    $all('[data-tpm-picker] input').forEach(function (i) {
      i.checked = i.name.indexOf('tpm-offer-') === 0 && i.value === state.offer;
    });
    $all('[data-tpm-terms]').forEach(function (t) {
      t.textContent = (packFlavor() === 'mix' ? state.packs.map(function (x) { return '6 ' + fname(x); }).join(' + ') + '. ' : '') + o.terms;
    });
    var media = root.querySelector('[data-tpm-buy-media]');
    if (media) media.innerHTML = '<div class="tpm-buy__stage tpm-buy__stage--' + packFlavor() + '">' + canStack(packFlavor()) + '</div>';
    sheet.querySelector('[data-tpm-total]').textContent = money(dueToday());
    var pillsEl = sheet.querySelector('[data-tpm-pills]');
    if (pillsEl) pillsEl.hidden = step !== 3;
    if (!busy) {
      sheet.querySelector('[data-tpm-next-label]').textContent = step === 1 ? LABELS.toFlavors : step === 2 ? LABELS.toCustomize : 'Checkout · ' + money(dueToday());
      nextBtn.classList.toggle('is-waiting', step === 2 && !packsFull());
    }
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
    if (parts[0] === 'mix' && !mixPage && pickText) pickText.innerHTML = pickText.innerHTML.replace('The Mix', DATA.flavors.bo.name);
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
