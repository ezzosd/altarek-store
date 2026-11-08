(function () {
  'use strict';

  var config = null;
  var products = [];
  var currentSha = null;
  var editingId = null;
  var uploadedImagePath = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function utf8ToBase64(str) {
    var bytes = new TextEncoder().encode(str);
    var binary = '';
    for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function base64ToUtf8(str) {
    var binary = atob(str);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function fileToBase64(file) {
    return file.arrayBuffer().then(function (buffer) {
      var bytes = new Uint8Array(buffer);
      var binary = '';
      for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    });
  }

  function showMsg(id, type, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '<div class="status ' + type + '">' + esc(msg) + '</div>';
  }

  function ghHeaders(extra) {
    var h = {
      'Authorization': 'token ' + config.token,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }

  function ghUrl(path, withRef) {
    var base = 'https://api.github.com/repos/' + config.owner + '/' + config.repo + '/contents/' + path;
    return withRef ? base + '?ref=' + config.branch : base;
  }

  // ===== CSV Parser =====
  function parseCSV(text) {
    // إزالة BOM لو موجود (ملفات Excel UTF-8)
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    var rows = [];
    var row = [];
    var cell = '';
    var inQuotes = false;
    var i = 0;
    while (i < text.length) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cell += '"'; i += 2; continue; }
          inQuotes = false;
        } else {
          cell += ch;
        }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { row.push(cell); cell = ''; }
        else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
        else if (ch === '\r') { /* skip */ }
        else { cell += ch; }
      }
      i++;
    }
    if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row); }
    return rows;
  }

  function csvToProducts(text) {
    var rows = parseCSV(text);
    if (rows.length < 2) throw new Error('الملف فاضي أو غير صالح');
    var header = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    var result = [];
    for (var r = 1; r < rows.length; r++) {
      var row = rows[r];
      if (!row || row.length === 0 || !row[0]) continue;
      var obj = {};
      for (var c = 0; c < header.length; c++) {
        obj[header[c]] = row[c] !== undefined ? row[c] : '';
      }
      var name = (obj.name || obj['الاسم'] || obj['اسم المنتج'] || '').trim();
      if (!name) continue;
      var stock = obj.stock || obj['متوفر'] || 'true';
      result.push({
        id: (obj.id || Date.now().toString() + '_' + r).toString(),
        name: name,
        category: (obj.category || obj['القسم'] || obj['النوع'] || 'رولمان بلي').trim(),
        price: Number(obj.price || obj['السعر'] || 0),
        oldPrice: Number(obj.oldprice || obj['السعر القديم'] || 0),
        badge: (obj.badge || obj['الشارة'] || '').trim(),
        image: (obj.image || obj['الصورة'] || '').trim(),
        video: (obj.video || obj['الفيديو'] || '').trim(),
        description: (obj.description || obj['الوصف'] || '').trim(),
        stock: String(stock).toLowerCase() !== 'false' && String(stock) !== 'لا'
      });
    }
    return result;
  }

  // ===== Login =====
  function login() {
    var owner = document.getElementById('githubOwner').value.trim();
    var repo = document.getElementById('githubRepo').value.trim();
    var branch = document.getElementById('githubBranch').value.trim() || 'main';
    var token = document.getElementById('githubToken').value.trim();
    if (!owner || !repo || !token) {
      showMsg('loginMsg', 'error', '❌ املأ جميع الحقول');
      return;
    }
    showMsg('loginMsg', 'info', '⏳ جاري التحقق...');
    fetch('https://api.github.com/repos/' + owner + '/' + repo, {
      headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' }
    })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (err) { throw new Error(err.message || 'فشل التحقق'); });
        config = { owner: owner, repo: repo, branch: branch, token: token };
        sessionStorage.setItem('gh_admin', JSON.stringify(config));
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        loadProducts();
      })
      .catch(function (e) { showMsg('loginMsg', 'error', '❌ ' + e.message); });
  }

  function logout() {
    sessionStorage.removeItem('gh_admin');
    location.reload();
  }

  function loadProducts() {
    showMsg('saveMsg', 'info', '⏳ جاري تحميل المنتجات...');
    fetch(ghUrl('products.json', true), { headers: ghHeaders() })
      .then(function (res) {
        if (res.status === 404) {
          products = []; currentSha = null;
          renderTable();
          showMsg('saveMsg', 'info', 'ℹ️ الملف غير موجود. سيُنشأ عند الحفظ.');
          return null;
        }
        if (!res.ok) return res.json().then(function (err) { throw new Error(err.message || 'HTTP ' + res.status); });
        return res.json().then(function (data) {
          currentSha = data.sha;
          var content = base64ToUtf8(data.content.replace(/\n/g, ''));
          var parsed = JSON.parse(content);
          products = Array.isArray(parsed) ? parsed : (parsed.products || []);
          renderTable();
          showMsg('saveMsg', 'success', '✅ تم تحميل ' + products.length + ' منتج');
        });
      })
      .catch(function (e) { showMsg('saveMsg', 'error', '❌ فشل التحميل: ' + e.message); });
  }

  function renderTable() {
    var tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    document.getElementById('productCount').textContent = products.length;
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:#64748b;">لا توجد منتجات</td></tr>';
      return;
    }
    tbody.innerHTML = products.map(function (p) {
      var price = Number(p.price) || 0;
      var image = p.image
        ? '<img src="' + esc(p.image) + '" alt="" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">'
        : '<div style="width:50px;height:50px;background:#f1f5f9;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:24px;">⚙️</div>';
      return '<tr><td>' + image + '</td><td>' + esc(p.name) + '</td><td>' + esc(p.category || '') + '</td><td>' + price + ' ج.م</td><td>' +
        '<button class="btn-secondary" onclick="editProduct(\'' + esc(p.id) + '\')">✏️</button> ' +
        '<button class="btn-danger" onclick="deleteProduct(\'' + esc(p.id) + '\')">🗑️</button></td></tr>';
    }).join('');
  }

  // ===== Export =====
  window.exportJSON = function (withoutPrices) {
    if (products.length === 0) { alert('❌ لا توجد منتجات لتصديرها'); return; }
    var data = products;
    if (withoutPrices) {
      data = products.map(function (p) {
        var copy = {}; for (var k in p) { if (k !== 'price' && k !== 'oldPrice') copy[k] = p[k]; }
        return copy;
      });
    }
    var filename = 'products-' + new Date().toISOString().slice(0, 10) + (withoutPrices ? '-no-prices' : '') + '.json';
    downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
    showMsg('saveMsg', 'success', '✅ تم تصدير ' + data.length + ' منتج');
  };

  window.exportCSV = function () {
    if (products.length === 0) { alert('❌ لا توجد منتجات لتصديرها'); return; }
    var headers = ['id', 'name', 'category', 'badge', 'image', 'video', 'description', 'stock'];
    var rows = [headers.join(',')];
    products.forEach(function (p) {
      var row = headers.map(function (h) {
        var val = p[h] === undefined || p[h] === null ? '' : String(p[h]);
        if (val.indexOf(',') !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      });
      rows.push(row.join(','));
    });
    var csv = '\uFEFF' + rows.join('\n');
    downloadFile(csv, 'products-' + new Date().toISOString().slice(0, 10) + '.csv', 'text/csv;charset=utf-8');
    showMsg('saveMsg', 'success', '✅ تم تصدير CSV');
  };

  // ===== Import (JSON + CSV) =====
  window.importFile = function (mode) {
    var file = document.getElementById('importFile').files[0];
    if (!file) { alert('❌ اختر ملف أولاً'); return; }
    if (mode === 'replace' && !confirm('⚠️ هيتم حذف كل المنتجات الحالية واستبدالها. متأكد؟')) return;

    var isCSV = /\.csv$/i.test(file.name);
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var data;
        if (isCSV) {
          data = csvToProducts(e.target.result);
        } else {
          data = JSON.parse(e.target.result);
          if (!Array.isArray(data)) {
            if (data && Array.isArray(data.products)) data = data.products;
            else throw new Error('الملف يجب أن يكون مصفوفة JSON');
          }
        }

        if (data.length === 0) throw new Error('لم يتم العثور على منتجات صالحة');

        if (mode === 'replace') {
          products = data;
        } else {
          data.forEach(function (item) {
            var idx = -1;
            for (var i = 0; i < products.length; i++) {
              if (String(products[i].id) === String(item.id)) { idx = i; break; }
            }
            if (idx >= 0) products[idx] = item;
            else products.push(item);
          });
        }

        return saveProducts().then(function () {
          document.getElementById('importFile').value = '';
          showMsg('importMsg', 'success', '✅ تم استيراد ' + data.length + ' منتج (' + (isCSV ? 'CSV' : 'JSON') + ')');
        });
      } catch (err) {
        showMsg('importMsg', 'error', '❌ ' + err.message);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  function downloadFile(content, filename, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 100);
  }

  // ===== Edit / Delete =====
  window.editProduct = function (id) {
    var p = products.filter(function (x) { return String(x.id) === String(id); })[0];
    if (!p) return;
    editingId = p.id; uploadedImagePath = null;
    document.getElementById('prodId').value = p.id;
    document.getElementById('prodName').value = p.name || '';
    document.getElementById('prodCategory').value = p.category || 'رولمان بلي';
    document.getElementById('prodPrice').value = p.price != null ? p.price : '';
    document.getElementById('prodOldPrice').value = p.oldPrice != null ? p.oldPrice : '';
    document.getElementById('prodBadge').value = p.badge || '';
    document.getElementById('prodVideo').value = p.video || '';
    document.getElementById('prodDesc').value = p.description || '';
    document.getElementById('prodStock').checked = p.stock !== false;
    document.getElementById('prodImageUrl').value = (p.image && p.image.indexOf('images/') !== 0) ? p.image : '';
    document.getElementById('imagePreview').innerHTML = p.image
      ? '<img src="' + esc(p.image) + '" style="height:80px;border-radius:8px;border:1px solid #e2e8f0;">'
      : '';
    document.getElementById('formTitle').textContent = 'تعديل المنتج';
    document.getElementById('saveBtn').textContent = '💾 حفظ التعديلات';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.deleteProduct = function (id) {
    if (!confirm('حذف هذا المنتج؟')) return;
    products = products.filter(function (p) { return String(p.id) !== String(id); });
    saveProducts();
  };

  // ===== Form Submit =====
  function handleFormSubmit(e) {
    e.preventDefault();
    var saveBtn = document.getElementById('saveBtn');
    var name = document.getElementById('prodName').value.trim();
    if (!name) { showMsg('formMsg', 'error', '❌ اسم المنتج مطلوب'); return; }
    saveBtn.disabled = true; saveBtn.textContent = '⏳ جاري الحفظ...';

    var imageUrl = document.getElementById('prodImageUrl').value.trim();
    var fileInput = document.getElementById('prodImageFile');
    var imagePromise;
    if (fileInput.files.length > 0) {
      var file = fileInput.files[0];
      if (file.size > 750 * 1024) {
        showMsg('formMsg', 'error', '❌ الصورة كبيرة (الحد 750KB)');
        saveBtn.disabled = false; saveBtn.textContent = editingId ? '💾 حفظ التعديلات' : '💾 إضافة المنتج';
        return;
      }
      showMsg('formMsg', 'info', '⏳ جاري رفع الصورة...');
      imagePromise = uploadImage(file);
    } else {
      imagePromise = Promise.resolve(uploadedImagePath || imageUrl);
    }

    imagePromise.then(function (image) {
      var product = {
        id: editingId || Date.now().toString(),
        name: name,
        category: document.getElementById('prodCategory').value,
        price: Number(document.getElementById('prodPrice').value) || 0,
        oldPrice: Number(document.getElementById('prodOldPrice').value) || 0,
        badge: document.getElementById('prodBadge').value.trim(),
        image: image || '',
        video: document.getElementById('prodVideo').value.trim(),
        description: document.getElementById('prodDesc').value.trim(),
        stock: document.getElementById('prodStock').checked
      };
      if (editingId) {
        var idx = -1;
        for (var i = 0; i < products.length; i++) { if (String(products[i].id) === String(editingId)) { idx = i; break; } }
        if (idx >= 0) products[idx] = product; else products.push(product);
      } else {
        products.push(product);
      }
      return saveProducts().then(function () {
        resetForm();
        showMsg('formMsg', 'success', '✅ تم الحفظ بنجاح');
      });
    }).catch(function (e) {
      showMsg('formMsg', 'error', '❌ ' + e.message);
    }).finally(function () {
      saveBtn.disabled = false;
      saveBtn.textContent = editingId ? '💾 حفظ التعديلات' : '💾 إضافة المنتج';
    });
  }

  function uploadImage(file) {
    return fileToBase64(file).then(function (base64) {
      var ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      var filename = 'images/' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;
      return fetch(ghUrl(filename), {
        method: 'PUT', headers: ghHeaders(),
        body: JSON.stringify({ message: 'Upload ' + file.name, content: base64, branch: config.branch })
      }).then(function (res) {
        if (!res.ok) return res.json().then(function (err) { throw new Error('فشل رفع الصورة: ' + (err.message || res.status)); });
        return res.json().then(function (data) { uploadedImagePath = data.content.path; return uploadedImagePath; });
      });
    });
  }

  function saveProducts() {
    showMsg('saveMsg', 'info', '⏳ جاري الحفظ على GitHub...');
    return fetch(ghUrl('products.json', true), { headers: ghHeaders() })
      .then(function (headRes) {
        var sha = null;
        if (headRes.ok) return headRes.json().then(function (data) { sha = data.sha; return sha; });
        return null;
      })
      .then(function (sha) {
        var content = JSON.stringify(products, null, 2);
        var body = { message: 'تحديث المنتجات - ' + new Date().toISOString(), content: utf8ToBase64(content), branch: config.branch };
        if (sha) body.sha = sha;
        return fetch(ghUrl('products.json'), { method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body) });
      })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (err) { throw new Error(err.message || 'فشل الحفظ'); });
        return res.json().then(function (data) {
          currentSha = data.content.sha;
          renderTable();
          showMsg('saveMsg', 'success', '✅ تم حفظ ' + products.length + ' منتج على GitHub');
        });
      })
      .catch(function (e) {
        showMsg('saveMsg', 'error', '❌ فشل الحفظ: ' + e.message);
        throw e;
      });
  }

  function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('prodStock').checked = true;
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('formTitle').textContent = 'إضافة منتج جديد';
    document.getElementById('saveBtn').textContent = '💾 إضافة المنتج';
    document.getElementById('formMsg').innerHTML = '';
    editingId = null; uploadedImagePath = null;
  }

  function handleImageChange(e) {
    var file = e.target.files[0];
    if (!file) return;
    if (file.size > 750 * 1024) { alert('❌ الصورة كبيرة (الحد 750KB)'); e.target.value = ''; return; }
    var reader = new FileReader();
    reader.onload = function (ev) {
      document.getElementById('imagePreview').innerHTML = '<img src="' + ev.target.result + '" style="height:80px;border-radius:8px;border:1px solid #e2e8f0;">';
    };
    reader.readAsDataURL(file);
  }

  // ===== Bind =====
  var loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', function (e) { e.preventDefault(); login(); });
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  var productForm = document.getElementById('productForm');
  if (productForm) productForm.addEventListener('submit', handleFormSubmit);
  var resetBtn = document.getElementById('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetForm);
  var reloadBtn = document.getElementById('reloadBtn');
  if (reloadBtn) reloadBtn.addEventListener('click', loadProducts);
  var imageFile = document.getElementById('prodImageFile');
  if (imageFile) imageFile.addEventListener('change', handleImageChange);

  var stored = sessionStorage.getItem('gh_admin');
  if (stored) {
    try {
      config = JSON.parse(stored);
      document.getElementById('githubOwner').value = config.owner;
      document.getElementById('githubRepo').value = config.repo;
      document.getElementById('githubBranch').value = config.branch;
      document.getElementById('githubToken').value = config.token;
      document.getElementById('loginScreen').classList.add('hidden');
      document.getElementById('adminPanel').classList.remove('hidden');
      loadProducts();
    } catch (e) { sessionStorage.removeItem('gh_admin'); }
  }
})();
