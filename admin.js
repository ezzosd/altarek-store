// دالة لجلب المنتجات من الذاكرة
function getProducts() {
    const products = localStorage.getItem('altarek_products');
    return products ? JSON.parse(products) : [];
}

// دالة لحفظ المنتجات في الذاكرة
function saveProducts(products) {
    localStorage.setItem('altarek_products', JSON.stringify(products));
}

// دالة لعرض المنتجات في الجدول
function renderTable() {
    const products = getProducts();
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">لا توجد منتجات حالياً. أضف منتجك الأول!</td></tr>';
        return;
    }

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${product.image}" class="product-img" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${product.price} ج.م</td>
            <td>${product.category}</td>
            <td>
                <button class="btn btn-edit" onclick="editProduct('${product.id}')">تعديل</button>
                <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">حذف</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// دالة التعامل مع إرسال النموذج (إضافة أو تعديل)
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('prodId').value;
    const name = document.getElementById('prodName').value;
    const category = document.getElementById('prodCategory').value;
    const price = document.getElementById('prodPrice').value;
    const oldPrice = document.getElementById('prodOldPrice').value;
    const image = document.getElementById('prodImage').value;
    const video = document.getElementById('prodVideo').value;
    const description = document.getElementById('prodDesc').value;

    let products = getProducts();

    if (id) {
        // تعديل منتج موجود
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], name, category, price, oldPrice, image, video, description };
        }
    } else {
        // إضافة منتج جديد
        const newProduct = {
            id: Date.now().toString(), // إنشاء معرف فريد
            name, category, price, oldPrice, image, video, description
        };
        products.push(newProduct);
    }

    saveProducts(products);
    renderTable();
    resetForm();
    alert('تم الحفظ بنجاح!');
});

// دالة تفريغ النموذج
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('formTitle').innerText = 'إضافة منتج جديد';
}

// دالة التعديل
function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    
    if (product) {
        document.getElementById('prodId').value = product.id;
        document.getElementById('prodName').value = product.name;
        document.getElementById('prodCategory').value = product.category;
        document.getElementById('prodPrice').value = product.price;
        document.getElementById('prodOldPrice').value = product.oldPrice || '';
        document.getElementById('prodImage').value = product.image;
        document.getElementById('prodVideo').value = product.video || '';
        document.getElementById('prodDesc').value = product.description || '';
        
        document.getElementById('formTitle').innerText = 'تعديل المنتج';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// دالة الحذف
function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        renderTable();
    }
}

// تشغيل الجدول عند فتح الصفحة
document.addEventListener('DOMContentLoaded', renderTable);
