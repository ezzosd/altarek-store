let currentProducts = [];

// إعدادات GitHub
const GH_OWNER = () => document.getElementById('githubOwner').value.trim();
const GH_REPO = () => document.getElementById('githubRepo').value.trim();
const GH_TOKEN = () => document.getElementById('githubToken').value.trim();
const GH_FILE_PATH = 'products.json';
const GH_BRANCH = 'main'; // تأكد من اسم الفرع (main أو master)

function saveToken() {
    localStorage.setItem('gh_token', GH_TOKEN());
    localStorage.setItem('gh_owner', GH_OWNER());
    localStorage.setItem('gh_repo', GH_REPO());
    checkTokenStatus();
}

function loadSettings() {
    document.getElementById('githubToken').value = localStorage.getItem('gh_token') || '';
    document.getElementById('githubOwner').value = localStorage.getItem('gh_owner') || '';
    document.getElementById('githubRepo').value = localStorage.getItem('gh_repo') || '';
    checkTokenStatus();
}

function checkTokenStatus() {
    const status = document.getElementById('tokenStatus');
    if (GH_TOKEN() && GH_OWNER() && GH_REPO()) {
        status.innerHTML = '✅ تم إدخال الإعدادات. جاهز للحفظ.';
        status.style.color = 'green';
    } else {
        status.innerHTML = '⚠️ يرجى إدخال التوكن واسم المستودع للحفظ.';
        status.style.color = 'red';
    }
}

// دالة جلب المنتجات من GitHub
async function fetchProductsFromGitHub() {
    try {
        // نضيف الفرع للتأكد من جلب الملف الصحيح
        const response = await fetch(`https://api.github.com/repos/${GH_OWNER()}/${GH_REPO()}/contents/${GH_FILE_PATH}?ref=${GH_BRANCH}`, {
            headers: {
                'Authorization': `token ${GH_TOKEN()}`
            }
        });
        
        if (response.status === 404) return { products: [], sha: null };
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message);
        }
        
        const data = await response.json();
        
        // فك تشفير الـ Base64 بشكل يدعم اللغة العربية
        const content = decodeURIComponent(escape(atob(data.content)));
        const products = JSON.parse(content);
        return { products: products, sha: data.sha };
    } catch (error) {
        console.error('خطأ في جلب المنتجات:', error);
        return { products: [], sha: null, error: error.message };
    }
}

// دالة حفظ المنتجات في GitHub (مع معالجة أفضل للأخطاء)
async function saveProductsToGitHub(products) {
    const msgDiv = document.getElementById('formMsg');
    
    if (!GH_TOKEN() || !GH_OWNER() || !GH_REPO()) {
        msgDiv.innerHTML = '❌ يرجى إدخال إعدادات GitHub أولاً.';
        msgDiv.style.color = 'red';
        return false;
    }

    msgDiv.innerHTML = '⏳ جاري الحفظ في موقعك... (يرجى الانتظار)';
    msgDiv.style.color = 'blue';

    try {
        const { sha, error } = await fetchProductsFromGitHub();
        if (error && error !== 'Not Found') {
             throw new Error(error);
        }

        const contentString = JSON.stringify(products, null, 2);
        
        // ترميز آمن يدعم العربية
        const bytes = new TextEncoder().encode(contentString);
        const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
        const contentBase64 = btoa(binString);

        const response = await fetch(`https://api.github.com/repos/${GH_OWNER()}/${GH_REPO()}/contents/${GH_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GH_TOKEN()}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'تحديث المنتجات من لوحة التحكم',
                content: contentBase64,
                sha: sha || undefined,
                branch: GH_BRANCH 
            })
        });

        const responseData = await response.json();

        if (response.ok) {
            msgDiv.innerHTML = '✅ تم الحفظ بنجاح! سيظهر المنتج في المتجر خلال دقيقة.';
            msgDiv.style.color = 'green';
            renderTable(products);
            resetForm();
            return true;
        } else {
            // هنا سيظهر لك السبب الحقيقي للخطأ
            throw new Error(responseData.message || 'خطأ غير معروف');
        }
    } catch (error) {
        console.error('تفاصيل الخطأ:', error);
        msgDiv.innerHTML = `❌ فشل الحفظ: ${error.message} <br><small>تأكد من صلاحيات التوكن (repo) وأن الفرع اسمه main.</small>`;
        msgDiv.style.color = 'red';
        return false;
    }
}

function renderTable(products) {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">لا توجد منتجات. أضف منتجك الأول!</td></tr>';
        return;
    }
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${product.image}" class="product-img" alt="${product.name}"></td>
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

document.getElementById('prodImageFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 800 * 1024) { // الحد الأقصى 800 كيلوبايت
            alert('الصورة كبيرة جداً. يرجى اختيار صورة أقل من 800 كيلوبايت لتجنب رفض GitHub لها.');
            this.value = '';
            document.getElementById('imagePreview').innerHTML = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('imagePreview').innerHTML = `<img src="${event.target.result}" style="height:80px; border-radius:8px;">`;
            document.getElementById('prodImageUrl').value = '';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('prodId').value;
    const name = document.getElementById('prodName').value;
    const category = document.getElementById('prodCategory').value;
    const price = document.getElementById('prodPrice').value;
    const oldPrice = document.getElementById('prodOldPrice').value;
    const video = document.getElementById('prodVideo').value;
    const description = document.getElementById('prodDesc').value;
    
    let image = document.getElementById('prodImageUrl').value;
    const fileInput = document.getElementById('prodImageFile');
    
    if (fileInput.files.length > 0 && !image) {
        image = await toBase64(fileInput.files[0]);
    } else if (!image) {
        alert('يرجى رفع صورة أو وضع رابط صورة.');
        return;
    }

    let products = [...currentProducts];

    if (id) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) products[index] = { ...products[index], name, category, price, oldPrice, image, video, description };
    } else {
        products.push({ id: Date.now().toString(), name, category, price, oldPrice, image, video, description });
    }

    await saveProductsToGitHub(products);
    currentProducts = products;
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('formTitle').innerText = 'إضافة منتج جديد';
    document.getElementById('imagePreview').innerHTML = '';
    setTimeout(() => document.getElementById('formMsg').innerHTML = '', 3000);
}

function editProduct(id) {
    const product = currentProducts.find(p => p.id === id);
    if (product) {
        document.getElementById('prodId').value = product.id;
        document.getElementById('prodName').value = product.name;
        document.getElementById('prodCategory').value = product.category;
        document.getElementById('prodPrice').value = product.price;
        document.getElementById('prodOldPrice').value = product.oldPrice || '';
        document.getElementById('prodVideo').value = product.video || '';
        document.getElementById('prodDesc').value = product.description || '';
        
        if (!product.image.startsWith('data:image')) {
            document.getElementById('prodImageUrl').value = product.image;
            document.getElementById('imagePreview').innerHTML = `<img src="${product.image}" style="height:80px; border-radius:8px;">`;
        } else {
            document.getElementById('imagePreview').innerHTML = `<img src="${product.image}" style="height:80px; border-radius:8px;"><br><small style="color:red">للتعديل، يرجى رفع صورة جديدة أو وضع رابط.</small>`;
        }
        
        document.getElementById('formTitle').innerText = 'تعديل المنتج';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً من الموقع؟')) {
        let products = currentProducts.filter(p => p.id !== id);
        await saveProductsToGitHub(products);
        currentProducts = products;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    loadSettings();
    if (GH_TOKEN() && GH_OWNER() && GH_REPO()) {
        const { products } = await fetchProductsFromGitHub();
        currentProducts = products;
        renderTable(products);
    } else {
        document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">يرجى إدخال إعدادات GitHub أولاً لجلب المنتجات.</td></tr>';
    }
});
