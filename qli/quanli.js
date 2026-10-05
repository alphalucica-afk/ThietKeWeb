/* ========================================================
 * TRANG QUẢN TRỊ PHONE STORE (Apple, Xiaomi, Vivo)
 * ======================================================== */

/* 1. DỮ LIỆU MẶC ĐỊNH & KHỞI TẠO LOCALSTORAGE */
const DEFAULT_PRODUCTS = [
  { id: '#AP-01', name: 'iPhone 16 Pro Max 256GB', brand: 'Apple', price: 34990000, stock: 15, sold: 45 },
  { id: '#AP-02', name: 'iPhone 15 Pro 128GB', brand: 'Apple', price: 25990000, stock: 2, sold: 30 },
  { id: '#XM-01', name: 'Xiaomi 14 Ultra 512GB', brand: 'Xiaomi', price: 29990000, stock: 8, sold: 22 },
  { id: '#XM-02', name: 'Xiaomi Redmi Note 13', brand: 'Xiaomi', price: 4990000, stock: 25, sold: 3 },
  { id: '#VV-01', name: 'Vivo X100 Pro 5G', brand: 'Vivo', price: 24990000, stock: 12, sold: 18 },
  { id: '#VV-02', name: 'Vivo Y100 8GB/128GB', brand: 'Vivo', price: 6990000, stock: 30, sold: 1 }
];

const DEFAULT_ORDERS = [
  { id: '#DH-101', customerName: 'Nguyễn Văn A', phone: '0987654321', province: 'Hà Nội', address: 'Hoàn Kiếm, Hà Nội', brand: 'Apple', product: 'iPhone 16 Pro Max 256GB', quantity: 1, total: 34990000, status: 'completed', date: '2026-10-01' },
  { id: '#DH-102', customerName: 'Trần Thị B', phone: '0912345678', province: 'TP. Hồ Chí Minh', address: 'Quận 1, TP.HCM', brand: 'Xiaomi', product: 'Xiaomi 14 Ultra 512GB', quantity: 1, total: 29990000, status: 'processing', date: '2026-10-01' },
  { id: '#DH-103', customerName: 'Lê Hoàng C', phone: '0933445566', province: 'Đà Nẵng', address: 'Hải Châu, Đà Nẵng', brand: 'Vivo', product: 'Vivo X100 Pro 5G', quantity: 1, total: 24990000, status: 'pending', date: '2026-10-01' },
  { id: '#DH-090', customerName: 'Phạm Minh D', phone: '0988776655', province: 'Hà Nội', address: 'Cầu Giấy, Hà Nội', brand: 'Apple', product: 'iPhone 15 Pro 128GB', quantity: 1, total: 25990000, status: 'completed', date: '2026-09-15' },
  { id: '#DH-091', customerName: 'Hoàng Anh E', phone: '0977112233', province: 'Hải Phòng', address: 'Hồng Bàng, HP', brand: 'Xiaomi', product: 'Xiaomi 14 Ultra 512GB', quantity: 1, total: 29990000, status: 'completed', date: '2026-09-20' }
];

const DEFAULT_USERS = [
  { id: 'KH-01', name: 'Nguyễn Văn A', phone: '0987654321', province: 'Hà Nội', orders: 2, totalSpent: 60980000, rank: 'VIP' },
  { id: 'KH-02', name: 'Trần Thị B', phone: '0912345678', province: 'TP. Hồ Chí Minh', orders: 1, totalSpent: 29990000, rank: 'Vàng' },
  { id: 'KH-03', name: 'Lê Hoàng C', phone: '0933445566', province: 'Đà Nẵng', orders: 1, totalSpent: 24990000, rank: 'Vàng' }
];

const DEFAULT_PROMOTIONS = [
  { code: 'KM-KM20', title: 'Ưu đãi Khách Hàng Mới', discount: 10, target: 'Tất cả hãng', expiry: '2026-12-31', active: true },
  { code: 'APPLE-HOT', title: 'Siêu Sale Apple Tháng 10', discount: 15, target: 'Apple', expiry: '2026-10-20', active: true },
  { code: 'XIAOMI-AI', title: 'Tuần Lễ Trải Nghiệm Xiaomi AI', discount: 12, target: 'Xiaomi', expiry: '2026-11-15', active: true }
];

let products = JSON.parse(localStorage.getItem('PHONE_STORE_PRODUCTS')) || DEFAULT_PRODUCTS;
let orders = JSON.parse(localStorage.getItem('PHONE_STORE_ORDERS')) || DEFAULT_ORDERS;
let users = JSON.parse(localStorage.getItem('PHONE_STORE_USERS')) || DEFAULT_USERS;
let promotions = JSON.parse(localStorage.getItem('PHONE_STORE_PROMOTIONS')) || DEFAULT_PROMOTIONS;

function saveProducts() { localStorage.setItem('PHONE_STORE_PRODUCTS', JSON.stringify(products)); }
function saveOrders() { localStorage.setItem('PHONE_STORE_ORDERS', JSON.stringify(orders)); }
function saveUsers() { localStorage.setItem('PHONE_STORE_USERS', JSON.stringify(users)); }
function savePromotions() { localStorage.setItem('PHONE_STORE_PROMOTIONS', JSON.stringify(promotions)); }

/* Map nhãn trạng thái tiếng Việt & màu sắc */
const STATUS_MAP = {
  pending: { label: 'Đang chờ xử lý', class: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  processing: { label: 'Đang lên đơn', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  shipping: { label: 'Đang giao hàng', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' },
  completed: { label: 'Đã nhận hàng', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  cancelled: { label: 'Đã hủy', class: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' }
};

/* ========================================================
 * 2. GIAO DIỆN, CHUYỂN TAB, DARK MODE & RESPONSIVE
 * ======================================================== */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebarNav');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;
  sidebar.classList.toggle('-translate-x-full');
  if (backdrop) backdrop.classList.toggle('hidden');
}

function initTheme() {
  const savedTheme = localStorage.getItem('PHONE_STORE_THEME');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('PHONE_STORE_THEME', isDark ? 'dark' : 'light');
}

function handleLogout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?')) {
    showToast('Đang đăng xuất...', 'info');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 600);
  }
}

function switchView(viewId, evt) {
  document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(viewId);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add('active-nav');
  }

  // Tự đóng sidebar trên màn hình di động khi bấm chuyển tab
  if (window.innerWidth < 768) {
    const sidebar = document.getElementById('sidebarNav');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
      sidebar.classList.add('-translate-x-full');
      if (backdrop) backdrop.classList.add('hidden');
    }
  }

  if (viewId === 'view-dashboard') { 
    updateDashboardKPIs(); 
    renderRecentOrdersTable(); 
    renderBestAndSlowSellers(); 
    updateDashboardChart();
  }
  if (viewId === 'view-orders') renderFullOrdersTable();
  if (viewId === 'view-products') renderProductsTable();
  if (viewId === 'view-promotions') renderPromotionsTable();
  if (viewId === 'view-users') renderUsersTable();
  if (viewId === 'view-reports') {
    const todayStr = new Date().toISOString().split('T')[0];
    const picker = document.getElementById('reportDatePicker');
    if (picker) {
      if (!picker.value) picker.value = todayStr;
      renderDailySalesReport(picker.value);
    }
    renderMonthlyRevenueComparison();
  }
}

/* ========================================================
 * 3. DASHBOARD (KPI, LỌC THỜI GIAN, BIỂU ĐỒ, SẢN PHẨM HOT)
 * ======================================================== */
function getFilteredDashboardOrders() {
  const start = document.getElementById('dashStartDate')?.value;
  const end = document.getElementById('dashEndDate')?.value;

  return orders.filter(o => {
    if (start && o.date < start) return false;
    if (end && o.date > end) return false;
    return true;
  });
}

function handleDashboardDateChange() {
  updateDashboardKPIs();
  renderRecentOrdersTable();
  updateDashboardChart();
  showToast('Đã cập nhật số liệu theo khoảng thời gian!', 'info');
}

function resetDashboardDateFilter() {
  if (document.getElementById('dashStartDate')) document.getElementById('dashStartDate').value = '';
  if (document.getElementById('dashEndDate')) document.getElementById('dashEndDate').value = '';
  updateDashboardKPIs();
  renderRecentOrdersTable();
  updateDashboardChart();
  showToast('Đã hiển thị toàn bộ thời gian!', 'info');
}

function updateDashboardKPIs() {
  const filteredOrders = getFilteredDashboardOrders();
  const totalRev = filteredOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalSold = filteredOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + (o.quantity || 1) : sum, 0);

  if (document.getElementById('kpiRevenue')) document.getElementById('kpiRevenue').textContent = totalRev.toLocaleString('vi-VN') + ' ₫';
  if (document.getElementById('kpiOrders')) document.getElementById('kpiOrders').textContent = filteredOrders.length;
  if (document.getElementById('kpiStock')) document.getElementById('kpiStock').textContent = totalStock + ' máy';
  if (document.getElementById('kpiSold')) document.getElementById('kpiSold').textContent = totalSold + ' máy';

  // Tính tăng trưởng doanh thu so với tháng trước
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  const currMonthRev = orders.filter(o => o.status !== 'cancelled' && o.date.startsWith(currentMonthStr)).reduce((s, o) => s + o.total, 0);
  const prevMonthRev = orders.filter(o => o.status !== 'cancelled' && o.date.startsWith(prevMonthStr)).reduce((s, o) => s + o.total, 0);

  let growthPct = 0;
  if (prevMonthRev > 0) {
    growthPct = (((currMonthRev - prevMonthRev) / prevMonthRev) * 100).toFixed(1);
  } else if (currMonthRev > 0) {
    growthPct = 100;
  }

  const growthEl = document.getElementById('kpiMonthGrowth');
  if (growthEl) {
    if (growthPct >= 0) {
      growthEl.className = "text-xl font-bold mt-1 text-emerald-600";
      growthEl.textContent = `+${growthPct}%`;
    } else {
      growthEl.className = "text-xl font-bold mt-1 text-rose-600";
      growthEl.textContent = `${growthPct}%`;
    }
  }
}

function renderBestAndSlowSellers() {
  const bestEl = document.getElementById('topBestSellers');
  const slowEl = document.getElementById('topSlowSellers');
  if (!bestEl || !slowEl) return;

  const sortedBySold = [...products].sort((a, b) => b.sold - a.sold);
  const topBest = sortedBySold.slice(0, 3);

  const sortedBySlow = [...products].sort((a, b) => (b.stock - b.sold) - (a.stock - a.sold));
  const topSlow = sortedBySlow.slice(0, 3);

  bestEl.innerHTML = topBest.map((p, idx) => `
    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
      <div class="flex items-center gap-3">
        <span class="w-6 h-6 flex items-center justify-center rounded-full font-black text-xs ${idx === 0 ? 'bg-amber-400 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'}">${idx + 1}</span>
        <div>
          <div class="font-bold text-sm">${p.name}</div>
          <div class="text-xs text-slate-400">${p.brand} &bull; Tồn kho: ${p.stock} máy</div>
        </div>
      </div>
      <div class="text-right">
        <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Đã bán ${p.sold}</span>
      </div>
    </div>
  `).join('');

  slowEl.innerHTML = topSlow.map((p, idx) => `
    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700/50">
      <div class="flex items-center gap-3">
        <span class="w-6 h-6 flex items-center justify-center rounded-full font-black text-xs bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">${idx + 1}</span>
        <div>
          <div class="font-bold text-sm">${p.name}</div>
          <div class="text-xs text-slate-400">${p.brand} &bull; Đã bán: ${p.sold} máy</div>
        </div>
      </div>
      <div class="text-right">
        <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">Tồn đọng ${p.stock} máy</span>
      </div>
    </div>
  `).join('');
}

function renderRecentOrdersTable() {
  const tbody = document.getElementById('recentOrdersTableBody');
  if (!tbody) return;

  const filtered = getFilteredDashboardOrders();
  const displayList = filtered.slice(0, 5);

  if (displayList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">Không có đơn hàng nào trong khoảng thời gian này.</td></tr>`;
    return;
  }

  tbody.innerHTML = displayList.map(o => {
    const st = STATUS_MAP[o.status] || STATUS_MAP.pending;
    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
        <td class="py-3 px-4 font-mono font-bold text-brand-600">${o.id}</td>
        <td class="py-3 px-4 font-bold">${o.customerName}</td>
        <td class="py-3 px-4">${o.product} <span class="text-xs text-slate-400">(${o.brand})</span></td>
        <td class="py-3 px-4 font-extrabold text-emerald-600">${o.total.toLocaleString('vi-VN')} ₫</td>
        <td class="py-3 px-4"><span class="px-2.5 py-1 rounded-full text-xs font-bold ${st.class}">${st.label}</span></td>
        <td class="py-3 px-4">
          <select onchange="updateOrderStatus('${o.id}', this.value)" class="text-xs border rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-700 dark:border-slate-600 focus:outline-none">
            <option value="pending" ${o.status==='pending'?'selected':''}>Đang chờ xử lý</option>
            <option value="processing" ${o.status==='processing'?'selected':''}>Đang lên đơn</option>
            <option value="shipping" ${o.status==='shipping'?'selected':''}>Đang giao hàng</option>
            <option value="completed" ${o.status==='completed'?'selected':''}>Đã nhận hàng</option>
            <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Hủy đơn</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

/* ========================================================
 * 4. QUẢN LÝ ĐƠN HÀNG (CẬP NHẬT TRẠNG THÁI, XÓA, LỌC)
 * ======================================================== */
function updateOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  const oldStatus = order.status;
  if (oldStatus === newStatus) return;

  // Xử lý tồn kho khi đơn bị hủy hoặc khôi phục
  const matchedProd = products.find(p => p.name === order.product || (p.brand === order.brand && order.product.includes(p.name)));
  if (matchedProd) {
    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      matchedProd.stock += (order.quantity || 1);
      matchedProd.sold = Math.max(0, matchedProd.sold - (order.quantity || 1));
      saveProducts();
    } else if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
      matchedProd.stock = Math.max(0, matchedProd.stock - (order.quantity || 1));
      matchedProd.sold += (order.quantity || 1);
      saveProducts();
    }
  }

  order.status = newStatus;
  saveOrders();
  syncUsersFromOrders();

  updateDashboardKPIs();
  renderRecentOrdersTable();
  renderFullOrdersTable();
  renderProductsTable();
  renderBestAndSlowSellers();
  updateDashboardChart();

  showToast(`Đã chuyển đơn ${orderId} sang "${STATUS_MAP[newStatus]?.label || newStatus}"`, 'success');
}

function deleteOrder(orderId) {
  if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${orderId} khỏi hệ thống?`)) return;
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) {
    orders.splice(idx, 1);
    saveOrders();
    syncUsersFromOrders();
    updateDashboardKPIs();
    renderRecentOrdersTable();
    renderFullOrdersTable();
    updateDashboardChart();
    showToast(`Đã xóa thành công đơn ${orderId}!`, 'info');
  }
}

function applyOrdersFilter() {
  const brandEl = document.getElementById('ordersBrandFilter');
  const statusEl = document.getElementById('ordersStatusFilter');
  const searchEl = document.getElementById('ordersSearchInput');

  const brand = brandEl ? brandEl.value : 'all';
  const status = statusEl ? statusEl.value : 'all';
  const search = searchEl ? searchEl.value.toLowerCase().trim() : '';

  const filtered = orders.filter(o => {
    const matchBrand = (brand === 'all' || o.brand === brand);
    const matchStatus = (status === 'all' || o.status === status);
    const matchSearch = (
      o.customerName.toLowerCase().includes(search) ||
      (o.province && o.province.toLowerCase().includes(search)) ||
      o.id.toLowerCase().includes(search) ||
      o.product.toLowerCase().includes(search)
    );
    return matchBrand && matchStatus && matchSearch;
  });

  renderOrdersList(filtered);
}

function renderFullOrdersTable() {
  applyOrdersFilter();
}

function renderOrdersList(list) {
  const tbody = document.getElementById('fullOrdersTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400">Không tìm thấy đơn hàng nào phù hợp bộ lọc.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(o => {
    const st = STATUS_MAP[o.status] || STATUS_MAP.pending;
    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
        <td class="py-3 px-4 font-mono font-bold text-brand-600">${o.id}</td>
        <td class="py-3 px-4">
          <div class="font-bold">${o.customerName}</div>
          <div class="text-xs text-slate-400">${o.phone || ''}</div>
        </td>
        <td class="py-3 px-4">${o.province}</td>
        <td class="py-3 px-4">
          <div>${o.product} <span class="font-semibold text-xs text-slate-500">(x${o.quantity || 1})</span></div>
          <span class="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded ${o.brand === 'Apple' ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200' : o.brand === 'Xiaomi' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'}">${o.brand}</span>
        </td>
        <td class="py-3 px-4 font-extrabold text-emerald-600">${o.total.toLocaleString('vi-VN')} ₫</td>
        <td class="py-3 px-4 text-xs text-slate-400">${o.date}</td>
        <td class="py-3 px-4"><span class="px-2.5 py-1 rounded-full text-xs font-bold ${st.class}">${st.label}</span></td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-2">
            <select onchange="updateOrderStatus('${o.id}', this.value)" class="text-xs border rounded-lg px-2 py-1 bg-white dark:bg-slate-700 dark:border-slate-600 focus:outline-none">
              <option value="pending" ${o.status==='pending'?'selected':''}>Chờ xử lý</option>
              <option value="processing" ${o.status==='processing'?'selected':''}>Lên đơn</option>
              <option value="shipping" ${o.status==='shipping'?'selected':''}>Giao hàng</option>
              <option value="completed" ${o.status==='completed'?'selected':''}>Đã nhận</option>
              <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Hủy đơn</option>
            </select>
            <button onclick="deleteOrder('${o.id}')" class="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition" title="Xóa đơn hàng">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

/* ========================================================
 * 5. KHO HÀNG SẢN PHẨM 3 HÃNG (TÌM KIẾM, LỌC, NHẬP, XÓA)
 * ======================================================== */
function applyProductsFilter() {
  const brand = document.getElementById('productsBrandFilter')?.value || 'all';
  const search = document.getElementById('productsSearchInput')?.value.toLowerCase().trim() || '';

  const filtered = products.filter(p => {
    const matchBrand = (brand === 'all' || p.brand === brand);
    const matchSearch = (p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search));
    return matchBrand && matchSearch;
  });

  renderProductsList(filtered);
}

function renderProductsTable() {
  applyProductsFilter();
}

function renderProductsList(list) {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-400">Không tìm thấy sản phẩm nào trong kho.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(p => `
    <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
      <td class="py-3 px-4 font-mono font-bold text-slate-500">${p.id}</td>
      <td class="py-3 px-4 font-bold">${p.name}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${p.brand === 'Apple' ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200' : p.brand === 'Xiaomi' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'}">
          ${p.brand}
        </span>
      </td>
      <td class="py-3 px-4 font-extrabold text-emerald-600">${p.price.toLocaleString('vi-VN')} ₫</td>
      <td class="py-3 px-4">
        <span class="font-bold ${p.stock < 5 ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded' : ''}">${p.stock} máy</span>
      </td>
      <td class="py-3 px-4 text-slate-500 font-medium">${p.sold} máy</td>
      <td class="py-3 px-4">
        ${p.sold >= 20 ? '<span class="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">🔥 Bán chạy</span>' : p.stock >= 20 ? '<span class="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">⚠️ Bán chậm</span>' : '<span class="text-xs text-slate-400">Ổn định</span>'}
      </td>
      <td class="py-3 px-4 text-center">
        <div class="flex items-center justify-center gap-1">
          <button onclick="restockProduct('${p.id}')" class="text-emerald-600 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition text-xs font-semibold flex items-center gap-1" title="Nhập thêm hàng vào kho">
            <i class="fa-solid fa-plus-circle"></i> Nhập thêm
          </button>
          <button onclick="deleteProduct('${p.id}')" class="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-xs" title="Xóa sản phẩm">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function restockProduct(prodId) {
  const prod = products.find(p => p.id === prodId);
  if (!prod) return;
  const amountStr = prompt(`Nhập số lượng máy nhập thêm cho [${prod.name}]:`, "10");
  if (!amountStr) return;
  const amount = parseInt(amountStr, 10);
  if (isNaN(amount) || amount <= 0) {
    showToast('Số lượng nhập phải là số lớn hơn 0!', 'error');
    return;
  }

  prod.stock += amount;
  saveProducts();
  renderProductsTable();
  updateDashboardKPIs();
  renderBestAndSlowSellers();
  showToast(`Đã nhập thêm +${amount} máy cho [${prod.name}]!`, 'success');
}

function deleteProduct(prodId) {
  const prod = products.find(p => p.id === prodId);
  if (!prod) return;
  if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${prod.name}" (${prod.id}) khỏi kho hàng?`)) return;

  const idx = products.findIndex(p => p.id === prodId);
  if (idx !== -1) {
    products.splice(idx, 1);
    saveProducts();
    renderProductsTable();
    updateDashboardKPIs();
    renderBestAndSlowSellers();
    populateFormProducts();
    showToast(`Đã xóa sản phẩm [${prod.name}]!`, 'info');
  }
}

/* ========================================================
 * 6. QUẢN LÝ KHÁCH HÀNG (TỔNG HỢP TỪ ĐƠN HÀNG, PHÂN HẠNG)
 * ======================================================== */
function syncUsersFromOrders() {
  const userMap = new Map();

  // Nạp danh sách khách hàng ban đầu
  users.forEach(u => {
    if (u.phone) userMap.set(u.phone, { ...u, orders: 0, totalSpent: 0 });
  });

  // Quét từ danh sách đơn hàng thực tế
  orders.forEach(o => {
    if (!o.phone) return;
    if (!userMap.has(o.phone)) {
      userMap.set(o.phone, {
        id: 'KH-' + (userMap.size + 1).toString().padStart(2, '0'),
        name: o.customerName || 'Khách hàng',
        phone: o.phone,
        province: o.province || 'Hà Nội',
        orders: 0,
        totalSpent: 0,
        rank: 'Thành viên mới'
      });
    }

    const u = userMap.get(o.phone);
    if (o.status !== 'cancelled') {
      u.orders = (u.orders || 0) + 1;
      u.totalSpent = (u.totalSpent || 0) + o.total;
    }
    if (o.customerName) u.name = o.customerName;
    if (o.province) u.province = o.province;

    // Phân hạng khách hàng
    if (u.totalSpent >= 50000000) u.rank = 'VIP';
    else if (u.totalSpent >= 20000000) u.rank = 'Vàng';
    else if (u.orders >= 2) u.rank = 'Thân thiết';
    else u.rank = 'Thành viên mới';
  });

  users = Array.from(userMap.values());
  saveUsers();
}

function applyUsersFilter() {
  const search = document.getElementById('usersSearchInput')?.value.toLowerCase().trim() || '';
  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search) ||
    u.phone.toLowerCase().includes(search) ||
    (u.province && u.province.toLowerCase().includes(search))
  );
  renderUsersList(filtered);
}

function renderUsersTable() {
  syncUsersFromOrders();
  applyUsersFilter();
}

function renderUsersList(list) {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">Không tìm thấy khách hàng nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(u => {
    let rankBadge = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    if (u.rank === 'VIP') rankBadge = 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 font-extrabold';
    else if (u.rank === 'Vàng') rankBadge = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 font-bold';
    else if (u.rank === 'Thân thiết') rankBadge = 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-bold';

    return `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
        <td class="py-3 px-4 font-bold">${u.name}</td>
        <td class="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">${u.phone}</td>
        <td class="py-3 px-4">${u.province}</td>
        <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">${u.orders} đơn</td>
        <td class="py-3 px-4 font-extrabold text-emerald-600">${u.totalSpent.toLocaleString('vi-VN')} ₫</td>
        <td class="py-3 px-4">
          <span class="px-2.5 py-1 rounded-full text-xs ${rankBadge}">${u.rank}</span>
        </td>
        <td class="py-3 px-4 text-center">
          <button onclick="showCustomerOrders('${u.phone}', '${u.name}')" class="text-xs bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-900 text-brand-600 px-3 py-1.5 rounded-lg font-semibold transition">
            <i class="fa-solid fa-receipt mr-1"></i> Xem đơn hàng
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function showCustomerOrders(phone, name) {
  const custOrders = orders.filter(o => o.phone === phone);
  const modalTitle = document.getElementById('custModalTitle');
  const modalBody = document.getElementById('custModalBody');
  if (!modalTitle || !modalBody) return;

  modalTitle.textContent = `Lịch sử đơn hàng: ${name} (${phone})`;

  if (custOrders.length === 0) {
    modalBody.innerHTML = `<div class="p-6 text-center text-slate-400">Khách hàng chưa có đơn hàng nào trong hệ thống.</div>`;
  } else {
    modalBody.innerHTML = custOrders.map(o => {
      const st = STATUS_MAP[o.status] || STATUS_MAP.pending;
      return `
        <div class="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700 space-y-1">
          <div class="flex justify-between items-center">
            <span class="font-mono font-bold text-brand-600">${o.id}</span>
            <span class="text-xs px-2 py-0.5 rounded-full font-bold ${st.class}">${st.label}</span>
          </div>
          <div class="font-semibold text-slate-800 dark:text-slate-100">${o.product} <span class="text-xs text-slate-400">(x${o.quantity || 1})</span></div>
          <div class="flex justify-between items-center text-xs text-slate-400">
            <span>Ngày đặt: ${o.date}</span>
            <span class="font-bold text-emerald-600 text-sm">${o.total.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
      `;
    }).join('');
  }

  openModal('customerOrdersModal');
}

/* ========================================================
 * 7. QUẢN LÝ KHUYẾN MẠI
 * ======================================================== */
function renderPromotionsTable() {
  const tbody = document.getElementById('promotionsTableBody');
  if (!tbody) return;

  if (promotions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">Chưa có mã khuyến mại nào được thiết lập.</td></tr>`;
    return;
  }

  tbody.innerHTML = promotions.map((p, idx) => `
    <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
      <td class="py-3 px-4 font-mono font-bold text-brand-600">${p.code}</td>
      <td class="py-3 px-4 font-bold">${p.title}</td>
      <td class="py-3 px-4 font-extrabold text-rose-600">Giảm ${p.discount}%</td>
      <td class="py-3 px-4 font-semibold">${p.target}</td>
      <td class="py-3 px-4 text-xs text-slate-400">${p.expiry}</td>
      <td class="py-3 px-4">
        <button onclick="togglePromoActive(${idx})" class="px-2.5 py-1 rounded-full text-xs font-bold transition ${p.active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}">
          ${p.active ? 'Đang hoạt động' : 'Đã tạm dừng'}
        </button>
      </td>
      <td class="py-3 px-4 text-center">
        <button onclick="deletePromo(${idx})" class="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-xs" title="Xóa khuyến mại">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function togglePromoActive(index) {
  if (promotions[index]) {
    promotions[index].active = !promotions[index].active;
    savePromotions();
    renderPromotionsTable();
    showToast(`Đã thay đổi trạng thái mã [${promotions[index].code}]!`, 'info');
  }
}

function deletePromo(index) {
  if (!confirm(`Bạn có chắc muốn xóa mã khuyến mại "${promotions[index]?.code}"?`)) return;
  const code = promotions[index]?.code;
  promotions.splice(index, 1);
  savePromotions();
  renderPromotionsTable();
  showToast(`Đã xóa khuyến mại [${code}]!`, 'info');
}

function handleCreatePromo(e) {
  e.preventDefault();
  const code = document.getElementById('promoCode').value.trim().toUpperCase();
  const title = document.getElementById('promoTitle').value.trim();
  const discount = parseInt(document.getElementById('promoDiscount').value, 10) || 0;
  const target = document.getElementById('promoTarget').value;
  const expiry = document.getElementById('promoExpiry').value;

  if (promotions.some(p => p.code === code)) {
    showToast(`Mã khuyến mại "${code}" đã tồn tại! Vui lòng nhập mã khác.`, 'error');
    return;
  }

  promotions.push({ code, title, discount, target, expiry, active: true });
  savePromotions();
  renderPromotionsTable();
  closeModal('addPromoModal');
  document.getElementById('newPromoForm').reset();
  showToast(`Tạo thành công khuyến mại [${code}] giảm ${discount}%!`, 'success');
}

/* ========================================================
 * 8. BÁO CÁO DOANH THU & XUẤT CSV (EXCEL CHUẨN UTF-8)
 * ======================================================== */
function renderMonthlyRevenueComparison() {
  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth() + 1;

  const prevMonthDate = new Date(currYear, currMonth - 2, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth() + 1;

  const currMonthStr = `${currYear}-${String(currMonth).padStart(2, '0')}`;
  const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

  const currRev = orders.filter(o => o.status !== 'cancelled' && o.date.startsWith(currMonthStr)).reduce((s, o) => s + o.total, 0);
  const prevRev = orders.filter(o => o.status !== 'cancelled' && o.date.startsWith(prevMonthStr)).reduce((s, o) => s + o.total, 0);

  const diff = currRev - prevRev;
  let pct = 0;
  if (prevRev > 0) pct = ((diff / prevRev) * 100).toFixed(1);

  if (document.getElementById('prevMonthRevText')) document.getElementById('prevMonthRevText').textContent = prevRev.toLocaleString('vi-VN') + ' ₫';
  if (document.getElementById('currMonthRevText')) document.getElementById('currMonthRevText').textContent = currRev.toLocaleString('vi-VN') + ' ₫';
  
  const diffEl = document.getElementById('monthDiffText');
  if (diffEl) {
    if (diff >= 0) {
      diffEl.className = "text-xl font-black text-emerald-600 mt-1";
      diffEl.textContent = `+${diff.toLocaleString('vi-VN')} ₫ (+${pct}%)`;
    } else {
      diffEl.className = "text-xl font-black text-rose-600 mt-1";
      diffEl.textContent = `${diff.toLocaleString('vi-VN')} ₫ (${pct}%)`;
    }
  }
}

function renderDailySalesReport(date) {
  let apple = 0, xiaomi = 0, vivo = 0;
  orders.filter(o => o.date === date && o.status !== 'cancelled').forEach(o => {
    if (o.brand === 'Apple') apple += o.total;
    if (o.brand === 'Xiaomi') xiaomi += o.total;
    if (o.brand === 'Vivo') vivo += o.total;
  });

  if (document.getElementById('dailyAppleRevenue')) document.getElementById('dailyAppleRevenue').textContent = apple.toLocaleString('vi-VN') + ' ₫';
  if (document.getElementById('dailyXiaomiRevenue')) document.getElementById('dailyXiaomiRevenue').textContent = xiaomi.toLocaleString('vi-VN') + ' ₫';
  if (document.getElementById('dailyVivoRevenue')) document.getElementById('dailyVivoRevenue').textContent = vivo.toLocaleString('vi-VN') + ' ₫';
}

function exportReportCSV() {
  let csvContent = "Mã Đơn,Khách Hàng,Số Điện Thoại,Tỉnh Thành,Hãng,Sản Phẩm,Số Lượng,Tổng Tiền,Trạng Thái,Ngày Đặt\n";
  orders.forEach(o => {
    const st = STATUS_MAP[o.status]?.label || o.status;
    const safeProduct = (o.product || '').replace(/"/g, '""');
    const safeAddress = (o.province || '').replace(/"/g, '""');
    csvContent += `"${o.id}","${o.customerName}","${o.phone || ''}","${safeAddress}","${o.brand}","${safeProduct}",${o.quantity || 1},${o.total},"${st}","${o.date}"\n`;
  });

  // Sử dụng BOM \uFEFF để Excel mở tiếng Việt không bị lỗi font chữ
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Bao_Cao_Doanh_Thu_PhoneStore_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('Đã xuất báo cáo CSV thành công (chuẩn UTF-8 mở trực tiếp bằng Excel)!', 'success');
}

/* ========================================================
 * 9. MODAL & TẠO ĐƠN / SẢN PHẨM MỚI
 * ======================================================== */
function populateFormProducts() {
  const select = document.getElementById('formProductSelect');
  if (!select) return;
  select.innerHTML = products.map(p => `
    <option value="${p.id}" data-price="${p.price}" data-brand="${p.brand}" data-name="${p.name}">
      [${p.brand}] ${p.name} - ${p.price.toLocaleString('vi-VN')} ₫ (Kho: ${p.stock})
    </option>
  `).join('');
  updateFormOrderTotal();
}

function handleFormProductChange() { updateFormOrderTotal(); }

function updateFormOrderTotal() {
  const select = document.getElementById('formProductSelect');
  const totalText = document.getElementById('formOrderTotalText');
  if (!select || !totalText) return;

  const option = select.options[select.selectedIndex];
  if (!option) return;
  const price = parseInt(option.getAttribute('data-price'), 10) || 0;
  const qty = parseInt(document.getElementById('formQuantity').value, 10) || 1;
  totalText.textContent = (price * qty).toLocaleString('vi-VN') + ' ₫';
}

function handleCreateNewOrder(e) {
  e.preventDefault();
  const select = document.getElementById('formProductSelect');
  const option = select.options[select.selectedIndex];
  if (!option) return;

  const qty = parseInt(document.getElementById('formQuantity').value, 10) || 1;
  const prodId = option.value;
  const prod = products.find(p => p.id === prodId);

  if (prod && prod.stock < qty) {
    showToast(`Kho không đủ hàng! Hiện chỉ còn ${prod.stock} máy.`, 'error');
    return;
  }

  if (prod) {
    prod.stock -= qty;
    prod.sold += qty;
    saveProducts();
  }

  const price = parseInt(option.getAttribute('data-price'), 10) || 0;
  const total = price * qty;
  const nextId = '#DH-' + (orders.length + 101);

  const newOrder = {
    id: nextId,
    customerName: document.getElementById('formCustName').value.trim(),
    phone: document.getElementById('formCustPhone').value.trim(),
    province: document.getElementById('formProvince').value,
    address: `${document.getElementById('formStreetAddress').value.trim()}, ${document.getElementById('formDistrict').value.trim()}`,
    brand: option.getAttribute('data-brand'),
    product: option.getAttribute('data-name'),
    quantity: qty,
    total: total,
    status: document.getElementById('formOrderStatus').value || 'pending',
    date: new Date().toISOString().split('T')[0]
  };

  orders.unshift(newOrder);
  saveOrders();
  syncUsersFromOrders();

  updateDashboardKPIs();
  renderRecentOrdersTable();
  renderBestAndSlowSellers();
  renderProductsTable();
  updateDashboardChart();

  closeModal('addOrderModal');
  document.getElementById('newOrderForm').reset();
  showToast(`Tạo thành công đơn ${nextId}!`, 'success');
}

function handleCreateProduct(e) {
  e.preventDefault();
  const name = document.getElementById('prodName').value.trim();
  const brand = document.getElementById('prodBrand').value;
  const price = parseInt(document.getElementById('prodPrice').value, 10) || 0;
  const stock = parseInt(document.getElementById('prodStock').value, 10) || 0;
  const id = `#${brand.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 89 + 10)}`;

  products.push({ id, name, brand, price, stock, sold: 0 });
  saveProducts();

  renderProductsTable();
  renderBestAndSlowSellers();
  updateDashboardKPIs();
  populateFormProducts();

  closeModal('addProductModal');
  document.getElementById('newProductForm').reset();
  showToast(`Đã thêm sản phẩm [${name}] vào kho hàng!`, 'success');
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
  if (id === 'addOrderModal') populateFormProducts();
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

// Bấm ra ngoài nền mờ để tự đóng modal
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('fixed') && e.target.classList.contains('backdrop-blur-sm')) {
    e.target.classList.add('hidden');
  }
});

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-entry pointer-events-auto p-3.5 px-4 rounded-xl shadow-xl text-xs font-bold text-white flex items-center gap-2 ${type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800'}`;
  
  let icon = '<i class="fa-solid fa-circle-info"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation"></i>';

  toast.innerHTML = `${icon} <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* ========================================================
 * 10. BIỂU ĐỒ ĐỘNG (DỰA TRÊN DỮ LIỆU ĐƠN HÀNG THỰC TẾ)
 * ======================================================== */
let chartInstance = null;

function updateDashboardChart() {
  const ctx = document.getElementById('dailyCompareChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const filtered = getFilteredDashboardOrders();
  
  let dateLabels = [];
  const startInput = document.getElementById('dashStartDate')?.value;
  const endInput = document.getElementById('dashEndDate')?.value;

  if (startInput && endInput) {
    let cur = new Date(startInput);
    const end = new Date(endInput);
    while (cur <= end && dateLabels.length < 14) {
      dateLabels.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }
  }

  if (dateLabels.length === 0) {
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dateLabels.push(d.toISOString().split('T')[0]);
    }
  }

  // Đếm sản lượng máy bán được theo từng hãng cho mỗi ngày
  const appleData = dateLabels.map(date => 
    filtered.filter(o => o.date === date && o.brand === 'Apple' && o.status !== 'cancelled')
            .reduce((s, o) => s + (o.quantity || 1), 0)
  );
  const xiaomiData = dateLabels.map(date => 
    filtered.filter(o => o.date === date && o.brand === 'Xiaomi' && o.status !== 'cancelled')
            .reduce((s, o) => s + (o.quantity || 1), 0)
  );
  const vivoData = dateLabels.map(date => 
    filtered.filter(o => o.date === date && o.brand === 'Vivo' && o.status !== 'cancelled')
            .reduce((s, o) => s + (o.quantity || 1), 0)
  );

  const displayLabels = dateLabels.map(d => {
    const parts = d.split('-');
    return `${parts[2]}/${parts[1]}`;
  });

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: displayLabels,
      datasets: [
        { label: 'Apple', data: appleData, backgroundColor: '#0f172a', borderRadius: 5 },
        { label: 'Xiaomi', data: xiaomiData, backgroundColor: '#ea580c', borderRadius: 5 },
        { label: 'Vivo', data: vivoData, backgroundColor: '#2563eb', borderRadius: 5 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw} máy`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, precision: 0 }
        }
      }
    }
  });
}

/* ========================================================
 * 11. ĐỒNG BỘ REAL-TIME TỪ CÁC TRANG KHÁCH HÀNG
 * ======================================================== */
window.addEventListener('storage', (e) => {
  if (['PHONE_STORE_ORDERS', 'PHONE_STORE_PRODUCTS', 'PHONE_STORE_PROMOTIONS'].includes(e.key)) {
    products = JSON.parse(localStorage.getItem('PHONE_STORE_PRODUCTS')) || DEFAULT_PRODUCTS;
    orders = JSON.parse(localStorage.getItem('PHONE_STORE_ORDERS')) || DEFAULT_ORDERS;
    promotions = JSON.parse(localStorage.getItem('PHONE_STORE_PROMOTIONS')) || DEFAULT_PROMOTIONS;

    syncUsersFromOrders();
    updateDashboardKPIs();
    renderRecentOrdersTable();
    renderProductsTable();
    renderFullOrdersTable();
    renderBestAndSlowSellers();
    updateDashboardChart();

    showToast('🚀 Đã tự động cập nhật dữ liệu đơn hàng mới từ shop!', 'success');
  }
});

/* Khởi tạo trang khi tải xong */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  syncUsersFromOrders();
  updateDashboardKPIs();
  renderRecentOrdersTable();
  renderBestAndSlowSellers();
  updateDashboardChart();

  const todayStr = new Date().toISOString().split('T')[0];
  const reportPicker = document.getElementById('reportDatePicker');
  if (reportPicker) {
    reportPicker.value = todayStr;
    renderDailySalesReport(todayStr);
  }
});