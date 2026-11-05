function getProducts() {
    return JSON.parse(localStorage.getItem('altarek_products')) || [];
}

function saveProducts(products) {
    localStorage.setItem('altarek_products', JSON.stringify(products));
}

function renderTable() {
    const products = getProducts();
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">لا توجد منتجات حالياً.</td></tr>';
        return;
    }

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${product.image}" class="product-img" alt="${product.name}" onerror="this.src='https://via.placeholder.com/40'"></td>
            <td>${product.name}</td>
            <td>${product.price} ج.م</td>
            <td>
                <button class="btn btn-edit" onclick="editProduct('${product.id}')">تعديل</button>
                <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">حذف</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('prodId').value;
    let name = document.getElementById('prodName').value;
    const category = document.getElementById('prodCategory').value;
    const price = document.getElementById('prodPrice').value;
    const oldPrice = document.getElementById('prodOldPrice').value;
    let image = document.getElementById('prodImage').value;
    const video = document.getElementById('prodVideo').value;
    const description = document.getElementById('prodDesc').value;

    // صورة مؤقتة في حال لم يتم وضع رابط
    if (!image) image = 'https://via.placeholder.com/300x200?text=Product+Image';

    let products = getProducts();

    if (id) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], name, category, price, oldPrice, image, video, description };
        }
    } else {
        const newProduct = {
            id: Date.now().toString(),
            name, category, price, oldPrice, image, video, description
        };
        products.push(newProduct);
    }

    saveProducts(products);
    renderTable();
    resetForm();
    alert('تم الحفظ بنجاح! اذهب للمتجر لرؤية التغييرات.');
});

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('formTitle').innerText = 'إضافة منتج جديد';
}

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

function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        renderTable();
    }
}

document.addEventListener('DOMContentLoaded', renderTable);
