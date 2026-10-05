let currentBasePrice = 29990000;
let currentColorOffset = 0;
let selectedColorName = "Titan Sa Mạc";
let selectedStorageName = "12GB/128GB";
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

// 1. Chọn hình ảnh Thumbnail
function selectThumb(element) {
    document.querySelectorAll('.thumb-box').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

// 2. Cập nhật giá hiển thị
function updatePrice() {
    const unitPrice = currentBasePrice + currentColorOffset;
    if (priceValueEl) {
        priceValueEl.textContent = unitPrice.toLocaleString('vi-VN');
    }
}

// 3. Tăng / Giảm số lượng
document.getElementById('btnMinus')?.addEventListener('click', () => {
    if (quantity > 1) {
        quantity--;
        if (qtyInput) qtyInput.value = quantity;
    }
});

document.getElementById('btnPlus')?.addEventListener('click', () => {
    quantity++;
    if (qtyInput) qtyInput.value = quantity;
});

qtyInput?.addEventListener('change', (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    quantity = val;
    qtyInput.value = quantity;
});

// 4. Chọn màu sắc
const colorBoxes = document.querySelectorAll('.color-box');
colorBoxes.forEach(box => {
    box.addEventListener('click', () => {
        colorBoxes.forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');

        selectedColorName = box.getAttribute('data-color') || "Titan Sa Mạc";
        currentColorOffset = parseInt(box.getAttribute('data-price-offset')) || 0;

        if (selectedColorNameEl) selectedColorNameEl.textContent = selectedColorName;
        updatePrice();
    });
});

// 5. Chọn dung lượng bộ nhớ
const storageBtns = document.querySelectorAll('.storage-btn');
storageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        storageBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        selectedStorageName = btn.getAttribute('data-storage') || "12GB/128GB";
        currentBasePrice = parseInt(btn.getAttribute('data-base-price')) || 29990000;

        updatePrice();
    });
});

// 6. Thêm vào giỏ hàng
document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    const unitPrice = currentBasePrice + currentColorOffset;

    const existingIndex = cartItems.findIndex(
        item => item.storage === selectedStorageName && item.color === selectedColorName
    );

    if (existingIndex > -1) {
        cartItems[existingIndex].qty += quantity;
    } else {
        cartItems.push({
            name: "iPhone 17 Pro",
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
    if (cartBadge) cartBadge.textContent = totalCount;
}

// 7. Mở Modal Giỏ Hàng
document.getElementById('cartNavBtn')?.addEventListener('click', () => {
    renderCartModal();
    if (cartModal) cartModal.style.display = 'flex';
});

function renderCartModal() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    if (!cartItemsList || !cartTotalPrice) return;

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
          <div class="cart-item-row" style="display:flex; justify-content:space-between; margin-bottom:10px; padding-bottom:5px; border-bottom:1px solid #eee;">
            <div>
              <strong>${item.name}</strong><br>
              <span style="color:#666; font-size:13px;">${item.storage} | ${item.color}</span><br>
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

// 8. Tiến hành thanh toán từ Giỏ hàng
document.getElementById('checkoutCartBtn')?.addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }
    if (cartModal) cartModal.style.display = 'none';

    const grandTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

    const summaryQtyEl = document.getElementById('summaryQty');
    const summaryPriceEl = document.getElementById('summaryPrice');

    if (summaryQtyEl) summaryQtyEl.textContent = totalQty;
    if (summaryPriceEl) summaryPriceEl.textContent = `${grandTotal.toLocaleString('vi-VN')} đ`;

    if (orderModal) orderModal.style.display = 'flex';
});

// 9. Nút ĐẶT HÀNG NGAY
buyNowBtn?.addEventListener('click', () => {
    const unitPrice = currentBasePrice + currentColorOffset;
    const totalPrice = unitPrice * quantity;

    const summaryQtyEl = document.getElementById('summaryQty');
    const summaryPriceEl = document.getElementById('summaryPrice');

    if (summaryQtyEl) summaryQtyEl.textContent = quantity;
    if (summaryPriceEl) summaryPriceEl.textContent = `${totalPrice.toLocaleString('vi-VN')} đ`;

    if (orderModal) orderModal.style.display = 'flex';
});

// 10. Đóng Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

window.addEventListener('click', (e) => {
    if (e.target === orderModal) orderModal.style.display = 'none';
    if (e.target === cartModal) cartModal.style.display = 'none';
});

// 11. Chỉ cho nhập số vào ô SĐT
phoneInput?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// 12. Xử lý gửi Form Xác nhận đặt hàng
orderForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const phoneRegex = /^0[0-9]{9}$/;
    const phoneValue = phoneInput ? phoneInput.value.trim() : '';
    const fullnameValue = document.getElementById('fullname')?.value.trim() || '';
    const provinceValue = document.getElementById('province')?.value || '';
    const districtValue = document.getElementById('district')?.value.trim() || '';
    const streetValue = document.getElementById('street')?.value.trim() || '';
    const fullAddress = `${streetValue}, ${districtValue}, ${provinceValue}`;

    if (!phoneRegex.test(phoneValue)) {
        if (phoneError) phoneError.style.display = 'block';
        if (phoneInput) phoneInput.style.borderColor = '#d0021b';
        return;
    }

    if (phoneError) phoneError.style.display = 'none';
    if (phoneInput) phoneInput.style.borderColor = '#ccc';

    let orderTotal = (currentBasePrice + currentColorOffset) * quantity;
    let orderQty = quantity;
    let orderProdName = `iPhone 17 Pro (${selectedStorageName} - ${selectedColorName})`;

    if (cartItems.length > 0) {
        orderTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        orderQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
        orderProdName = cartItems.map(i => `${i.name} (${i.storage})`).join(', ');
    }

    // Lưu đơn hàng vào LocalStorage
    try {
        let adminOrders = JSON.parse(localStorage.getItem('PHONE_STORE_ORDERS')) || [];
        const today = new Date().toISOString().split('T')[0];
        const newOrderId = '#DH-' + (adminOrders.length + 101);

        const newOrderObj = {
            id: newOrderId,
            customerName: fullnameValue,
            phone: phoneValue,
            province: provinceValue,
            address: fullAddress,
            brand: 'Apple',
            product: orderProdName,
            quantity: orderQty,
            total: orderTotal,
            status: 'pending',
            date: today
        };

        adminOrders.unshift(newOrderObj);
        localStorage.setItem('PHONE_STORE_ORDERS', JSON.stringify(adminOrders));

        alert(
            `🎉 ĐẶT HÀNG THÀNH CÔNG!\n\n` +
            `• Mã đơn hàng: ${newOrderId}\n` +
            `• Người nhận: ${fullnameValue}\n` +
            `• Số điện thoại: ${phoneValue}\n` +
            `• Sản phẩm: ${orderProdName}\n` +
            `• Tổng tiền: ${orderTotal.toLocaleString('vi-VN')} ₫`
        );
    } catch (err) {
        alert('Đặt hàng thành công!');
    }

    // Reset Form & Giỏ hàng sau khi xong
    if (orderModal) orderModal.style.display = 'none';
    orderForm.reset();
    cartItems = [];
    quantity = 1;
    if (qtyInput) qtyInput.value = 1;
    updateCartBadge();
});