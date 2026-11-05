document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('storeProducts');
    if (!productsGrid) return;

    // جلب المنتجات من الذاكرة
    const products = JSON.parse(localStorage.getItem('altarek_products')) || [];

    // إذا كانت الذاكرة فارغة (مثلاً أول مرة تفتح الموقع)، اعرض منتجات تجريبية
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">
                <h3>لا توجد منتجات معروضة حالياً.</h3>
                <p>يرجى الدخول إلى <a href="admin.html" style="color: #7a1e2e; font-weight: bold; text-decoration: underline;">لوحة التحكم</a> لإضافة منتجاتك.</p>
            </div>
        `;
        return;
    }

    // عرض المنتجات
    productsGrid.innerHTML = products.map(product => {
        // معالجة السعر قبل الخصم
        const oldPriceHTML = product.oldPrice 
            ? `<span class="old-price">${product.oldPrice} ج.م</span>` 
            : '';
            
        // معالجة الملصق (خصم أو جديد)
        let badgeHTML = '';
        if (product.oldPrice) {
            const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
            badgeHTML = `<span class="badge">خصم ${discount}%</span>`;
        }

        // زر الفيديو (إذا وجد)
        const videoBtnHTML = product.video 
            ? `<a href="${product.video}" target="_blank" class="btn-video">▶ شاهد الفيديو</a>` 
            : '';

        // رابط طلب الواتساب المخصص باسم المنتج
        const waLink = `https://wa.me/201110666981?text=مرحباً، أريد الاستفسار عن: ${encodeURIComponent(product.name)}`;

        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${badgeHTML}
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${product.price} ج.م</span>
                        ${oldPriceHTML}
                    </div>
                    <div style="display:flex; gap:5px;">
                        <a href="${waLink}" target="_blank" class="btn-order" style="flex:1;">
                            <span>اطلب</span> 🟢
                        </a>
                        ${videoBtnHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');
});
