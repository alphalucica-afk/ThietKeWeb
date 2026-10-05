let currentBasePrice = 20950000;
let currentColorOffset = 0;
let selectedColorName = "Đen Băng";
let selectedStorageName = "12GB/256GB";
let quantity = 1;
let cartItems = [];

// DOM Elements
const priceValueEl = document.getElementById('priceValue');
const selectedColorNameEl = document.getElementById('selectedColorName');
const qtyInput = document.getElementById('qtyInput');
const cartBadge = document.getElementById('cartBadge');
const buyNowBtn = document.getElementById('buyNowBtn');

const orderModal = document.getElementById('orderModal');
const cartModal = document.getElementById('cartModal');
const orderForm = document.getElementById('orderForm');
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');

// Chọn hình ảnh Thumbnail
function selectThumb(element) {
    document.querySelectorAll('.thumb-box').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

// Cập nhật giá hiển thị
function updatePrice() {
    const unitPrice = currentBasePrice + currentColorOffset;
    priceValueEl.textContent = unitPrice.toLocaleString('vi-VN');
}

// Tăng / Giảm số lượng
document.getElementById('btnMinus').addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        qtyInput.value = quantity;
    }
});

document.getElementById('btnPlus').addEventListener('click', () => {
    quantity++;
    qtyInput.value = quantity;
});

qtyInput.addEventListener('change', (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    quantity = val;
    qtyInput.value = quantity;
});

// Chọn màu sắc
const colorBoxes = document.querySelectorAll('.color-box');
colorBoxes.forEach(box => {
    box.addEventListener('click', () => {
        colorBoxes.forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');

        selectedColorName = box.getAttribute('data-color');
        currentColorOffset = parseInt(box.getAttribute('data-price-offset')) || 0;

        selectedColorNameEl.textContent = selectedColorName;
        updatePrice();
    });
});

// Chọn dung lượng bộ nhớ
const storageBtns = document.querySelectorAll('.storage-btn');
storageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        storageBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        selectedStorageName = btn.getAttribute('data-storage');
        currentBasePrice = parseInt(btn.getAttribute('data-base-price'));

        updatePrice();
    });
});

// Thêm vào giỏ hàng
document.getElementById('addToCartBtn').addEventListener('click', () => {
    const unitPrice = currentBasePrice + currentColorOffset;

    const existingIndex = cartItems.findIndex(
        item => item.storage === selectedStorageName && item.color === selectedColorName
    );

    if (existingIndex > -1) {
        cartItems[existingIndex].qty += quantity;
    } else {
        cartItems.push({
            name: "Xiaomi 17 Pro",
            storage: selectedStorageName,
            color: selectedColorName,
            price: unitPrice,
            qty: quantity
        });
    }

    updateCartBadge();
    alert(`Đã thêm ${quantity} sản phẩm (${selectedStorageName} - ${selectedColorName}) vào giỏ hàng!`);
});

function updateCartBadge() {
    const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalCount;
}

// Mở Modal Giỏ Hàng
document.getElementById('cartNavBtn').addEventListener('click', () => {
    renderCartModal();
    cartModal.style.display = 'flex';
});

function renderCartModal() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align:center; padding:20px; color:#777;">Giỏ hàng của bạn đang trống.</p>';
        cartTotalPrice.textContent = '0 đ';
        return;
    }

    let html = '';
    let grandTotal = 0;

    cartItems.forEach((item) => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;
        html += `
          <div class="cart-item-row">
            <div>
              <strong>${item.name}</strong><br>
              <span style="color:#666;">${item.storage} | ${item.color}</span><br>
              <span style="color:#d0021b;">${item.price.toLocaleString('vi-VN')} đ</span> x ${item.qty}
            </div>
            <div>
              <strong>${itemTotal.toLocaleString('vi-VN')} đ</strong>
            </div>
          </div>
        `;
    });

    cartItemsList.innerHTML = html;
    cartTotalPrice.textContent = `${grandTotal.toLocaleString('vi-VN')} đ`;
}

// Tiến hành thanh toán từ giỏ hàng
document.getElementById('checkoutCartBtn').addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }
    cartModal.style.display = 'none';

    const grandTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById('summaryOption').textContent = `${cartItems.length} loại sản phẩm`;
    document.getElementById('summaryQty').textContent = totalQty;
    document.getElementById('summaryPrice').textContent = `${grandTotal.toLocaleString('vi-VN')} đ`;
    orderModal.style.display = 'flex';
});

// Nút Đặt Hàng Ngay
buyNowBtn.addEventListener('click', () => {
    const unitPrice = currentBasePrice + currentColorOffset;
    const totalPrice = unitPrice * quantity;

    document.getElementById('summaryOption').textContent = `${selectedStorageName} - ${selectedColorName}`;
    document.getElementById('summaryQty').textContent = quantity;
    document.getElementById('summaryPrice').textContent = `${totalPrice.toLocaleString('vi-VN')} đ`;
    orderModal.style.display = 'flex';
});

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Đóng Modal khi click ra ngoài
window.addEventListener('click', (e) => {
    if (e.target === orderModal) orderModal.style.display = 'none';
    if (e.target === cartModal) cartModal.style.display = 'none';
});

// Chỉ nhận kí tự số cho điện thoại
phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Xử lý gửi Form Đặt hàng & Tự động đồng bộ sang Admin
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const phoneRegex = /^0[0-9]{9}$/;
    const phoneValue = phoneInput.value.trim();
    const fullnameValue = document.getElementById('fullname').value.trim();
    const provinceValue = document.getElementById('province').value;
    const districtValue = document.getElementById('district').value.trim();
    const streetValue = document.getElementById('street').value.trim();
    const fullAddress = `${streetValue}, ${districtValue}, ${provinceValue}`;

    if (!phoneRegex.test(phoneValue)) {
        if (phoneError) phoneError.style.display = 'block';
        phoneInput.style.borderColor = '#d0021b';
        return;
    }

    if (phoneError) phoneError.style.display = 'none';
    phoneInput.style.borderColor = '#ccc';

    let orderTotal = (currentBasePrice + currentColorOffset) * quantity;
    let orderQty = quantity;
    let orderProdName = `Xiaomi 17 Pro (${selectedStorageName} - ${selectedColorName})`;

    if (cartItems.length > 0) {
        orderTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        orderQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
        orderProdName = cartItems.map(i => `${i.name} (${i.storage})`).join(', ');
    }

    // ----------------------------------------------------
    // XỬ LÝ ĐỒNG BỘ DỮ LIỆU SANG LOCALSTORAGE CỦA ADMIN
    // ----------------------------------------------------
    
    // 1. Đọc dữ liệu từ LocalStorage
    let adminProducts = JSON.parse(localStorage.getItem('PHONE_STORE_PRODUCTS')) || [
        { id: '#AP-01', name: 'iPhone 16 Pro Max 256GB', brand: 'Apple', price: 34990000, stock: 15, sold: 45 },
        { id: '#XM-01', name: 'Xiaomi 15 256GB', brand: 'Xiaomi', price: 15450000, stock: 20, sold: 12 },
        { id: '#XM-05', name: 'Xiaomi 17 Pro 256GB', brand: 'Xiaomi', price: 20950000, stock: 18, sold: 4 }
    ];

    let adminOrders = JSON.parse(localStorage.getItem('PHONE_STORE_ORDERS')) || [];

    // 2. Trừ tồn kho & cộng số lượng đã bán ở Admin
    let matchedProd = adminProducts.find(p => p.name.toLowerCase().includes('xiaomi 17 pro')) || 
                      adminProducts.find(p => p.brand === 'Xiaomi');

    if (matchedProd) {
        matchedProd.stock = Math.max(0, matchedProd.stock - orderQty);
        matchedProd.sold = (matchedProd.sold || 0) + orderQty;
    }

    // 3. Thêm đơn hàng mới vào danh sách Đơn hàng Admin
    const today = new Date().toISOString().split('T')[0];
    const newOrderId = '#DH-' + (adminOrders.length + 101);

    const newOrderObj = {
        id: newOrderId,
        customerName: fullnameValue,
        phone: phoneValue,
        province: provinceValue,
        address: fullAddress,
        brand: 'Xiaomi',
        product: orderProdName,
        quantity: orderQty,
        total: orderTotal,
        status: 'pending',
        date: today
    };

    adminOrders.unshift(newOrderObj);

    // 4. Lưu lại vào LocalStorage
    localStorage.setItem('PHONE_STORE_PRODUCTS', JSON.stringify(adminProducts));
    localStorage.setItem('PHONE_STORE_ORDERS', JSON.stringify(adminOrders));

    // Thông báo cho khách hàng
    alert(
        `🎉 ĐẶT HÀNG THÀNH CÔNG!\n\n` +
        `• Mã đơn hàng: ${newOrderId}\n` +
        `• Người nhận: ${fullnameValue}\n` +
        `• Số điện thoại: ${phoneValue}\n` +
        `• Sản phẩm: ${orderProdName}\n` +
        `• Số lượng: ${orderQty} máy\n` +
        `• Tổng tiền: ${orderTotal.toLocaleString('vi-VN')} ₫\n\n` +
        `✅ Đã tự động cập nhật doanh thu và trừ kho trên hệ thống Admin!`
    );

    // Reset Form & Giỏ hàng
    orderModal.style.display = 'none';
    orderForm.reset();
    cartItems = [];
    quantity = 1;
    if (qtyInput) qtyInput.value = 1;
    if (typeof updateCartBadge === 'function') updateCartBadge();
});