/* sproos! Rain & Rinse PDP mockups: shared behaviour.
 * Renders the header, purchase module, FAQs, footer and sticky bar from config.js,
 * so the shared pieces stay identical across all three directions.
 * Prototype only: no checkout, no network calls. */
(function () {
  var C = window.RR_CONFIG, P = window.RR_PAGE || {}, M = window.SPROOS_MARKS || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return C.pricing.currency + n; };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  var state = { color: C.colors[0], plan: 'sub', cart: 0 };

  var ico = {
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    search: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>',
    bag: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
    arrows: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg>'
  };

  /* ---------- Placeholder notes ---------- */
  function notes(root) {
    $$('[data-shot]', root).forEach(function (el) {
      if (el.querySelector('.ph__note')) return;
      var n = document.createElement('div');
      n.className = 'ph__note';
      n.innerHTML = '<b>' + esc(el.getAttribute('data-kind') || 'Photo') + '</b><span>' + esc(el.getAttribute('data-shot')) + '</span>';
      el.appendChild(n);
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'Placeholder: ' + el.getAttribute('data-shot'));
    });
  }

  /* ---------- Header + footer ---------- */
  function header() {
    var logo = (M.logo || '<span class="punch">sproos!</span>').replace('<svg', '<svg role="img" aria-label="sproos!"');
    return '<div class="announce">' + esc(C.trust.announcement) + '</div>' +
      '<header class="hdr"><div class="wrap hdr__in">' +
        '<div class="hdr__nav"><button class="hdr__menu" aria-label="Menu">' + ico.menu + '</button>' +
          '<a href="#">Shop All</a><a href="#">Hand Showers</a><a href="#">Shower Kits</a><a href="#">Accessories</a></div>' +
        '<a class="hdr__logo" href="#" aria-label="sproos! home">' + logo + '</a>' +
        '<div class="hdr__right"><button class="hdr__icon" aria-label="Search">' + ico.search + '</button>' +
          '<button class="hdr__icon" aria-label="Cart">' + ico.bag + '<span class="hdr__count" data-n="0">0</span></button></div>' +
      '</div></header>';
  }
  function footer() {
    var mark = (M.logo || 'sproos!');
    return '<footer class="foot on-dark"><div class="wrap foot__in">' +
      '<div class="foot__mark">' + mark + '</div>' +
      '<p class="small">Showers should be anything but boring. Design your space. Express yourself.</p>' +
      '<p class="small">© sproos! ' + new Date().getFullYear() + '</p></div></footer>';
  }

  /* ---------- Purchase module ---------- */
  function buyBox() {
    var p = C.product, pr = C.pricing;
    var kicker = (P.kicker || []).map(function (l) { return '<span>' + l + '</span>'; }).join('');
    var stars = new Array(6).join(ico.star);
    return '<div class="buy" id="buy">' +
      (kicker ? '<p class="buy__kicker">' + kicker + '</p>' : '') +
      '<div><h1 class="buy__title">' + esc(p.name) + '</h1><p class="buy__desc-tag">' + esc(p.descriptor) + '</p></div>' +
      '<div class="stars"><span class="stars__s" aria-hidden="true">' + stars + '</span><span><strong>' + esc(C.trust.rating) + '</strong> ' + esc(C.trust.ratingLine) + '</span></div>' +
      '<p class="buy__desc">' + esc(P.description || p.coreDescription) + '</p>' +
      '<ul class="benefits">' + p.benefits.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
      '<div><div class="field__label"><span>Color: <strong data-bind="color">' + esc(state.color.name) + '</strong></span><span class="small">' + esc(p.colorLabel) + '</span></div>' +
        '<div class="swatches" role="radiogroup" aria-label="Color">' + C.colors.map(function (c, i) {
          return '<button class="swatch" role="radio" aria-checked="' + (i === 0) + '" aria-label="' + esc(c.name) + '" data-color="' + c.id + '" style="--c:' + c.hex + '"></button>';
        }).join('') + '</div></div>' +
      '<div class="plans" role="radiogroup" aria-label="Purchase option">' +
        '<label class="plan is-on" data-plan="sub"><input type="radio" name="plan" value="sub" checked><span class="plan__dot"></span>' +
          '<span><span class="plan__name">With filter subscription</span><span class="plan__sub">Replacement filter: ' + money(pr.filterPrice) + ' every ' + pr.filterEveryDays + ' days.</span></span>' +
          '<span class="plan__price">' + money(pr.subscription) + '</span></label>' +
        '<label class="plan" data-plan="once"><input type="radio" name="plan" value="once"><span class="plan__dot"></span>' +
          '<span><span class="plan__name">One-time purchase</span></span>' +
          '<span class="plan__price">' + money(pr.oneTime) + '</span></label>' +
      '</div>' +
      '<div class="buy__cta" id="buy-cta">' +
        '<button class="btn btn--block" data-atc>Add to cart <span aria-hidden="true">·</span> <span data-bind="price">' + money(pr.subscription) + '</span></button>' +
        '<button class="tlink buy__fit" data-goto="faq-fit">Will it fit my shower?</button>' +
      '</div>' +
      '<ul class="perks">' + C.trust.perks.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
    '</div>';
  }

  /* ---------- Gallery ---------- */
  function gallery() {
    var g = P.gallery || [];
    var first = g[0] || { shot: 'Product', ar: 'sq' };
    return '<div class="gal' + (P.galleryRail ? ' gal--rail' : '') + '">' +
      '<div class="gal__main">' + (P.galleryLead ? P.galleryLead : '<div class="ph ph--' + (first.ar || 'sq') + '" data-gal-main data-shot="' + esc(first.shot) + '"></div>') + '</div>' +
      '<div class="gal__thumbs" role="tablist" aria-label="Product images">' + g.map(function (x, i) {
        return '<button class="gal__thumb" role="tab" aria-current="' + (i === 0) + '" aria-label="' + esc(x.shot) + '" data-i="' + i + '"><span>' + (i + 1) + '</span></button>';
      }).join('') + '</div></div>';
  }

  /* ---------- FAQs ---------- */
  function faqs() {
    var pr = C.pricing;
    var tbc = function (t) { return '<span class="tbc">To confirm</span> <span class="small">' + t + '</span>'; };
    var items = [
      ['faq-fit', 'Will Rain & Rinse fit my shower?', '<p>' + tbc('Verified compatibility details go here: supported shower arm and wall setups, plus anything that needs checking before ordering.') + '</p>'],
      ['', 'What comes in the box?', '<p>A 10-inch overhead rain shower, a hand shower with hose and wall-mounted holder, the diverter, the shared filter housing and installation tools.</p><p>' + tbc('Final packing list, including whether a filter cartridge ships in the box.') + '</p>'],
      ['faq-install', 'How do I install it?', '<p>Installation tools are included.</p><p>' + tbc('Install overview and link to the Rain & Rinse install guide.') + '</p>'],
      ['', 'Can I use both heads at once?', '<p>Yes. Select Bliss Mode on the diverter to run the rain shower and hand shower together. You can also use either head on its own.</p>'],
      ['', 'What does the filter remove?', '<p>' + tbc('Approved filtration claims for the Rain & Rinse filter.') + '</p>'],
      ['', 'How often do I replace the filter?', '<p>Every ' + pr.filterEveryDays + ' days. One filter serves both heads, so there is only one to swap.</p>'],
      ['', 'How does the filter subscription work?', '<p>A replacement filter is ' + money(pr.filterPrice) + ', delivered every ' + pr.filterEveryDays + ' days.</p><p>' + tbc('Billing, skip, pause and cancellation terms.') + '</p>'],
      ['', 'What are the shipping, return, and warranty terms?', '<p>Free shipping on orders over $99. 60 day free returns. 5 year warranty.</p>']
    ];
    return '<section class="sec" aria-labelledby="faq-h"><div class="wrap">' +
      '<div class="sec__head sec__head--split"><h2 class="h2" id="faq-h">Questions? <em>Answered.</em></h2></div>' +
      '<div class="faq">' + items.map(function (it) {
        return '<details' + (it[0] ? ' id="' + it[0] + '"' : '') + '><summary>' + esc(it[1]) + '</summary><div class="faq__a">' + it[2] + '</div></details>';
      }).join('') + '</div></div></section>';
  }

  function sticky() {
    return '<div class="sticky" aria-hidden="true"><span class="sticky__sw"></span>' +
      '<span class="sticky__meta"><strong>' + esc(C.product.name) + '</strong><span><span data-bind="color">' + esc(state.color.name) + '</span> · <span data-bind="plan-short">With filter subscription</span></span></span>' +
      '<button class="btn" data-atc tabindex="-1"><span data-bind="price">' + money(C.pricing.subscription) + '</span> · Add</button></div>' +
      '<div class="toast" role="status" aria-live="polite"></div>';
  }

  /* ---------- Mount ---------- */
  function mount() {
    var h = $('[data-slot="header"]'); if (h) h.outerHTML = header();
    var pdp = $('[data-slot="pdp"]');
    if (pdp) pdp.innerHTML = gallery() + '<div class="pdp__buy">' + buyBox() + '</div>';
    var f = $('[data-slot="faq"]'); if (f) f.outerHTML = faqs();
    var ft = $('[data-slot="footer"]'); if (ft) ft.outerHTML = footer() + sticky();
    notes(document);
    // Inline prices in story copy read from config.js
    $$('[data-cfg="days"]').forEach(function (e) { e.textContent = C.pricing.filterEveryDays; });
    $$('[data-cfg="filter"]').forEach(function (e) { e.textContent = money(C.pricing.filterPrice); });
    applyColor(state.color);
    wire();
  }

  function applyColor(c) {
    state.color = c;
    var r = document.documentElement.style;
    r.setProperty('--pick', c.hex); r.setProperty('--pick-tint', c.tint); r.setProperty('--pick-ink', c.ink);
    $$('[data-bind="color"]').forEach(function (el) { el.textContent = c.name; });
    $$('.swatch').forEach(function (s) { s.setAttribute('aria-checked', s.getAttribute('data-color') === c.id); });
  }
  function applyPlan(plan) {
    state.plan = plan;
    var price = plan === 'sub' ? C.pricing.subscription : C.pricing.oneTime;
    $$('.plan').forEach(function (p) { var on = p.getAttribute('data-plan') === plan; p.classList.toggle('is-on', on); $('input', p).checked = on; });
    $$('[data-bind="price"]').forEach(function (el) { el.textContent = money(price); });
    $$('[data-bind="plan-short"]').forEach(function (el) { el.textContent = plan === 'sub' ? 'With filter subscription' : 'One-time purchase'; });
  }

  var toastT;
  function toast(msg) {
    var t = $('.toast'); if (!t) return;
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-on'); }, 2200);
  }

  function goTo(id) {
    var el = document.getElementById(id); if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: id === 'buy' ? 'start' : 'center' });
    if (id === 'buy') { var b = $('.swatch[aria-checked="true"]'); if (b) setTimeout(function () { b.focus({ preventScroll: true }); }, 500); }
  }

  function wire() {
    // Gallery
    var g = P.gallery || [];
    $$('.gal__thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        var i = +t.getAttribute('data-i'), item = g[i];
        $$('.gal__thumb').forEach(function (x) { x.setAttribute('aria-current', x === t); });
        var main = $('.gal__main');
        if (i === 0 && P.galleryLead) { main.innerHTML = P.galleryLead; }
        else { main.innerHTML = '<div class="ph ph--' + (item.ar || 'sq') + '" data-gal-main data-shot="' + esc(item.shot) + '"></div>'; }
        notes(main);
      });
    });

    // Color + plan
    $$('.swatch').forEach(function (s) {
      s.addEventListener('click', function () {
        applyColor(C.colors.filter(function (c) { return c.id === s.getAttribute('data-color'); })[0]);
      });
    });
    $$('.plan input').forEach(function (inp) { inp.addEventListener('change', function () { applyPlan(inp.value); }); });

    // Add to cart (local only)
    $$('[data-atc]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.cart += 1;
        var n = $('.hdr__count'); n.textContent = state.cart; n.setAttribute('data-n', state.cart);
        toast('Added: ' + C.product.name + ' in ' + state.color.name + '. Prototype only, no checkout.');
        var main = $('.buy [data-atc]');
        main.classList.add('is-added');
        var old = main.innerHTML; main.textContent = 'Added to cart';
        setTimeout(function () { main.classList.remove('is-added'); main.innerHTML = old; applyPlan(state.plan); }, 1600);
      });
    });

    // Jump links
    $$('[data-goto]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); goTo(a.getAttribute('data-goto')); });
    });

    // Sticky bar: shows once the main purchase controls have scrolled out above the viewport
    var cta = $('#buy-cta'), bar = $('.sticky');
    if (cta && bar && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var e = es[0], past = !e.isIntersecting && e.boundingClientRect.top < 0;
        bar.classList.toggle('is-on', past);
        bar.setAttribute('aria-hidden', !past);
        $('[data-atc]', bar).tabIndex = past ? 0 : -1;
      }).observe(cta);
    }

    // Tabs (generic): [data-tabs] container, .tab buttons with data-tab, panels with data-panel
    $$('[data-tabs]').forEach(function (box) {
      var tabs = $$('.tab', box);
      function sel(id) {
        tabs.forEach(function (t) { var on = t.getAttribute('data-tab') === id; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
        $$('[data-panel]', box).forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== id; });
        $$('[data-mode-on]', box).forEach(function (c) { c.classList.toggle('is-on', c.getAttribute('data-mode-on').split(' ').indexOf(id) > -1); });
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { sel(t.getAttribute('data-tab')); });
        t.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
          var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); sel(n.getAttribute('data-tab'));
        });
      });
      sel(tabs[0].getAttribute('data-tab'));
    });

    // Before/after slider
    $$('.ba').forEach(function (ba) {
      var r = $('input', ba);
      var set = function () { ba.style.setProperty('--pos', r.value + '%'); };
      r.addEventListener('input', set); set();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
