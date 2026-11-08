(function () {
  'use strict';

  // ===== Utilities =====
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(v) {
    var n = Number(v);
    return isNaN(n) ? 0 : n;
  }
  function formatPrice(n) {
    return n.toLocaleString('ar-EG');
  }

  // ===== State =====
  var allProducts = [];
  var currentCategory = 'all';
  var currentSearch = '';

  // ===== DOM =====
  var grid = document.getElementById('storeProducts');
  var searchInput = document.getElementById('searchInput');
  var categoryCards = document.querySelectorAll('.category-card[data-category]');

  // ===== Load =====
  function loadProducts() {
    fetch('products.json?v=' + Date.now(), { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (Array.isArray(data)) allProducts = data;
        else if (data && Array.isArray(data.products)) allProducts = data.products;
        else allProducts = [];
        render();
      })
      .catch(function (err) {
        console.warn('فشل تحميل المنتجات:', err);
        allProducts = [];
        render();
      });
  }

  // ===== Filter =====
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

  // ===== Render =====
  function render() {
    if (!grid) return;
    var filtered = filterProducts();

    if (filtered.length === 0) {
      var isEmpty = allProducts.length === 0;
      grid.innerHTML =
        '<div class="empty-state">' +
          '<h3>' + (isEmpty ? 'لا توجد منتجات حالياً' : 'لا توجد نتائج مطابقة') + '</h3>' +
          '<p>' + (isEmpty ? 'يرجى العودة لاحقاً أو التواصل معنا للاستفسار' : 'جرّب تغيير كلمة البحث أو القسم') + '</p>' +
        '</div>';
      return;
    }

    grid.innerHTML = filtered.map(renderCard).join('');
  }

  function renderCard(p) {
    var price = num(p.price);
    var old = num(p.oldPrice);
    var hasDiscount = old > price && old > 0;
    var discountPct = hasDiscount ? Math.round(((old - price) / old) * 100) : 0;
    var inStock = p.stock !== false;

    var imageHtml;
    if (p.image) {
      imageHtml = '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'logo.png\';">';
    } else {
      imageHtml = '<div class="img-placeholder">⚙️</div>';
    }

    var badgeHtml = p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : '';
    var discountHtml = hasDiscount ? '<span class="badge">خصم ' + discountPct + '%</span>' : '';
    var stockHtml = !inStock ? '<span class="out-of-stock">غير متوفر</span>' : '';
    var oldPriceHtml = hasDiscount ? '<span class="old-price">' + formatPrice(old) + ' ج.م</span>' : '';

    var videoBtnHtml = '';
    if (p.video && /^https?:\/\//.test(p.video)) {
      videoBtnHtml = '<a href="' + esc(p.video) + '" target="_blank" rel="noopener" class="btn-video">▶ فيديو</a>';
    }

    var orderBtn;
    if (inStock) {
      orderBtn = '<button class="btn-order" data-name="' + esc(p.name) + '">🛒 اطلب عبر واتساب</button>';
    } else {
      orderBtn = '<button class="btn-order" disabled>غير متوفر</button>';
    }

    return (
      '<div class="product-card">' +
        '<div class="product-image">' +
          imageHtml + badgeHtml + discountHtml + stockHtml +
        '</div>' +
        '<div class="product-info">' +
          '<div class="product-category">' + esc(p.category || '') + '</div>' +
          '<h3 class="product-title">' + esc(p.name || '') + '</h3>' +
          '<div class="product-price">' +
            '<span class="current-price">' + formatPrice(price) + ' ج.م</span>' +
            oldPriceHtml +
          '</div>' +
          '<div style="display:flex; gap:8px; margin-top:auto;">' + orderBtn + videoBtnHtml + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // ===== Order =====
  function orderProduct(name) {
    var msg = encodeURIComponent('مرحباً، أريد الاستفسار عن المنتج: ' + name);
    window.open('https://wa.me/201110666981?text=' + msg, '_blank', 'noopener');
  }

  // ===== Events =====
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
      searchTimer = setTimeout(function () {
        currentSearch = e.target.value.trim();
        render();
      }, 200);
    });
  }

  categoryCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var cat = card.getAttribute('data-category');
      categoryCards.forEach(function (c) { c.classList.remove('active'); });
      if (currentCategory === cat) {
        currentCategory = 'all';
      } else {
        currentCategory = cat;
        card.classList.add('active');
        var target = document.getElementById('products');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      render();
    });
  });

  // ===== Hidden admin access =====
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });

  var _adminClicks = 0;
  var _adminTimer = null;
  var _copyEl = document.querySelector('.footer p');
  if (_copyEl) {
    _copyEl.style.userSelect = 'none';
    _copyEl.addEventListener('click', function () {
      _adminClicks++;
      clearTimeout(_adminTimer);
      _adminTimer = setTimeout(function () { _adminClicks = 0; }, 3000);
      if (_adminClicks >= 5) {
        _adminClicks = 0;
        window.location.href = 'admin.html';
      }
    });
  }

  // ===== Year =====
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Init =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
  } else {
    loadProducts();
  }
})();
