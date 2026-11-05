// حماية: إذا لم تكن هذه صفحة الإدارة، توقف عن العمل
if (!document.getElementById('githubToken')) {
    console.log("Not admin page");
} else {
    // باقي كود لوحة التحكم
    let currentProducts = [];
    const GH_OWNER = () => document.getElementById('githubOwner').value.trim();
    const GH_REPO = () => document.getElementById('githubRepo').value.trim();
    const GH_TOKEN = () => document.getElementById('githubToken').value.trim();
    const GH_FILE_PATH = 'products.json';
    const GH_BRANCH = 'main';

    window.saveToken = function() {
        localStorage.setItem('gh_token', GH_TOKEN());
        localStorage.setItem('gh_owner', GH_OWNER());
        localStorage.setItem('gh_repo', GH_REPO());
        checkTokenStatus();
    };

    function loadSettings() {
        document.getElementById('githubToken').value = localStorage.getItem('gh_token') || '';
        document.getElementById('githubOwner').value = localStorage.getItem('gh_owner') || '';
        document.getElementById('githubRepo').value = localStorage.getItem('gh_repo') || '';
        checkTokenStatus();
    }

    function checkTokenStatus() {
        const status = document.getElementById('tokenStatus');
        if (GH_TOKEN() && GH_OWNER() && GH_REPO()) {
            status.innerHTML = '✅ جاهز للحفظ.';
            status.style.color = 'green';
        } else {
            status.innerHTML = '⚠️ يرجى إدخال الإعدادات.';
            status.style.color = 'red';
        }
    }

    async function fetchProductsFromGitHub() {
        try {
            const response = await fetch(`https://api.github.com/repos/${GH_OWNER()}/${GH_REPO()}/contents/${GH_FILE_PATH}?ref=${GH_BRANCH}`, {
                headers: { 'Authorization': `token ${GH_TOKEN()}` }
            });
            if (response.status === 404) return { products: [], sha: null };
            const data = await response.json();
            if (data.message) throw new Error(data.message);
            const content = decodeURIComponent(escape(atob(data.content)));
            return { products: JSON.parse(content), sha: data.sha };
        } catch (error) {
            console.error('خطأ في الجلب:', error);
            return { products: [], sha: null, error: error.message };
        }
    }

    async function saveProductsToGitHub(products) {
        const msgDiv = document.getElementById('formMsg');
        const saveBtn = document.getElementById('saveBtn');
        
        if (!GH_TOKEN() || !GH_OWNER() || !GH_REPO()) {
            alert('❌ يرجى إدخال إعدادات GitHub أولاً.');
            return false;
        }

        saveBtn.disabled = true;
        saveBtn.innerText = '⏳ جاري الحفظ...';
        msgDiv.innerHTML = '⏳ جاري الاتصال بـ GitHub...';
        msgDiv.style.color = 'blue';

        try {
            const { sha, error } = await fetchProductsFromGitHub();
            if (error && error !== 'Not Found') throw new Error(error);

            const contentString = JSON.stringify(products, null, 2);
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
                msgDiv.innerHTML = '✅ تم الحفظ بنجاح! جاري تحويلك للمتجر...';
                msgDiv.style.color = 'green';
                renderTable(products);
                setTimeout(() => { window.location.href = 'index.html'; }, 2000);
                return true;
            } else {
                throw new Error(responseData.message || 'خطأ من GitHub');
            }
        } catch (error) {
            alert(`❌ فشل الحفظ!\nالسبب: ${error.message}`);
            msgDiv.innerHTML = `❌ فشل الحفظ: ${error.message}`;
            msgDiv.style.color = 'red';
            saveBtn.disabled = false;
            saveBtn.innerText = 'حفظ المنتج في الموقع';
            return false;
        }
    }

    function renderTable(products) {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">لا توجد منتجات.</td></tr>';
            return;
        }
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${product.image}" class="product-img"></td>
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
            if (file.size > 500 * 1024) {
                alert('❌ الصورة كبيرة جداً (أكثر من 500 كيلوبايت). اختر صورة أصغر.');
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
            alert('❌ يرجى رفع صورة أو وضع رابط صورة.');
            return;
        }

        let products = [...currentProducts];

        if (id) {
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) products[index] = { ...products[index], name, category, price, oldPrice, image, video, description };
        } else {
            products.push({ id: Date.now().toString(), name, category, price, oldPrice, image, video, description });
        }

        const success = await saveProductsToGitHub(products);
        if (success) currentProducts = products;
    });

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    window.resetForm = function() {
        document.getElementById('productForm').reset();
        document.getElementById('prodId').value = '';
        document.getElementById('formTitle').innerText = 'إضافة منتج جديد';
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('formMsg').innerHTML = '';
    };

    window.editProduct = function(id) {
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
                document.getElementById('imagePreview').innerHTML = `<img src="${product.image}" style="height:80px; border-radius:8px;"><br><small style="color:red">ارفع صورة جديدة للتعديل.</small>`;
            }
            document.getElementById('formTitle').innerText = 'تعديل المنتج';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.deleteProduct = async function(id) {
        if (confirm('هل أنت متأكد من الحذف؟')) {
            let products = currentProducts.filter(p => p.id !== id);
            await saveProductsToGitHub(products);
        }
    };

    document.addEventListener('DOMContentLoaded', async () => {
        loadSettings();
        if (GH_TOKEN() && GH_OWNER() && GH_REPO()) {
            const { products } = await fetchProductsFromGitHub();
            currentProducts = products;
            renderTable(products);
        } else {
            document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">أدخل إعدادات GitHub أولاً.</td></tr>';
        }
    });
}
