(function () {
  'use strict';

  var ICON_WHATSAPP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.173-1.289.173-1.413"/></svg>';
  var ICON_FACEBOOK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
  var ICON_PLAY = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_EMPTY = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 16px;opacity:0.4;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>';

  function getCategorySVG(category) {
    var p='#8B1E3F', g='#C9A961';
    if (category === 'رولمان بلي') return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;padding:15%"><circle cx="100" cy="100" r="78" fill="#F5F1EB" stroke="'+p+'" stroke-width="3"/><circle cx="100" cy="100" r="66" fill="none" stroke="'+g+'" stroke-width="2"/><circle cx="100" cy="100" r="30" fill="none" stroke="'+p+'" stroke-width="3"/><circle cx="100" cy="52" r="6" fill="'+g+'"/><circle cx="100" cy="148" r="6" fill="'+g+'"/><circle cx="52" cy="100" r="6" fill="'+g+'"/><circle cx="148" cy="100" r="6" fill="'+g+'"/></svg>';
    if (category === 'أويل سيل') return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;padding:15%"><circle cx="100" cy="100" r="78" fill="none" stroke="'+p+'" stroke-width="4"/><circle cx="100" cy="100" r="60" fill="none" stroke="'+g+'" stroke-width="3"/><circle cx="100" cy="100" r="28" fill="none" stroke="'+p+'" stroke-width="3"/></svg>';
    if (category === 'سيور') return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;padding:15%"><path d="M50 60 Q100 40 150 60 L150 140 Q100 160 50 140Z" fill="none" stroke="'+p+'" stroke-width="4"/><circle cx="50" cy="100" r="25" fill="none" stroke="'+g+'" stroke-width="3"/><circle cx="150" cy="100" r="25" fill="none" stroke="'+g+'" stroke-width="3"/></svg>';
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="'+p+'" stroke-width="1"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33A1.65 1.65 0 0 0 14 21h-4a1.65 1.65 0 0 0-1.02-1.52 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15 1.65 1.65 0 0 0 3 14v-4a1.65 1.65 0 0 0 1.6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3h4a1.65 1.65 0 0 0 1 1.6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9 1.65 1.65 0 0 0 21 10v4a1.65 1.65 0 0 0-1.6 1z"/></svg>';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function normalize(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[ًٌٍَُِّْـ]/g,'')
      .replace(/[٠-٩]/g,function(d){return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d));})
      .replace(/[۰-۹]/g,function(d){return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d));})
      .trim();
  }

  var allProducts=[], currentCategory='all', currentSearch='';
  var cart=[];
  var CART_KEY='altarek_cart_v1';
  var grid=document.getElementById('storeProducts');
  var searchInput=document.getElementById('searchInput');
  var categoryCards=document.querySelectorAll('.category-card[data-category]');
  var cartOverlay=document.getElementById('cartOverlay');
  var cartList=document.getElementById('cartList');
  var cartCount=document.getElementById('cartCount');
  var sendCartButton=document.getElementById('sendCart');

  try { cart=JSON.parse(localStorage.getItem(CART_KEY)||'[]'); if(!Array.isArray(cart)) cart=[]; }
  catch(e) { cart=[]; }

  function saveCart() {
    try { localStorage.setItem(CART_KEY,JSON.stringify(cart)); } catch(e) {}
  }
  function findProduct(id) {
    return allProducts.find(function(p){return String(p.id)===String(id);});
  }
  function updateCartUI() {
    var total=cart.reduce(function(sum,item){return sum+item.qty;},0);
    if(cartCount) cartCount.textContent=String(total);
    if(!cartList) return;
    if(!cart.length) {
      cartList.innerHTML='<div class="cart-empty">سلة الطلبات فارغة حالياً</div>';
    } else {
      cartList.innerHTML=cart.map(function(item) {
        var p=findProduct(item.id);
        var name=p ? p.name : item.name;
        return '<div class="cart-row"><div><h3>'+esc(name)+'</h3><small>اطلب السعر عبر واتساب</small><div class="cart-controls"><button type="button" data-cart-action="dec" data-id="'+esc(item.id)+'" aria-label="تقليل الكمية">−</button><strong>'+item.qty+'</strong><button type="button" data-cart-action="inc" data-id="'+esc(item.id)+'" aria-label="زيادة الكمية">+</button><button type="button" class="cart-remove" data-cart-action="remove" data-id="'+esc(item.id)+'">حذف</button></div></div></div>';
      }).join('');
    }
    if(sendCartButton) sendCartButton.disabled=cart.length===0;
  }
  function addToCart(id) {
    var p=findProduct(id);
    if(!p || p.stock===false) return;
    var found=cart.find(function(item){return String(item.id)===String(id);});
    if(found) found.qty=Math.min(99,found.qty+1);
    else cart.push({id:String(p.id),name:String(p.name||''),qty:1});
    saveCart(); updateCartUI();
    var button=document.getElementById('openCart');
    if(button) button.setAttribute('aria-label','سلة الطلبات، '+cart.reduce(function(s,x){return s+x.qty;},0)+' منتجات');
  }
  function openCart() { if(cartOverlay) {cartOverlay.hidden=false; updateCartUI();} }
  function closeCart() { if(cartOverlay) cartOverlay.hidden=true; }
  function filterProducts() {
    return allProducts.filter(function(p) {
      if(currentCategory!=='all' && (p.category||'')!==currentCategory) return false;
      if(currentSearch) {
        var haystack=[p.name,p.id,p.category,p.description,p.badge,p.code,p.type].map(normalize).join(' ');
        if(haystack.indexOf(currentSearch)===-1) return false;
      }
      return true;
    });
  }
  function render() {
    if(!grid) return;
    var filtered=filterProducts();
    if(!filtered.length) {
      var empty=allProducts.length===0;
      grid.innerHTML='<div class="empty-state">'+ICON_EMPTY+'<h3>'+(empty?'لا توجد منتجات حالياً':'لا توجد نتائج مطابقة')+'</h3><p>'+(empty?'يرجى العودة لاحقاً أو التواصل معنا للاستفسار':'جرّب تغيير كلمة البحث أو القسم')+'</p></div>';
      return;
    }
    grid.innerHTML=filtered.map(renderCard).join('');
  }
  function renderCard(p) {
    var inStock=p.stock!==false;
    var imageHtml=p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.name)+'" loading="lazy" onerror="this.onerror=null;this.src=\'logo.png\';" />':'<div class="img-placeholder">'+getCategorySVG(p.category)+'</div>';
    var badgeHtml=p.badge?'<span class="badge">'+esc(p.badge)+'</span>':'';
    var stockHtml=!inStock?'<span class="out-of-stock">غير متوفر</span>':'';
    var videoBtn=p.video && /^https?:\/\//.test(p.video)?'<a href="'+esc(p.video)+'" target="_blank" rel="noopener" class="btn-video" title="فيديو">'+ICON_PLAY+'</a>':'';
    var waBtn=inStock?'<button class="btn-order btn-whatsapp" data-name="'+esc(p.name)+'" type="button">'+ICON_WHATSAPP+'<span>اطلب السعر عبر واتساب</span></button>':'<button class="btn-order" disabled type="button">غير متوفر</button>';
    var addBtn=inStock?'<button class="btn-add-cart" data-add-cart="'+esc(p.id)+'" type="button">أضف إلى السلة</button>':'';
    var fbBtn=inStock?'<a href="https://m.me/61562790860633" target="_blank" rel="noopener" class="btn-order btn-facebook">'+ICON_FACEBOOK+'<span>فيسبوك</span></a>':'';
    return '<div class="product-card"><div class="product-image">'+imageHtml+badgeHtml+stockHtml+'</div><div class="product-info"><div class="product-category">'+esc(p.category||'')+'</div><h3 class="product-title">'+esc(p.name||'')+'</h3><div class="product-actions">'+waBtn+addBtn+fbBtn+videoBtn+'</div></div></div>';
  }
  function orderProduct(name) {
    var msg=encodeURIComponent('مرحباً، أريد الاستفسار عن سعر وتوفر المنتج: '+name);
    window.open('https://wa.me/201110666981?text='+msg,'_blank','noopener');
  }
  function sendCart() {
    var lines=cart.map(function(item,i){return (i+1)+'. '+(findProduct(item.id)?.name||item.name)+' — الكمية: '+item.qty;});
    var message='مرحباً وكالة الطارق، أريد الاستفسار عن سعر وتوفر المنتجات التالية:\n'+lines.join('\n')+'\nشكراً لكم.';
    window.open('https://wa.me/201110666981?text='+encodeURIComponent(message),'_blank','noopener');
  }

  if(grid) grid.addEventListener('click',function(e) {
    var add=e.target.closest('[data-add-cart]');
    if(add) {addToCart(add.getAttribute('data-add-cart')); add.textContent='تمت الإضافة ✓'; setTimeout(function(){if(add.isConnected)add.textContent='أضف إلى السلة';},1100); return;}
    var order=e.target.closest('.btn-order[data-name]');
    if(order) orderProduct(order.getAttribute('data-name'));
  });
  if(searchInput) {
    var searchTimer;
    searchInput.addEventListener('input',function(e){clearTimeout(searchTimer);searchTimer=setTimeout(function(){currentSearch=normalize(e.target.value);render();},160);});
  }
  categoryCards.forEach(function(card) {
    card.addEventListener('click',function() {
      var cat=card.getAttribute('data-category');
      categoryCards.forEach(function(c){c.classList.remove('active');});
      if(currentCategory===cat) currentCategory='all';
      else {currentCategory=cat;card.classList.add('active');var target=document.getElementById('products');if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}
      render();
    });
  });
  var openButton=document.getElementById('openCart');
  var closeButton=document.getElementById('closeCart');
  if(openButton) openButton.addEventListener('click',openCart);
  if(closeButton) closeButton.addEventListener('click',closeCart);
  if(cartOverlay) cartOverlay.addEventListener('click',function(e){if(e.target===cartOverlay)closeCart();});
  if(cartList) cartList.addEventListener('click',function(e) {
    var b=e.target.closest('[data-cart-action]'); if(!b)return;
    var id=b.getAttribute('data-id'), item=cart.find(function(x){return String(x.id)===String(id);});
    if(!item)return;
    var action=b.getAttribute('data-cart-action');
    if(action==='inc') item.qty=Math.min(99,item.qty+1);
    else if(action==='dec') item.qty=Math.max(1,item.qty-1);
    else if(action==='remove') cart=cart.filter(function(x){return String(x.id)!==String(id);});
    saveCart();updateCartUI();
  });
  if(sendCartButton) sendCartButton.addEventListener('click',sendCart);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeCart();if(e.ctrlKey&&e.shiftKey&&e.key==='A'){e.preventDefault();window.location.href='admin.html';}});
  var adminClicks=0,adminTimer=null,copyEl=document.querySelector('.footer p');
  if(copyEl){copyEl.style.userSelect='none';copyEl.addEventListener('click',function(){adminClicks++;clearTimeout(adminTimer);adminTimer=setTimeout(function(){adminClicks=0;},3000);if(adminClicks>=5){adminClicks=0;window.location.href='admin.html';}});}
  var yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();
  updateCartUI();
  function loadProducts() {
    fetch('products.json?v='+Date.now(),{cache:'no-store'})
      .then(function(res){if(!res.ok)throw new Error('HTTP '+res.status);return res.json();})
      .then(function(data){if(Array.isArray(data))allProducts=data;else if(data&&Array.isArray(data.products))allProducts=data.products;else allProducts=[];cart=cart.filter(function(item){var p=findProduct(item.id);return p&&p.stock!==false;});saveCart();updateCartUI();render();})
      .catch(function(err){console.warn('فشل تحميل المنتجات:',err);allProducts=[];render();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadProducts);else loadProducts();
})();
