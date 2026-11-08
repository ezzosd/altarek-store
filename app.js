(function () {
  'use strict';

  var ICON_WHATSAPP =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>';

  var ICON_FACEBOOK =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';

  var ICON_PLAY =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  var ICON_EMPTY =
    '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 16px;opacity:0.4;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>';

  function getCategorySVG(category) {
    var p = '#8B1E3F', g = '#C9A961';
    if (category === 'رولمان بلي') {
      return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;padding:15%">' +
        '<circle cx="100" cy="100" r="78" fill="#F5F1EB" stroke="' + p + '" stroke-width="3"/>' +
        '<circle cx="100" cy="100" r="66" fill="none" stroke="' + g + '" stroke-width="2"/>' +
        '<circle cx="100" cy="100" r="30" fill="' + p + '" opacity="0.15"/>' +
        '<circle cx="100" cy="100" r="30" fill="none" stroke="' + p + '" stroke-width="3"/>' +
        '<circle cx="100" cy="52" r="6" fill="' + g + '"/><circle cx="100" cy="148" r="6" fill="' + g + '"/>' +
        '<circle cx="52" cy="100" r="6" fill="' + g + '"/><circle cx="148" cy="100" r="6" fill="' + g + '"/>' +
        '<circle cx="66" cy="66" r="6" fill="' + g + '"/><circle cx="134" cy="134" r="6" fill="' + g + '"/>' +
        '<circle cx="134" cy="66" r="6" fill="' + g + '"/><circle cx="66" cy="134" r="6" fill="' + g + '"/>' +
        '</svg>';
    }
    if (category === 'أويل سيل') {
      return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;padding:15%">' +
        '<circle cx="100" cy="100" r="78" fill="' + p + '" opacity="0.1"/>' +
        '<circle cx="100" cy="100" r="78" fill="none" stroke="' + p + '" stroke-width="4"/>' +
        '<circle cx="100" cy="100" r="60" fill="none" stroke="' + g + '" stroke-width="3"/>' +
        '<circle cx="100" cy="100" r="46" fill="#F5F1EB" stroke="' + p + '" stroke-width="2"/>' +
        '<circle cx="100" cy="100" r="28" fill="' + p + '" opacity="0.15"/>' +
        '<circle cx="100" cy="100" r="28" fill="none" stroke="' + p + '" stroke-width="3"/>' +
        '</svg>';
    }
    if (category === 'سيور') {
      return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;padding:15%">' +
        '<path d="M 50 60 Q 100 40 150 60 L 150 140 Q 100 160 50 140 Z" fill="' + p + '" opacity="0.15"/>' +
        '<path d="M 50 60 Q 100 40 150 60 L 150 140 Q 100 160 50 140 Z" fill="none" stroke="' + p + '" stroke-width="4"/>' +
        '<circle cx="50" cy="100" r="25" fill="' + g + '" opacity="0.3"/>' +
        '<circle cx="50" cy="100" r="25" fill="none" stroke="' + p + '" stroke-width="3"/>' +
        '<circle cx="50" cy="100" r="8" fill="' + p + '"/>' +
        '<circle cx="150" cy="100" r="25" fill="' + g + '" opacity="0.3"/>' +
        '<circle cx="150" cy="100" r="25" fill="none" stroke="' + p + '" stroke-width="3"/>' +
        '<circle cx="150" cy="100" r="8" fill="' + p + '"/>' +
        '</svg>';
    }
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="' + p + '" stroke-width="1" style="width:50%;height:50%;opacity:0.4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var allProducts = [];
  var currentCategory = 'all';
  var currentSearch = '';

  var grid = document.getElementById('storeProducts');
  var searchInput = document.getElementById('searchInput');
  var categoryCards = document.querySelectorAll('.category-card[data-category]');

  function loadProducts() {
    fetch('products.json?v=' + Date.now(), { cache: 'no-store' })
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(function (data) {
        if (Array.isArray(data)) allProducts = data;
        else if (data && Array.isArray(data.products)) allProducts = data.products;
        else allProducts = [];
        render();
      })
      .catch(function (err) { console.warn('فشل تحميل المنتجات:', err); allProducts = []; render(); });
  }

  function filterProducts() {
    return allProducts.filter(function (p) {
      if (currentCategory !== 'all' && (p.category || '') !== currentCategory) return false;
      if (currentSearch) {
        var name = (p.name || '').toLowerCase();
        if (name.indexOf(currentSearch.toLowerCase()) === -1) return false;
      }
      return true;
    });
  }

  function render() {
    if (!grid) return;
    var filtered = filterProducts();
    if (filtered.length === 0) {
      var isEmpty = allProducts.length === 0;
      grid.innerHTML = '<div class="empty-state">' + ICON_EMPTY +
        '<h3>' + (isEmpty ? 'لا توجد منتجات حالياً' : 'لا توجد نتائج مطابقة') + '</h3>' +
        '<p>' + (isEmpty ? 'يرجى العودة لاحقاً أو التواصل معنا للاستفسار' : 'جرّب تغيير كلمة البحث أو القسم') + '</p>' +
        '</div>';
      return;
    }
    grid.innerHTML = filtered.map(renderCard).join('');
  }

  function renderCard(p) {
    var inStock = p.stock !== false;
    var imageHtml;
    if (p.image) {
      imageHtml = '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'logo.png\';" />';
    } else {
      imageHtml = '<div class="img-placeholder">' + getCategorySVG(p.category) + '</div>';
    }

    var badgeHtml = p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : '';
    var stockHtml = !inStock ? '<span class="out-of-stock">غير متوفر</span>' : '';

    var videoBtnHtml = '';
    if (p.video && /^https?:\/\//.test(p.video)) {
      videoBtnHtml = '<a href="' + esc(p.video) + '" target="_blank" rel="noopener" class="btn-video" title="فيديو">' + ICON_PLAY + '</a>';
    }

    var waBtn, fbBtn;
    if (inStock) {
      waBtn = '<button class="btn-order btn-whatsapp" data-name="' + esc(p.name) + '" type="button">' + ICON_WHATSAPP + '<span>واتساب</span></button>';
      fbBtn = '<a href="https://m.me/61562790860633" target="_blank" rel="noopener" class="btn-order btn-facebook">' + ICON_FACEBOOK + '<span>فيسبوك</span></a>';
    } else {
      waBtn = '<button class="btn-order" disabled type="button">غير متوفر</button>';
      fbBtn = '';
    }

    return '<div class="product-card">' +
      '<div class="product-image">' + imageHtml + badgeHtml + stockHtml + '</div>' +
      '<div class="product-info">' +
        '<div class="product-category">' + esc(p.category || '') + '</div>' +
        '<h3 class="product-title">' + esc(p.name || '') + '</h3>' +
        '<div class="product-actions">' + waBtn + fbBtn + videoBtnHtml + '</div>' +
      '</div></div>';
  }

  function orderProduct(name) {
    var msg = encodeURIComponent('مرحباً، أريد الاستفسار عن المنتج: ' + name);
    window.open('https://wa.me/201110666981?text=' + msg, '_blank', 'noopener');
  }

  if (grid) {
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-order[data-name]');
      if (!btn) return;
      orderProduct(btn.getAttribute('data-name'));
    });
  }

  if (searchInput) {
    var searchTimer;
    searchInput.addEventListener('input', function (e) {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () { currentSearch = e.target.value.trim(); render(); }, 200);
    });
  }

  categoryCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var cat = card.getAttribute('data-category');
      categoryCards.forEach(function (c) { c.classList.remove('active'); });
      if (currentCategory === cat) { currentCategory = 'all'; }
      else {
        currentCategory = cat;
        card.classList.add('active');
        var target = document.getElementById('products');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      render();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); window.location.href = 'admin.html'; }
  });

  var _adminClicks = 0, _adminTimer = null;
  var _copyEl = document.querySelector('.footer p');
  if (_copyEl) {
    _copyEl.style.userSelect = 'none';
    _copyEl.addEventListener('click', function () {
      _adminClicks++;
      clearTimeout(_adminTimer);
      _adminTimer = setTimeout(function () { _adminClicks = 0; }, 3000);
      if (_adminClicks >= 5) { _adminClicks = 0; window.location.href = 'admin.html'; }
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadProducts);
  else loadProducts();
})();
